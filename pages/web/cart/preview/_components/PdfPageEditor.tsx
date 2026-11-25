import { useEffect, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import * as pdfjs from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ButtonSpinner from "@/components/ButtonSpinner";
import { PageRef, PdfSource, removeAt, reorder } from "./pdfHelpers";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

type Props = {
  sources: PdfSource[];
  pages: PageRef[];
  onChange: (pages: PageRef[]) => void;
  onAddFiles: (files: File[]) => void;
  mergedSize: number | null;
  maxBytes: number;
  busy: boolean;
};

const Thumb = ({ source, index }: { source?: PdfSource; index: number }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!source) return;
    let dead = false;
    let task: pdfjs.PDFDocumentLoadingTask | null = null;
    (async () => {
      try {
        // pdf.js transfers the buffer to its worker, so give it a copy
        task = pdfjs.getDocument({ data: source.bytes.slice() });
        const doc = await task.promise;
        const page = await doc.getPage(index + 1);
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: 160 / base.width });
        const canvas = ref.current;
        if (dead || !canvas) return;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas, viewport }).promise;
      } catch {
        /* thumbnail is cosmetic */
      } finally {
        if (!dead) setLoading(false);
      }
    })();
    return () => {
      dead = true;
      task?.destroy();
    };
  }, [source, index]);
  return (
    <div className="relative flex h-40 items-center justify-center overflow-hidden rounded border bg-gray-50">
      <canvas ref={ref} className="max-h-full max-w-full" />
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <ButtonSpinner />
        </span>
      )}
    </div>
  );
};

const PdfPageEditor = ({
  sources,
  pages,
  onChange,
  onAddFiles,
  mergedSize,
  maxBytes,
  busy,
}: Props) => {
  const addRef = useRef<HTMLInputElement>(null);
  const over = mergedSize != null && mergedSize > maxBytes;
  return (
    <div className="flex min-h-0 flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={addRef}
          type="file"
          multiple
          accept="application/pdf,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (files.length) onAddFiles(files);
          }}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => addRef.current?.click()}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add PDF or image
        </Button>
        <span className={over ? "text-sm font-medium text-red-600" : "text-sm text-gray-600"}>
          {mergedSize == null
            ? "Calculating size..."
            : `${mergedSize < 1024 * 1024 ? `${Math.max(1, Math.round(mergedSize / 1024))} KB` : `${(mergedSize / 1024 / 1024).toFixed(2)} MB`} of ${maxBytes / 1024 / 1024} MB`}
          {over && " - too large, delete pages or remove large files"}
        </span>
      </div>
      <DragDropContext
        onDragEnd={(r) => {
          if (r.destination) onChange(reorder(pages, r.source.index, r.destination.index));
        }}
      >
        <Droppable droppableId="pdf-pages" direction="horizontal">
          {(prov) => (
            <div
              ref={prov.innerRef}
              {...prov.droppableProps}
              className="flex max-h-56 gap-3 overflow-auto pb-2"
            >
              {pages.map((p, i) => {
                const src = sources.find((s) => s.id === p.srcId);
                return (
                  <Draggable key={p.key} draggableId={p.key} index={i} isDragDisabled={busy}>
                    {(d) => (
                      <div
                        ref={d.innerRef}
                        {...d.draggableProps}
                        {...d.dragHandleProps}
                        className="w-32 shrink-0 rounded border bg-white p-1 text-xs"
                      >
                        <Thumb source={src} index={p.srcIndex} />
                        <div className="mt-1 flex items-center justify-between gap-1">
                          <span className="min-w-0 truncate" title={src?.name}>
                            {i + 1}. {src?.name}
                          </span>
                          <button
                            type="button"
                            aria-label={`Delete page ${i + 1}`}
                            disabled={busy || pages.length <= 1}
                            title={pages.length <= 1 ? "Cannot delete the last page" : "Delete page"}
                            onClick={() => onChange(removeAt(pages, i))}
                            className="shrink-0 p-1 text-gray-500 hover:text-red-600 disabled:opacity-40"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {prov.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default PdfPageEditor;
