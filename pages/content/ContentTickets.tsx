import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import SortSelect, { SortOption } from "@/components/SortSelect";
import MultiSelect from "@/components/MultiSelect";
import SingleSelect from "@/components/SingleSelect";
import ReviewStatusBadge, { REVIEW_STATUS_OPTIONS } from "@/components/ReviewStatusBadge";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { useCountries } from "@/hooks/useCountries";
import { ContentReviewStatus } from "@/types/contentEditor.type";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import MascotLoader from "@/components/MascotLoader";
import Pagination from "@/components/Pagination";
import ImageFallback from "@/components/ImageFallback";
import { useDebounce } from "@/hooks/useDebounce";
import { getContentProducts } from "@/graphql/contentEditor";
import { preFixImg } from "@/util/initData";

const SORT_OPTIONS: SortOption[] = [
  { label: "Alphabet", value: "alphabet" },
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" },
];

const ContentTickets = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [pendingOnly, setPendingOnly] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [countryId, setCountryId] = useState("");
  const [published, setPublished] = useState("ALL");
  const [sort, setSort] = useState("alphabet");
  const [reviewStatus, setReviewStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const { data: categoryData } = useCategories({ limit: 10, page: 1 });
  const { data: countryData } = useCountries({
    limit: 250,
    page: 1,
    orderBy: { dir: "asc" },
    isPublished: true,
    search: undefined,
  });
  const [pageSize, setPageSize] = useState(10);
  const name = useDebounce(search.trim(), 400);

  useEffect(() => setPage(1), [name, pendingOnly, categories, countryId, published, sort, reviewStatus]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["contentProducts", name, pendingOnly, categories, countryId, published, sort, reviewStatus, page, pageSize],
    queryFn: () =>
      getContentProducts(
        {
          ...(name && { name }),
          ...(pendingOnly && { hasPendingUpdates: true }),
          ...(categories.length && { categoryIds: categories }),
          ...(countryId && { countryId }),
          ...(published !== "ALL" && { isPublished: published === "PUBLISHED" }),
          ...(reviewStatus === "NOT_STARTED"
            ? { reviewNotStarted: true }
            : reviewStatus !== "ALL" && { reviewStatus: reviewStatus as ContentReviewStatus }),
          orderBy:
            sort === "alphabet"
              ? { field: "name", dir: "asc" }
              : { field: "updatedAt", dir: sort as "asc" | "desc" },
        },
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

      <div className="mb-4 flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm md:flex-row md:flex-wrap md:items-center">
        <MultiSelect
          label="Categories"
          placeholder="Categories"
          options={categoryData}
          value={categories}
          onChange={setCategories}
          width="w-full md:w-60"
        />
        <SingleSelect
          label="Country"
          placeholder="Country"
          options={countryData?.data}
          value={countryId}
          onChange={setCountryId}
          width="w-full md:w-60"
        />
        <ShadcnSelect value={published} onValueChange={setPublished}>
          <SelectTrigger className="w-full md:w-44" aria-label="Published">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="UNPUBLISHED">Unpublished</SelectItem>
          </SelectContent>
        </ShadcnSelect>
        <ShadcnSelect value={reviewStatus} onValueChange={setReviewStatus}>
          <SelectTrigger className="w-full md:w-48" aria-label="Review status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="NOT_STARTED">Not started</SelectItem>
            {REVIEW_STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </ShadcnSelect>
        <SortSelect value={sort} options={SORT_OPTIONS} onChange={setSort} />
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
                <th className="px-4 py-3">Review status</th>
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
                    <ReviewStatusBadge status={t.contentReviewStatus} />
                  </td>
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
