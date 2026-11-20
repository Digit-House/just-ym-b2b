import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { getProductInfo } from "@/graphql/product";
import { getAuditSaves } from "@/graphql/contentEditor";
import PageContainer from "@/components/PageContainer";
import MascotLoader from "@/components/MascotLoader";
import EmptyState from "@/components/EmptyState";
import { OtherChanges } from "@/components/AuditSaveDiffModal";
import { SaveDiffProvider } from "@/components/OwnerReviewContext";
import TicketEditForm from "@/pages/admin/tickets/_components/TicketEditForm";
import { AuditChangeT, AuditSaveT } from "@/types/contentEditor.type";
import { ProductInfoT } from "@/types/product.type";

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

const changedCount = (c: AuditChangeT) => {
  const o = c.oldValues ?? {};
  const n = c.newValues ?? {};
  return [...new Set([...Object.keys(o), ...Object.keys(n)])].filter((k) => !same(o[k], n[k])).length;
};

/** The live ticket with this save's new values laid over it, matched by entity id. */
const overlay = (ticket: any, save: AuditSaveT) => {
  const of = (name: string, id?: string | null) =>
    Object.assign(
      {},
      ...save.changes
        .filter((c) => c.entityName === name && (name === "Product" || c.entityId === id))
        .map((c) => c.newValues ?? {})
    );
  return {
    ...ticket,
    ...of("Product"),
    productOptions: (ticket.productOptions ?? []).map((o: any) => ({
      ...o,
      ...of("ProductOption", o.id),
      ticketType: (o.ticketType ?? []).map((t: any) => ({ ...t, ...of("TicketType", t.id) })),
    })),
  };
};

const Notice = ({ children }: { children: React.ReactNode }) => (
  <EmptyState className="min-h-[40vh]" title="Saved version" description="">
    <p className="text-sm text-gray-600">{children}</p>
  </EmptyState>
);

/** Owner only: the ticket edit form, locked, showing what one save changed. */
const TicketSaveDiff = () => {
  const { id, saveId } = useParams<{ id: string; saveId: string }>();
  const navigate = useNavigate();
  const fromState = (useLocation().state as { save?: AuditSaveT } | null)?.save;

  const ticket = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getProductInfo(id!, true),
    enabled: !!id,
    gcTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  // Reload or pasted URL: no router state, so look the save up in the newest page of this ticket's history.
  const found = useQuery({
    queryKey: ["auditSaveById", id, saveId],
    queryFn: async () => (await getAuditSaves({ productId: id }, { page: 1, limit: 50 })).items.find((s) => s.saveId === saveId) ?? null,
    enabled: !!id && !fromState,
    refetchOnWindowFocus: false,
  });
  const save = fromState && fromState.saveId === saveId ? fromState : found.data;

  if (ticket.isLoading || (!fromState && found.isLoading)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <MascotLoader label="Loading saved version..." />
      </div>
    );
  }
  if (ticket.isError || !ticket.data) return <Notice>We couldn't load the ticket. Please try again later.</Notice>;
  if (!save)
    return (
      <Notice>
        This save is not in the recent history. Open it from the{" "}
        <Link to="/audit-log" className="text-indigo-600 underline">
          Audit log
        </Link>
        .
      </Notice>
    );

  const who = save.source === "SYNC" ? "Supplier sync" : save.user?.name || save.user?.email || "Unknown user";
  const n = save.changes.reduce((sum, c) => sum + changedCount(c), 0);
  const back = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate("/audit-log"));

  return (
    <PageContainer>
      <button type="button" onClick={back} className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft size={14} /> Back
      </button>
      <header className="mb-6 space-y-1">
        <h1 className="text-xl font-semibold text-gray-900">{ticket.data.name}</h1>
        <p className="text-sm text-gray-600">
          Saved by <span className="font-medium">{who}</span> on {format(new Date(save.createdAt), "PPpp")}
        </p>
        <p className="text-xs text-gray-500">
          {[save.source === "SYNC" ? "Supplier sync" : "Person", save.ipAddress, save.location].filter(Boolean).join(" · ")}
          {" · "}
          {n} {n === 1 ? "field" : "fields"} changed
        </p>
      </header>
      <SaveDiffProvider ticket={ticket.data} save={save}>
        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <TicketEditForm
            mode="edit"
            initialValues={overlay(ticket.data, save) as ProductInfoT}
            onSubmit={() => {}}
            onCancel={() => {}}
          />
        </div>
      </SaveDiffProvider>
      <div className="mt-6">
        <OtherChanges save={save} />
      </div>
    </PageContainer>
  );
};

export default TicketSaveDiff;
