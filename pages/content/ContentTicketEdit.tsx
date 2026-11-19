import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import MascotLoader from "@/components/MascotLoader";
import ImageUpload from "@/components/ImageUpload";
import InputField from "@/components/InputField";
import BackBtn from "@/components/BackBtn";
import { Button } from "@/components/ui/button";
import { updateProductContent } from "@/graphql/contentEditor";
import { getSignedUrlAndImageDataUpload } from "@/util";
import { getErrMsg } from "@/util/initData";
import { ContentMediaT, ContentOptionT, ProductContentT } from "@/types/contentEditor.type";
import SupplierUpdatesPanel, {
  useProductContent,
  useSupplierUpdates,
} from "./_components/SupplierUpdatesPanel";
import {
  BASIC_FIELDS,
  Bind,
  ContentField,
  DETAIL_FIELDS,
  FieldSpec,
  LOCATION_FIELDS,
  OPTION_FIELDS,
  ReadOnlyField,
} from "./_components/ContentFields";

type Edits = Record<string, any>;
type TabId = "basic" | "details" | "location" | "media" | "options" | "updates";

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const cleanMedia = (m: ContentMediaT[] | undefined) => (m ?? []).filter((x) => x.path);
const activeFirst = <T extends { deletedAt?: string | null }>(xs: T[]) => [
  ...xs.filter((x) => !x.deletedAt),
  ...xs.filter((x) => x.deletedAt),
];

const DeletedBadge = ({ at }: { at: string }) => (
  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
    Deleted {new Date(at).toLocaleDateString()}
  </span>
);

/** Server value behind an edit key: p:<field>, o:<optionId>:<field>, t:<optionId>:<ticketTypeId>. */
const serverValue = (data: ProductContentT, key: string) => {
  const [kind, a, b] = key.split(":");
  if (kind === "p") return data[a];
  const option = data.productOptions.find((o) => o.id === a);
  return kind === "o" ? option?.[b] : option?.ticketTypes.find((t) => t.id === b)?.name;
};
const norm = (key: string, v: any) => (key === "p:media" ? cleanMedia(v) : v);

