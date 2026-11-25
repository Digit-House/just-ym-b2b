import { useEffect, useRef, useState } from "react";
import { DragDropContext, Draggable, DraggableProvided, Droppable } from "@hello-pangea/dnd";
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

// Thumbnails as data URLs keyed by source id + page index: each page is rendered once, so the drag clone and the dropped card show an <img> at once.
type ThumbCache = { urls: Map<string, string>; pending: Map<string, Promise<string>> };
const thumbKey = (s: PdfSource, i: number) => `${s.id}:${i}`;

const renderThumb = (cache: ThumbCache, source: PdfSource, index: number): Promise<string> => {
  const key = thumbKey(source, index);
  const hit = cache.pending.get(key);
  if (hit) return hit;
  const job = (async () => {
    let task: pdfjs.PDFDocumentLoadingTask | null = null;
    try {
      // pdf.js transfers the buffer to its worker, so give it a copy
      task = pdfjs.getDocument({ data: source.bytes.slice() });
      const doc = await task.promise;
      const page = await doc.getPage(index + 1);
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: 160 / base.width });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvas, viewport }).promise;
      const url = canvas.toDataURL("image/jpeg", 0.85);
      canvas.width = 0;
      canvas.height = 0;
      cache.urls.set(key, url);
      return url;
    } finally {
      task?.destroy();
      cache.pending.delete(key);
    }
  })();
  cache.pending.set(key, job);
  return job;
};

const Thumb = ({ cache, source, index }: { cache: ThumbCache; source?: PdfSource; index: number }) => {
  const key = source ? thumbKey(source, index) : "";
  const [url, setUrl] = useState<string | undefined>(() => cache.urls.get(key));
  const [loading, setLoading] = useState(!url && !!source);
  useEffect(() => {
    if (!source) return;
    const cached = cache.urls.get(key);
    if (cached) {
      setUrl(cached);
      setLoading(false);
      return;
    }
    let dead = false;
    renderThumb(cache, source, index)
      .then((u) => !dead && setUrl(u))
      .catch(() => {
        /* thumbnail is cosmetic */
      })
      .finally(() => !dead && setLoading(false));
    return () => {
      dead = true;
    };
  }, [cache, source, index, key]);
  return (
    <div className="relative flex h-40 items-center justify-center overflow-hidden rounded border bg-gray-50">
      {url && <img src={url} alt="" draggable={false} className="max-h-full max-w-full" />}
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
  const cacheRef = useRef<ThumbCache>({ urls: new Map(), pending: new Map() });

  // Drop thumbnails of sources that are gone.
  useEffect(() => {
    const live = new Set(sources.map((s) => s.id));
    for (const k of [...cacheRef.current.urls.keys()]) {
      if (!live.has(k.slice(0, k.lastIndexOf(":")))) cacheRef.current.urls.delete(k);
    }
  }, [sources]);

  const card = (p: PageRef, i: number, d: DraggableProvided) => {
    const src = sources.find((s) => s.id === p.srcId);
    return (
      <div
        ref={d.innerRef}
        {...d.draggableProps}
        {...d.dragHandleProps}
        className="w-32 shrink-0 rounded border bg-white p-1 text-xs"
      >
        <Thumb cache={cacheRef.current} source={src} index={p.srcIndex} />
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
    );
  };

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
        {/* The dialog has a transform, which breaks position:fixed drags, so the dragged card is a clone portalled to body (dnd z-index 5000 > dialog z-50). */}
        <Droppable
          droppableId="pdf-pages"
          direction="horizontal"
          renderClone={(prov, _snap, rubric) => card(pages[rubric.source.index], rubric.source.index, prov)}
        >
          {(prov) => (
            <div
              ref={prov.innerRef}
              {...prov.droppableProps}
              className="flex max-h-56 gap-3 overflow-auto pb-2"
            >
              {pages.map((p, i) => (
                <Draggable key={p.key} draggableId={p.key} index={i} isDragDisabled={busy}>
                  {(d) => card(p, i, d)}
                </Draggable>
              ))}
              {prov.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default PdfPageEditor;
