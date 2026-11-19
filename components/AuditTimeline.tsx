import { Link } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import { ExternalLink, RefreshCw } from "lucide-react";
import DiffView from "@/components/DiffView";
import { actionLabel, entityLabel } from "@/util/contentLabels";
import { AuditLogT } from "@/types/contentEditor.type";

type Props = {
  logs: AuditLogT[];
  /** Entity id -> display name (options, ticket types) when the caller knows them. */
  entityNames?: Record<string, string>;
  /** Show an "Open ticket" link per entry (platform-wide view). */
  showTicketLink?: boolean;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?";

const AuditEntry = ({ log, entityNames, showTicketLink }: { log: AuditLogT } & Omit<Props, "logs">) => {
  const isSync = log.source === "SYNC";
  const who = isSync ? "Supplier sync" : log.user?.name || log.user?.email || "Unknown user";
  const created = new Date(log.createdAt);
  const oldV = log.oldValues ?? {};
  const newV = log.newValues ?? {};
  const fields = [...new Set([...Object.keys(newV), ...Object.keys(oldV)])].filter((f) => f !== "currency");
  const currency = (newV.currency ?? oldV.currency) as string | undefined;
  const name =
    (log.entityId && entityNames?.[log.entityId]) || (newV.name as string) || (oldV.name as string) || "";
  const isProduct = log.entityName === "Product";

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
            <span className="text-gray-600">
              {actionLabel(log.action, log.source, log.entityName).replace(/^./, (c) => c.toLowerCase())}
            </span>
          </p>
          <time
            dateTime={log.createdAt}
            title={format(created, "PPpp")}
            className="text-xs text-gray-500"
          >
            {formatDistanceToNow(created, { addSuffix: true })}
          </time>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span>
            {isProduct ? "Ticket" : entityLabel(log.entityName)}
            {!isProduct && name ? `: ${name}` : ""}
          </span>
          {showTicketLink && log.productId && (
            <Link
              to={`/admin-tickets/edit/${log.productId}`}
              className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
            >
              Open ticket <ExternalLink size={12} />
            </Link>
          )}
        </div>
        {fields.length > 0 && (
          <div className="space-y-3 border-t border-gray-100 pt-3">
            {fields.map((f) => (
              <DiffView key={f} field={f} oldValue={oldV[f]} newValue={newV[f]} currency={currency} />
            ))}
          </div>
        )}
      </div>
    </li>
  );
};

const AuditTimeline = ({ logs, entityNames, showTicketLink }: Props) => (
  <ol className="space-y-3">
    {logs.map((log) => (
      <AuditEntry key={log.id} log={log} entityNames={entityNames} showTicketLink={showTicketLink} />
    ))}
  </ol>
);

export default AuditTimeline;