const ContentTicketEdit = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading, isError, refetch } = useProductContent(id);
  const updates = useSupplierUpdates(id);
  const [tab, setTab] = useState<TabId>("basic");
  const [edits, setEdits] = useState<Edits>({});
  const [uploading, setUploading] = useState(0);

  const changed = data ? Object.keys(edits).filter((k) => !same(norm(k, edits[k]), norm(k, serverValue(data, k)))) : [];
  const dirty = changed.length > 0;

  // Unsaved-changes warning for tab close and for in-app links (the app has no data router for useBlocker).
  useEffect(() => {
    if (!dirty) return;
    const onUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a[href]");
      if (a && a.getAttribute("href")?.startsWith("/") && !window.confirm("You have unsaved changes. Leave this page?")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", onUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty]);

  const save = useMutation({
    mutationFn: () => {
      const input: Record<string, any> = { id };
      const opts: Record<string, any> = {};
      for (const k of changed) {
        const [kind, a, b] = k.split(":");
        const v = norm(k, edits[k]);
        if (kind === "p") input[a] = v;
        else if (kind === "o") (opts[a] ??= { id: a })[b] = v;
        else ((opts[a] ??= { id: a }).ticketTypes ??= []).push({ id: b, name: v });
      }
      if (Object.keys(opts).length) input.productOptions = Object.values(opts);
      return updateProductContent(input);
    },
    onSuccess: async () => {
      toast.success("Ticket content saved");
      setEdits({});
      ["productContent", "contentProducts", "auditLogs"].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
    },
    onError: (err) => toast.error(getErrMsg(err as any, "message")),
  });

  if (isLoading) return <MascotLoader label="Loading ticket..." className="min-h-[60vh]" />;
  if (isError || !data)
    return (
      <EmptyState className="min-h-[60vh]" title="Error loading ticket" description="We couldn't load this ticket.">
        <Button onClick={() => refetch()}>Retry</Button>
      </EmptyState>
    );

  const mk = (key: string, sv: unknown, prune = true): Bind => ({
    value: key in edits ? edits[key] : sv,
    onChange: (v) =>
      setEdits((e) => {
        const n = { ...e };
        if (prune && same(v, sv)) delete n[key];
        else n[key] = v;
        return n;
      }),
  });
  const bindProduct = (f: string) => mk(`p:${f}`, data[f]);

  const uploadImage = async (file: File) => {
    setUploading((n) => n + 1);
    try {
      const res: any = await getSignedUrlAndImageDataUpload(file, "PRODUCT_MEDIA");
      if (res?.status === 200 && res.url) return res.url as string;
      toast.error("Image upload failed");
    } finally {
      setUploading((n) => n - 1);
    }
    return null;
  };

  const renderFields = (specs: FieldSpec[], bind: (f: string) => Bind) => (
    <div className="space-y-6">
      {specs.map((s) => (
        <ContentField key={s.f} spec={s} bind={bind} />
      ))}
    </div>
  );

  const mediaBind = mk("p:media", data.media, false);
  const media: ContentMediaT[] = mediaBind.value;
  const setMedia = (items: ContentMediaT[]) => mediaBind.onChange(items);
  const fileMeta = (file: File, path: string): ContentMediaT => {
    const dot = file.name.lastIndexOf(".");
    const ext = (dot > -1 ? file.name.slice(dot + 1) : file.type.split("/")[1] ?? "jpg").toLowerCase();
    return {
      name: dot > -1 ? file.name.slice(0, dot) : file.name,
      extension: ext === "jpeg" || ext === "png" ? ext : "jpg",
      size: file.size,
      type: file.type,
      path,
    };
  };

  const cover = bindProduct("image");
  const TabBtn = ({ t, label }: { t: TabId; label: string }) => (
    <button
      type="button"
      onClick={() => setTab(t)}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        tab === t ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
  const pending = updates.data?.length ?? data.pendingSupplierUpdates;

  const renderOption = (o: ContentOptionT) => {
    const deleted = !!o.deletedAt;
    const bind = (f: string) => mk(`o:${o.id}:${f}`, o[f]);
    const img = bind("image");
    return (
      <div key={o.id} className={`space-y-5 rounded-xl border p-5 ${deleted ? "border-gray-200 bg-gray-50" : "border-gray-300 bg-white"}`}>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">{o.name}</h3>
          {deleted && <DeletedBadge at={o.deletedAt!} />}
        </div>
        {deleted ? (
          <p className="text-sm text-gray-500">This option was removed by the supplier and is read-only.</p>
        ) : (
          <>
            <div>
              <p className="mb-2 text-sm font-medium">Option image</p>
              <ImageUpload
                value={img.value}
                label=""
                folderType="PRODUCT_MEDIA"
                disableRemove
                enableCrop
                presetCropSetting="TICKET_CARD"
                cropLibrary="react-easy-crop"
                onChange={async (_v, file) => {
                  if (!file) return;
                  const path = await uploadImage(file);
                  if (path) img.onChange(path);
                }}
              />
            </div>
            {renderFields(OPTION_FIELDS, bind)}
          </>
        )}
        <div className="grid gap-3 md:grid-cols-3">
          <ReadOnlyField label="Ticket validity" value={o.ticketValidity} />
          <ReadOnlyField label="Published" value={o.isPublished} />
          <ReadOnlyField label="Cancellable" value={o.isCancellable} />
        </div>
        <div className="space-y-3">
          <p className="text-sm font-medium">Ticket types</p>
          {activeFirst(o.ticketTypes).map((t) => {
            const tb = mk(`t:${o.id}:${t.id}`, t.name);
            const gone = deleted || !!t.deletedAt;
            return (
              <div key={t.id} className="flex flex-wrap items-center gap-3">
                <div className="min-w-[14rem] flex-1">
                  <InputField
                    aria-label={`Ticket type ${t.name}`}
                    value={tb.value}
                    disabled={gone}
                    onChange={(e) => tb.onChange(e.target.value)}
                  />
                </div>
                {t.deletedAt && <DeletedBadge at={t.deletedAt} />}
                {(t.ageFrom != null || t.ageTo != null) && (
                  <span className="text-xs text-gray-400">Age {t.ageFrom ?? "-"} to {t.ageTo ?? "-"}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <PageContainer>
      <BackBtn route="/content-tickets" title="Back to Tickets" />
      <PageHeader title={data.name} des="Edit the ticket content below." />

      <div className="mb-4 flex items-center justify-end gap-3">
        {dirty && <span className="text-sm text-amber-700">Unsaved changes</span>}
        <Button
          type="button"
          disabled={!dirty || uploading > 0 || save.isPending}
          loading={save.isPending}
          onClick={() => save.mutate()}
        >
          {uploading > 0 ? "Uploading image..." : "Save changes"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 border-b pb-4">
        <TabBtn t="basic" label="Basic" />
        <TabBtn t="details" label="Details" />
        <TabBtn t="location" label="Location" />
        <TabBtn t="media" label="Media" />
        <TabBtn t="options" label="Options" />
        <TabBtn t="updates" label={pending > 0 ? `Supplier updates (${pending})` : "Supplier updates"} />
      </div>

      <div className="mt-4 min-h-96 rounded-xl border bg-white p-6 shadow-sm">
        {tab === "basic" && (
          <div className="space-y-6">
            {renderFields(BASIC_FIELDS, bindProduct)}
            <div className="grid gap-4 md:grid-cols-3">
              <ReadOnlyField label="Slug" value={data.slug} />
              <ReadOnlyField label="Category" value={data.category} />
              <ReadOnlyField label="City" value={data.city} />
              <ReadOnlyField label="Country" value={data.country} />
              <ReadOnlyField label="Published" value={data.isPublished} />
              <ReadOnlyField label="Recommended" value={data.isRecommended} />
              <ReadOnlyField label="Best seller" value={data.isBestSeller} />
              <ReadOnlyField label="Cancellable" value={data.isCancellable} />
              <ReadOnlyField label="Manual confirmation" value={data.requiresManualConfirmation} />
            </div>
          </div>
        )}
        {tab === "details" && renderFields(DETAIL_FIELDS, bindProduct)}
        {tab === "location" && renderFields(LOCATION_FIELDS, bindProduct)}
        {tab === "media" && (
          <div className="space-y-8">
            <div>
              <p className="mb-2 text-sm font-medium">Cover image</p>
              <ImageUpload
                value={cover.value}
                label=""
                folderType="PRODUCT_MEDIA"
                disableRemove
                enableCrop
                presetCropSetting="TICKET_CARD"
                cropLibrary="react-easy-crop"
                onChange={async (_v, file) => {
                  if (!file) return;
                  const path = await uploadImage(file);
                  if (path) cover.onChange(path);
                }}
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium">Gallery</p>
              <div className="grid gap-4 md:grid-cols-2">
                {media.map((m, i) => (
                  <div key={`${i}-${m.path}`} className="space-y-2 rounded-lg border p-3">
                    <ImageUpload
                      value={m.path}
                      label=""
                      folderType="PRODUCT_MEDIA"
                      disableRemove
                      enableCrop
                      presetCropSetting="LANDING_HERO"
                      cropLibrary="react-easy-crop"
                      onChange={async (_v, file) => {
                        if (!file) return;
                        const path = await uploadImage(file);
                        if (path) setMedia(media.map((x, j) => (j === i ? fileMeta(file, path) : x)));
                      }}
                    />
                    <Button type="button" variant="outline" onClick={() => setMedia(media.filter((_, j) => j !== i))}>
                      <Trash2 size={16} /> Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setMedia([...media, { name: "", path: "", size: 0, type: "", extension: "jpg" }])}
              >
                <Plus size={16} /> Add image
              </Button>
            </div>
          </div>
        )}
        {tab === "options" && (
          <div className="space-y-6">
            {data.productOptions.length === 0 && <p className="text-sm text-gray-500">This ticket has no options.</p>}
            {activeFirst(data.productOptions).map(renderOption)}
          </div>
        )}
        {tab === "updates" && <SupplierUpdatesPanel productId={id} />}
      </div>
    </PageContainer>
  );
};

export default ContentTicketEdit;
