import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AuditTimeline from "@/components/AuditTimeline";
import EmptyState from "@/components/EmptyState";
import MascotLoader from "@/components/MascotLoader";
import Pagination from "@/components/Pagination";
import { getAuditSaves } from "@/graphql/contentEditor";
import { AuditFilterT } from "@/types/contentEditor.type";

type Props = {
  filter: AuditFilterT;
  showTicketLink?: boolean;
};

/** Fetches, pages and renders audit history for a filter (OWNER only on the API). */
const AuditLogList = ({ filter, showTicketLink }: Props) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const filterKey = JSON.stringify(filter);
  useEffect(() => setPage(1), [filterKey]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["auditSaves", filterKey, page, pageSize],
    queryFn: () => getAuditSaves(filter, { page, limit: pageSize }),
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <MascotLoader label="Loading history..." className="min-h-[30vh]" />;
  if (isError || !data)
    return (
      <EmptyState title="Could not load history" description="Please try again.">
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Retry
        </button>
      </EmptyState>
    );
  if (!data.items.length)
    return <EmptyState title="No history yet" description="Nothing matches these filters." />;

  return (
    <div className="space-y-3">
      <AuditTimeline saves={data.items} showTicketLink={showTicketLink} truncated={data.truncated} />
      <Pagination
        page={page}
        pageSize={pageSize}
        total={data.total}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />
    </div>
  );
};

export default AuditLogList;
