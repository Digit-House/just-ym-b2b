import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import AuditLogList from "@/components/AuditLogList";
import { useDebounce } from "@/hooks/useDebounce";
import { getContentProducts } from "@/graphql/contentEditor";
import { getAllUsers } from "@/graphql/user";
import { AuditFilterT } from "@/types/contentEditor.type";
import { AUDIT_ACTIONS, actionOptionLabel } from "@/util/contentLabels";

const inputCls = "rounded-md border border-gray-300 bg-white px-3 py-2 text-sm";

const AuditLog = () => {
  const [ticket, setTicket] = useState<{ id: string; name: string } | null>(null);
  const [ticketSearch, setTicketSearch] = useState("");
  const [userId, setUserId] = useState("");
  const [action, setAction] = useState("");
  const [source, setSource] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const search = useDebounce(ticketSearch.trim(), 400);

  const matches = useQuery({
    queryKey: ["auditTicketSearch", search],
    queryFn: () => getContentProducts({ name: search }, { page: 1, limit: 6 }),
    enabled: search.length > 1 && !ticket,
  });
  const users = useQuery({
    queryKey: ["auditUsers"],
    queryFn: async () => {
      const res: any = await getAllUsers({
        active: null,
        limit: 100,
        orderBy: { dir: "desc" },
        page: 1,
        resellerId: null,
        type: null,
      });
      return res.data.findAllUsers.data as { id: string; username: string; email: string }[];
    },
  });

  const filter: AuditFilterT = {
    ...(ticket && { productId: ticket.id }),
    ...(userId && { userId }),
    ...(action && { action }),
    ...(source && { source }),
    ...(from && { from: new Date(`${from}T00:00:00`).toISOString() }),
    ...(to && { to: new Date(`${to}T23:59:59.999`).toISOString() }),
  };

  return (
    <PageContainer>
      <PageHeader title="Audit log" des="Every content change and supplier sync across all tickets." />

      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div className="relative">
          {ticket ? (
            <div className={`${inputCls} flex items-center gap-2`}>
              <span className="max-w-[16rem] truncate">{ticket.name}</span>
              <button type="button" aria-label="Clear ticket" onClick={() => setTicket(null)}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <input
              className={`${inputCls} w-64`}
              placeholder="Search a ticket"
              aria-label="Search a ticket"
              value={ticketSearch}
              onChange={(e) => setTicketSearch(e.target.value)}
            />
          )}
          {!ticket && search.length > 1 && matches.data && (
            <ul className="absolute z-20 mt-1 w-72 rounded-md border bg-white shadow-lg">
              {matches.data.data.length === 0 && <li className="px-3 py-2 text-sm text-gray-500">No tickets found</li>}
              {matches.data.data.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                    onClick={() => {
                      setTicket({ id: t.id, name: t.name });
                      setTicketSearch("");
                    }}
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <select className={inputCls} value={userId} onChange={(e) => setUserId(e.target.value)} aria-label="User">
          <option value="">All users</option>
          {users.data?.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username || u.email}
            </option>
          ))}
        </select>
        <select className={inputCls} value={action} onChange={(e) => setAction(e.target.value)} aria-label="Action">
          <option value="">All actions</option>
          {AUDIT_ACTIONS.map((a) => (
            <option key={a} value={a}>
              {actionOptionLabel(a)}
            </option>
          ))}
        </select>
        <select className={inputCls} value={source} onChange={(e) => setSource(e.target.value)} aria-label="Source">
          <option value="">All sources</option>
          <option value="USER">People</option>
          <option value="SYNC">Supplier sync</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          From
          <input type="date" className={inputCls} value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          To
          <input type="date" className={inputCls} value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} />
        </label>
      </div>

      <AuditLogList filter={filter} showTicketLink />
    </PageContainer>
  );
};

export default AuditLog;
