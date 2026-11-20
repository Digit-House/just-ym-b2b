import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import PageContainer from "@/components/PageContainer";
import EmptyState from "@/components/EmptyState";
import MascotLoader from "@/components/MascotLoader";
import ImageUpload from "@/components/ImageUpload";
import InputField from "@/components/InputField";
import TextInput from "@/components/ticket-fields/TextInput";
import PackageCardShell from "@/components/ticket-fields/PackageCardShell";
import PackagesHeader from "@/components/ticket-fields/PackagesHeader";
import BackBtn from "@/components/BackBtn";
import ReviewStatusBadge from "@/components/ReviewStatusBadge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { updateProductContent } from "@/graphql/contentEditor";
import {
  errorCode,
  refreshProductContent,
  setAlwaysReviewFields,
  submitContentForReview,
} from "@/graphql/contentEditorReview";
import { getSignedUrlAndImageDataUpload } from "@/util";
import { getErrMsg } from "@/util/initData";
import { sameRichText } from "@/lib/richText";
import { ContentMediaT, ContentOptionT, ProductContentT, ReviewMetaT } from "@/types/contentEditor.type";
import AddRelated from "@/pages/admin/tickets/_components/AddRelated";
import { searchRelatedProducts } from "@/graphql/contentEditorReview";
import SupplierUpdatesPanel, {
  Staged,
  handleConflict,
  isConflict,
  stagedList,
  useProductContent,
  useSupplierUpdates,
} from "./_components/SupplierUpdatesPanel";
import {
  BASIC_GROUPS,
  Bind,
  DETAIL_FIELDS,
  DETAIL_GROUPS,
  FieldCtx,
  FieldFrame,
  FieldGroup,
  FieldSpec,
  InfoCard,
  LOCATION_FIELDS,
  LOCATION_GROUPS,
  OPTION_GROUPS,
  ReadOnlyField,
  SectionCard,
  renderSpecs,
} from "./_components/ContentFields";

type Edits = Record<string, any>;
const DIFF_KEY = "contentDiffView";
type TabId = "basic" | "details" | "location" | "media" | "related" | "options" | "updates";

/** Edit keys of rich text fields (option descriptions). */
const RICH_KEY = /^o:[^:]+:description(_mm)?$/;
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
  if (kind === "o") return option?.[b];
  const tt = option?.ticketTypes.find((t) => t.id === b);
  return kind === "c" ? tt?.customOriginalPrice : tt?.name;
};
/** c: keys hold the typed text; empty means "use GlobalTix" (null). */
const norm = (key: string, v: any) => {
  if (key === "p:media") return cleanMedia(v);
  if (key === "p:relatedProducts")
    return (v ?? []).map((x: any) => ({ productId: x.productId || x.id, linkBack: x.linkBack || false }));
  if (key.startsWith("c:")) return v === "" || v == null ? null : Number(v);
  return v;
};
/** Mirrors the server: a custom original price must be a number above 0. */
const priceError = (v: number | null) => (v !== null && !(Number.isFinite(v) && v > 0) ? "Enter a price above 0, or leave empty to use GlobalTix." : "");

