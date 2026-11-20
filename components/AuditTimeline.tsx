import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronRight, ExternalLink, GitCompare, RefreshCw } from "lucide-react";
import DiffView from "@/components/DiffView";
import AuditSaveDiffModal from "@/components/AuditSaveDiffModal";
import { entityLabel } from "@/util/contentLabels";
import { AuditChangeT, AuditSaveT } from "@/types/contentEditor.type";

type Props = {
  saves: AuditSaveT[];
  /** Show an "Open ticket" link per entry (platform-wide view). */
  showTicketLink?: boolean;
  /** Only the newest saves were loaded. */
  truncated?: boolean;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?";

const label = (c: AuditChangeT) => c.entityLabel || entityLabel(c.entityName);

/** Changes grouped by entity label, in first-seen order. */
const groupChanges = (changes: AuditChangeT[]) => {
  const groups = new Map<string, AuditChangeT[]>();
  for (const c of changes) groups.set(label(c), [...(groups.get(label(c)) ?? []), c]);
  return [...groups];
};

const ChangeList = ({ changes }: { changes: AuditChangeT[] }) => (
  <div className="space-y-4 border-t border-gray-100 pt-3">
    {groupChanges(changes).map(([name, items]) => (
      <div key={name} className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
          {entityLabel(items[0].entityName) !== name && (
            <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-700">
              {entityLabel(items[0].entityName)}
            </span>
          )}
          <p className="text-sm font-semibold text-gray-900">{name}</p>
        </div>
        {items.map((c) => {
          const oldV = c.oldValues ?? {};
          const newV = c.newValues ?? {};
          const fields = [...new Set([...Object.keys(newV), ...Object.keys(oldV)])].filter((f) => f !== "currency");
          const currency = (newV.currency ?? oldV.currency) as string | undefined;
          return (
            <div key={c.id} className="space-y-4">
              {fields.length === 0 && <p className="text-sm text-gray-400">No field details.</p>}
              {fields.map((f) => (
                <DiffView key={f} className="border-l-2 border-indigo-200 pl-3" field={f} oldValue={oldV[f]} newValue={newV[f]} currency={currency} />
              ))}
            </div>
          );
        })}
      </div>
    ))}
  </div>
);

const SaveEntry = ({ save, showTicketLink }: { save: AuditSaveT; showTicketLink?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [diff, setDiff] = useState(false);
  const navigate = useNavigate();
  const isSync = save.source === "SYNC";
  const who = isSync ? "Supplier sync" : save.user?.name || save.user?.email || "Unknown user";
  const created = new Date(save.createdAt);
  const n = save.changes.length;

  return (
    <li className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isSync ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
        }`}
      >
        {isSync ? <RefreshCw size={16} /> : initials(who)}
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="text-sm text-gray-900">
            <span className="font-semibold">{who}</span>{" "}
            <span className="text-gray-600">{isSync ? "synced" : "saved"} {n} {n === 1 ? "change" : "changes"}</span>
          </p>
          <time dateTime={save.createdAt} title={format(created, "PPpp")} className="text-xs text-gray-500">
            {formatDistanceToNow(created, { addSuffix: true })}
          </time>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          {save.productName && <span className="font-medium text-gray-600">{save.productName}</span>}
          {save.location && <span title="Ticket › option › ticket type">{save.location}</span>}
          <span>{isSync ? "Supplier sync" : "Person"}</span>
          {showTicketLink && save.productId && (
            <Link
              to={`/admin-tickets/edit/${save.productId}`}
              className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
            >
              Open ticket <ExternalLink size={12} />
            </Link>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />} {n} {n === 1 ? "change" : "changes"}
          </button>
          <button
            type="button"
            onClick={() =>
              save.productId
                ? navigate(`/admin-tickets/edit/${save.productId}/save/${save.saveId}`, { state: { save } })
                : setDiff(true)
            }
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            <GitCompare size={12} /> Show in diff
          </button>
        </div>
        {open && <ChangeList changes={save.changes} />}
      </div>
      {diff && <AuditSaveDiffModal save={save} onClose={() => setDiff(false)} />}
    </li>
  );
};

const AuditTimeline = ({ saves, showTicketLink, truncated }: Props) => (
  <div className="space-y-3">
    {truncated && (
      <p className="text-sm text-gray-500">Showing the newest saves only. Narrow the filters to see older saves.</p>
    )}
    <ol className="space-y-3">
      {saves.map((s) => (
        <SaveEntry key={s.saveId} save={s} showTicketLink={showTicketLink} />
      ))}
    </ol>
  </div>
);

export default AuditTimeline;
