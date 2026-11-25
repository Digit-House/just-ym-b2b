import { PDFDocument } from "pdf-lib";
import { getBookingTicketViewUrl } from "@/graphql/booking";
import { getErrMsg } from "@/util/initData";

export const MAX_VOUCHER_BYTES = 4 * 1024 * 1024; // matches the backend presigned content-length-range
export const MAX_IMAGE_SIDE = 2000;

export type PdfSource = { id: string; name: string; bytes: Uint8Array };
export type PageRef = { key: string; srcId: string; srcIndex: number };

const A4 = { w: 595.28, h: 841.89 };
const MARGIN = 24;

export const isPdfType = (t: string) => t === "application/pdf";
export const isImageType = (t: string) =>
  ["image/jpeg", "image/png", "image/webp"].includes(t);

/** A4 portrait or landscape by aspect, image scaled to fit inside the margin and centred. */
export const fitImage = (w: number, h: number) => {
  const landscape = w > h;
  const page = landscape ? { w: A4.h, h: A4.w } : A4;
  const s = Math.min((page.w - 2 * MARGIN) / w, (page.h - 2 * MARGIN) / h);
  const dw = w * s;
  const dh = h * s;
  return { page, x: (page.w - dw) / 2, y: (page.h - dh) / 2, w: dw, h: dh };
};

/** One-page PDF holding the image. webp must be converted to png first. */
export const imageToPdfBytes = async (
  kind: "jpg" | "png",
  bytes: Uint8Array,
  w: number,
  h: number,
): Promise<Uint8Array> => {
  const doc = await PDFDocument.create();
  const img = kind === "jpg" ? await doc.embedJpg(bytes) : await doc.embedPng(bytes);
  const f = fitImage(w, h);
  const p = doc.addPage([f.page.w, f.page.h]);
  p.drawImage(img, { x: f.x, y: f.y, width: f.w, height: f.h });
  return doc.save();
};

/** Throws for encrypted or broken PDFs; returns the page count. */
export const countPages = async (bytes: Uint8Array) =>
  (await PDFDocument.load(bytes)).getPageCount();

export const pagesOf = (src: PdfSource, count: number): PageRef[] =>
  Array.from({ length: count }, (_, i) => ({
    key: `${src.id}:${i}:${Math.random().toString(36).slice(2, 8)}`,
    srcId: src.id,
    srcIndex: i,
  }));

export const reorder = <T,>(list: T[], from: number, to: number): T[] => {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length)
    return list;
  const next = list.slice();
  const [m] = next.splice(from, 1);
  next.splice(to, 0, m);
  return next;
};

/** Never removes the last page. */
export const removeAt = <T,>(list: T[], i: number): T[] =>
  list.length <= 1 || i < 0 || i >= list.length ? list : list.filter((_, j) => j !== i);

export const buildMerged = async (
  sources: PdfSource[],
  pages: PageRef[],
): Promise<Uint8Array> => {
  const out = await PDFDocument.create();
  const loaded = new Map<string, PDFDocument>();
  for (const p of pages) {
    let d = loaded.get(p.srcId);
    if (!d) {
      const s = sources.find((x) => x.id === p.srcId);
      if (!s) throw new Error("Missing source for page");
      d = await PDFDocument.load(s.bytes);
      loaded.set(p.srcId, d);
    }
    const [cp] = await out.copyPages(d, [p.srcIndex]);
    out.addPage(cp);
  }
  return out.save();
};

const canvasBytes = async (c: HTMLCanvasElement, type: string) => {
  const blob = await new Promise<Blob | null>((r) => c.toBlob(r, type, 0.85));
  if (!blob) throw new Error("Image could not be converted");
  return new Uint8Array(await blob.arrayBuffer());
};

const loadBitmap = async (file: File): Promise<ImageBitmap> => {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("Image could not be read");
  }
};

/** Image file -> one-page PDF bytes. Always redrawn on a canvas so EXIF rotation is applied and pixels match the page size; long side capped at 2000 px; PNG and webp become PNG, photos JPEG. */
export const imageFileToPdf = async (file: File): Promise<Uint8Array> => {
  const img = await loadBitmap(file);
  const long = Math.max(img.width, img.height);
  const scale = long > MAX_IMAGE_SIDE ? MAX_IMAGE_SIDE / long : 1;
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  try {
    const ctx = c.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    const isJpg = file.type === "image/jpeg";
    if (isJpg) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(img, 0, 0, w, h);
    const bytes = await canvasBytes(c, isJpg ? "image/jpeg" : "image/png");
    return await imageToPdfBytes(isJpg ? "jpg" : "png", bytes, w, h);
  } finally {
    img.close();
    c.width = 0;
    c.height = 0;
  }
};

export const isHttpUrl = (u?: string | null): u is string => !!u && /^https?:\/\//i.test(u);

/** Fetch a saved ticket uncached and make sure it really is a PDF (stored files carry a generic content type). */
export const fetchPdfBytes = async (url: string): Promise<Uint8Array> => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const bytes = new Uint8Array(await res.arrayBuffer());
  if (!new TextDecoder("latin1").decode(bytes.subarray(0, 1024)).includes("%PDF-")) {
    throw new Error("Not a PDF");
  }
  return bytes;
};

/** Saved ticket bytes via the signed view URL (the stored URL has no CORS); only a failed URL query (older backend, external ticket) falls back to the stored URL. */
export const fetchTicketBytes = async (bookingId: string, eTicketUrl: string): Promise<Uint8Array> => {
  let signed: string;
  try {
    signed = await getBookingTicketViewUrl(bookingId);
  } catch (err) {
    // The stored URL goes through the CDN (can be stale, no CORS): use it only when no signed URL exists, never after a network error.
    const noSignedUrl =
      getErrMsg(err as any, "code") === "TICKET_EXTERNAL" ||
      /Cannot query field/i.test(String(getErrMsg(err as any, "message")));
    if (!noSignedUrl) throw err;
    return fetchPdfBytes(eTicketUrl);
  }
  return fetchPdfBytes(signed);
};