const ContentTicketEdit = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading, isError, refetch } = useProductContent(id);
  const updates = useSupplierUpdates(id);
  const [tab, setTab] = useState<TabId>("basic");
  const [openOpts, setOpenOpts] = useState<Set<string>>(new Set());
  const [edits, setEdits] = useState<Edits>({});
  const [staged, setStaged] = useState<Staged>({});
  const stagedCount = Object.keys(staged).length;
  const [uploading, setUploading] = useState(0);
  const [diff, setDiff] = useState(() => localStorage.getItem(DIFF_KEY) === "1");
  const toggleDiff = (on: boolean) => {
    setDiff(on);
    localStorage.setItem(DIFF_KEY, on ? "1" : "0");
  };

  const changed = data
    ? Object.keys(edits).filter((k) =>
        RICH_KEY.test(k)
          ? !sameRichText(edits[k], serverValue(data, k))
          : !same(norm(k, edits[k]), norm(k, serverValue(data, k))),
      )
    : [];
  const dirty = changed.length > 0 || stagedCount > 0;
  const badPrice = changed.some((k) => k.startsWith("c:") && priceError(norm(k, edits[k])));

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
        else {
          const tts: any[] = ((opts[a] ??= { id: a }).ticketTypes ??= []);
          const tt = tts.find((x) => x.id === b) ?? tts[tts.push({ id: b }) - 1];
          tt[kind === "c" ? "customOriginalPrice" : "name"] = v;
        }
      }
      if (Object.keys(opts).length) input.productOptions = Object.values(opts);
      if (stagedCount) input.resolutions = stagedList(staged);
      return updateProductContent(input);
    },
    onSuccess: async () => {
      toast.success("Ticket content saved");
      setEdits({});
      setStaged({});
      ["productContent", "supplierUpdates", "contentProducts", "auditLogs"].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
    },
    onError: (err) => {
      if (isConflict(err)) void handleConflict(qc, id, setStaged);
      else toast.error(getErrMsg(err as any, "message"));
    },
  });

  const reloadAll = () =>
    ["productContent", "supplierUpdates", "contentProducts", "contentReviewCounts", "auditLogs"].forEach((k) =>
      qc.invalidateQueries({ queryKey: [k] })
    );

  const refresh = useMutation({
    mutationFn: () => refreshProductContent(id),
    onSuccess: () => {
      toast.success("Refreshed from supplier");
      reloadAll();
    },
    onError: (err) => {
      if (errorCode(err) === "REFRESH_RATE_LIMITED")
        toast.error("Refreshed less than a minute ago. Try again in a minute.");
      else toast.error(getErrMsg(err as any, "message"));
      reloadAll();
    },
  });

  const submit = useMutation({
    mutationFn: () => submitContentForReview(id),
    onSuccess: () => {
      toast.success("Submitted for review");
      reloadAll();
    },
    onError: (err) => toast.error(getErrMsg(err as any, "message")),
  });

  const always = useMutation({
    mutationFn: (v: { entityName: string; entityId: string; fields: string[] }) =>
      setAlwaysReviewFields(v.entityName, v.entityId, v.fields),
    onSuccess: () => ["productContent", "auditLogs"].forEach((k) => qc.invalidateQueries({ queryKey: [k] })),
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

  const pendingFor = (entityId: string) =>
    new Set((updates.data ?? []).filter((u) => u.entityId === entityId).map((u) => u.field));
  const ctxFor = (entityName: string, entityId: string, meta: ReviewMetaT): FieldCtx => ({
    meta: { ...meta, editedFields: meta.editedFields ?? [], alwaysReviewFields: meta.alwaysReviewFields ?? [] },
    diff,
    pending: pendingFor(entityId),
    busy: always.isPending,
    onShowPending: () => setTab("updates"),
    onToggleAlways: (names, on) => {
      const cur = meta.alwaysReviewFields ?? [];
      const fields = on ? Array.from(new Set([...cur, ...names])) : cur.filter((f) => !names.includes(f));
      always.mutate({ entityName, entityId, fields });
    },
  });
  const productCtx = ctxFor("Product", data.id, data);

  const renderGroups = (groups: FieldGroup[], bind: (f: string) => Bind, ctx: FieldCtx) => (
    <>
      {groups.map((g) => (
        <SectionCard key={g.title} title={g.title}>
          {renderSpecs(g.specs, bind, ctx)}
        </SectionCard>
      ))}
    </>
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
  const related = bindProduct("relatedProducts");
  const tabOf = (k: string): TabId => {
    const [kind, f] = k.split(":");
    if (kind !== "p") return "options";
    if (f === "media" || f === "image") return "media";
    if (f === "relatedProducts") return "related";
    if (DETAIL_FIELDS.some((x) => x.f === f || `${x.f}_mm` === f)) return "details";
    return LOCATION_FIELDS.some((x) => x.f === f) ? "location" : "basic";
  };
  const dirtyTabs = new Set<TabId>([...changed.map(tabOf), ...(stagedCount ? (["updates"] as TabId[]) : [])]);
  const TabBtn = ({ t, label }: { t: TabId; label: string }) => (
    <button
      type="button"
      onClick={() => setTab(t)}
      className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        tab === t ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
      {dirtyTabs.has(t) && (
        <span aria-label="Unsaved changes" className="h-2 w-2 rounded-full bg-amber-500" />
      )}
    </button>
  );
  const pending = updates.data?.length ?? data.pendingSupplierUpdates;

  const renderOption = (o: ContentOptionT, optionNo: number) => {
    const deleted = !!o.deletedAt;
    const bind = (f: string) => mk(`o:${o.id}:${f}`, o[f]);
    const types = activeFirst(o.ticketTypes);
    const isOpen = openOpts.has(o.id);
    const edited = changed.some((k) => /^[otc]:/.test(k) && k.split(":")[1] === o.id);
    return (
      <PackageCardShell
        key={o.id}
        keepMounted
        index={optionNo}
        name={o.name}
        published={o.isPublished}
        ticketTypeCount={types.length}
        open={isOpen}
        onToggle={() =>
          setOpenOpts((prev) => {
            const n = new Set(prev);
            if (!n.delete(o.id)) n.add(o.id);
            return n;
          })
        }
        badges={
          <>
            {deleted && <DeletedBadge at={o.deletedAt!} />}
            {edited && (
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Unsaved edits</span>
            )}
          </>
        }
      >
        {deleted && <p className="text-sm text-gray-500">This option was removed by the supplier and is read-only.</p>}
        {!deleted && (
          <>
            {renderGroups(OPTION_GROUPS, bind, ctxFor("ProductOption", o.id, o))}
          </>
        )}
        <InfoCard
          title="Ticket info (read-only)"
          rows={[
            ["Ticket validity", o.ticketValidity],
            ["Published", o.isPublished],
            ["Cancellable", o.isCancellable],
            ...types.map((t): [string, unknown] => [
              `GlobalTix original price, ${t.name}`,
              t.supplierOriginalPrice == null ? "Not set" : t.supplierOriginalPrice,
            ]),
          ]}
        />
        <SectionCard title="Ticket types">
          {types.map((t) => {
            const tb = mk(`t:${o.id}:${t.id}`, t.name);
            const pb = mk(`c:${o.id}:${t.id}`, t.customOriginalPrice ?? "", false);
            const gone = deleted || !!t.deletedAt;
            const perr = priceError(norm(`c:${o.id}:${t.id}`, pb.value));
            return (
              <div key={t.id} className="space-y-4">
                <FieldFrame
                  ctx={ctxFor("TicketType", t.id, t)}
                  names={["name"]}
                  label={`Ticket type ${t.name}`}
                  current={tb.value}
                  showLabel
                  disabled={gone}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="min-w-[14rem] flex-1">
                      <TextInput
                        aria-label={`Ticket type ${t.name}`}
                        value={tb.value}
                        disabled={gone}
                        onChange={tb.onChange}
                      />
                    </div>
                    {t.deletedAt && <DeletedBadge at={t.deletedAt} />}
                    {(t.ageFrom != null || t.ageTo != null) && (
                      <span className="text-xs text-gray-400">Age {t.ageFrom ?? "-"} to {t.ageTo ?? "-"}</span>
                    )}
                  </div>
                </FieldFrame>
                <div>
                  <InputField
                    label="Custom original price"
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Empty = use GlobalTix price"
                    disabled={gone}
                    value={pb.value ?? ""}
                    onChange={(e) => pb.onChange(e.target.value)}
                  />
                  {perr && <p className="mt-1 text-xs text-red-600">{perr}</p>}
                </div>
              </div>
            );
          })}
        </SectionCard>
      </PackageCardShell>
    );
  };

  const sentBack = data.contentReviewStatus === "SENT_BACK";

  return (
    <PageContainer>
      <BackBtn route="/content-tickets" title="Back to Tickets" />

      <div className="mb-4 space-y-4 rounded-xl border bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="text-xl font-semibold text-gray-900">{data.name}</h1>
          <ReviewStatusBadge status={data.contentReviewStatus} />
          {sentBack && data.contentReviewSentBackAt && (
            <span className="text-sm text-amber-700">
              by owner, {new Date(data.contentReviewSentBackAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <Switch checked={diff} onCheckedChange={toggleDiff} aria-label="Diff view" />
            Diff view
          </label>
          <Button type="button" variant="outline" disabled={refresh.isPending} onClick={() => refresh.mutate()}>
            <RefreshCw size={16} className={refresh.isPending ? "animate-spin" : ""} />
            {refresh.isPending ? "Refreshing from supplier..." : "Refresh from supplier"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={data.contentReviewStatus === "READY_FOR_REVIEW" || dirty || submit.isPending}
            loading={submit.isPending}
            title={dirty ? "Save your changes first" : undefined}
            onClick={() => submit.mutate()}
          >
            {data.contentReviewStatus === "READY_FOR_REVIEW" ? "Waiting for owner review" : "Submit for review"}
          </Button>
          <Button
            type="button"
            disabled={!dirty || uploading > 0 || save.isPending || badPrice}
            loading={save.isPending}
            onClick={() => save.mutate()}
          >
            {uploading > 0 ? "Uploading image..." : `Save changes${dirty ? ` (${changed.length + stagedCount})` : ""}`}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-4">
        <TabBtn t="basic" label="Basic" />
        <TabBtn t="details" label="Details" />
        <TabBtn t="location" label="Location" />
        <TabBtn t="media" label="Media" />
        <TabBtn t="options" label="Options" />
        <TabBtn t="related" label="Related tickets" />
        <TabBtn t="updates" label={pending > 0 ? `Supplier updates (${pending})` : "Supplier updates"} />
      </div>

      <div className="min-h-96 space-y-4">
        {tab === "basic" && (
          <>
            {renderGroups(BASIC_GROUPS, bindProduct, productCtx)}
            <InfoCard
              title="Ticket info (read-only)"
              rows={[
                ["Slug", data.slug],
                ["Category", data.category],
                ["City", data.city],
                ["Country", data.country],
                ["Published", data.isPublished],
                ["Recommended", data.isRecommended],
                ["Best seller", data.isBestSeller],
                ["Cancellable", data.isCancellable],
                ["Manual confirmation", data.requiresManualConfirmation],
              ]}
            />
          </>
        )}
        {tab === "details" && renderGroups(DETAIL_GROUPS, bindProduct, productCtx)}
        {tab === "location" && renderGroups(LOCATION_GROUPS, bindProduct, productCtx)}
        {tab === "media" && (
          <>
            <SectionCard title="Cover image">
              <div>
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
            </SectionCard>
            <SectionCard title="Gallery">
              <div className="space-y-3">
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
            </SectionCard>
          </>
        )}
        {tab === "related" && (
          <SectionCard title="Related tickets">
            <AddRelated
              currentRelatedProducts={related.value ?? []}
              currentTicketId={id}
              onRelatedProductsChange={related.onChange}
              searchProducts={searchRelatedProducts}
            />
          </SectionCard>
        )}
        {tab === "options" && (
          <div className="space-y-6">
            {data.productOptions.length === 0 && <p className="text-sm text-gray-500">This ticket has no options.</p>}
            <PackagesHeader
              count={data.productOptions.length}
              onExpandAll={() => setOpenOpts(new Set(data.productOptions.map((o) => o.id)))}
              onCollapseAll={() => setOpenOpts(new Set())}
            />
            {activeFirst(data.productOptions).map((o, i) => renderOption(o, i))}
          </div>
        )}
        {tab === "updates" && (
          <SupplierUpdatesPanel
            productId={id}
            staged={staged}
            onStage={(sid, res) =>
              setStaged((prev) => {
                const n = { ...prev };
                if (res) n[sid] = res;
                else delete n[sid];
                return n;
              })
            }
          />
        )}
      </div>
    </PageContainer>
  );
};

export default ContentTicketEdit;
