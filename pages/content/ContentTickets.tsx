import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import MascotLoader from "@/components/MascotLoader";
import Pagination from "@/components/Pagination";
import ImageFallback from "@/components/ImageFallback";
import { useDebounce } from "@/hooks/useDebounce";
import { getContentProducts } from "@/graphql/contentEditor";
import { preFixImg } from "@/util/initData";

const ContentTickets = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [pendingOnly, setPendingOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const name = useDebounce(search.trim(), 400);

  useEffect(() => setPage(1), [name, pendingOnly]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["contentProducts", name, pendingOnly, page, pageSize],
    queryFn: () =>
      getContentProducts(
        { ...(name && { name }), ...(pendingOnly && { hasPendingUpdates: true }) },
        { page, limit: pageSize }
      ),
    refetchOnWindowFocus: false,
  });

  return (
    <PageContainer>
      <PageHeader title="Tickets" des="Edit ticket content and review supplier updates." />

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket name"
            aria-label="Search by ticket name"
            className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={pendingOnly}
            onChange={(e) => setPendingOnly(e.target.checked)}
          />
          Has supplier updates
        </label>
      </div>

      {isLoading ? (
        <MascotLoader label="Loading tickets..." className="min-h-[40vh]" />
      ) : isError || !data ? (
        <EmptyState title="Could not load tickets" description="Please try again.">
          <button
            onClick={() => refetch()}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Retry
          </button>
        </EmptyState>
      ) : data.data.length === 0 ? (
        <EmptyState title="No tickets found" description="Try a different search or filter." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3">Supplier updates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.data.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => navigate(`/content-tickets/${t.id}`)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <ImageFallback
                      src={t.image ? preFixImg(t.image) : ""}
                      alt={t.name}
                      className="h-12 w-16 rounded-md object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
                  <td className="px-4 py-3 text-gray-600">{t.city}</td>
                  <td className="px-4 py-3 text-gray-600">{t.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        t.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {t.isPublished ? "Published" : "Unpublished"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {t.pendingSupplierUpdates > 0 ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                        {t.pendingSupplierUpdates}
                      </span>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      )}
    </PageContainer>
  );
};

export default ContentTickets;
