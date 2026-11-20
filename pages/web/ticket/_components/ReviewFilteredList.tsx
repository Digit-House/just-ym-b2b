import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import EmptyState from "@/components/EmptyState";
import MascotLoader from "@/components/MascotLoader";
import Pagination from "@/components/Pagination";
import ImageFallback from "@/components/ImageFallback";
import ReviewStatusBadge from "@/components/ReviewStatusBadge";
import { getContentProducts } from "@/graphql/contentEditor";
import { preFixImg } from "@/util/initData";
import { ContentReviewStatus } from "@/types/contentEditor.type";

type Props = {
  /** "NOT_STARTED" or a ContentReviewStatus. */
  review: string;
  search: string;
  categories: string[];
  countryId: string;
  published: string;
  sort: string;
};

/** Owner Tickets list while a review status filter is on (R5): same filters, with the review status shown per row. */
const ReviewFilteredList = ({ review, search, categories, countryId, published, sort }: Props) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  useEffect(() => setPage(1), [review, search, categories, countryId, published, sort]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["contentProducts", "owner", review, search, categories, countryId, published, sort, page, pageSize],
    queryFn: () =>
      getContentProducts(
        {
          ...(search && { name: search }),
          ...(categories.length && { categoryIds: categories }),
          ...(countryId && { countryId }),
          ...(published !== "ALL" && { isPublished: published === "PUBLISHED" }),
          ...(review === "NOT_STARTED" ? { reviewNotStarted: true } : { reviewStatus: review as ContentReviewStatus }),
          orderBy: sort === "alphabet" ? { field: "name", dir: "asc" } : { field: "updatedAt", dir: sort as "asc" | "desc" },
        },
        { page, limit: pageSize }
      ),
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <MascotLoader label="Loading tickets..." className="py-16" />;
  if (isError || !data)
    return (
      <EmptyState title="Could not load tickets" description="Please try again.">
        <button onClick={() => refetch()} className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
          Retry
        </button>
      </EmptyState>
    );
  if (!data.data.length) return <EmptyState title="No tickets found" description="No ticket matches this review status." />;

  return (
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
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.data.map((t) => (
            <tr
              key={t.id}
              onClick={() => navigate(`/admin-tickets/edit/${t.id}`)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <td className="px-4 py-3">
                <ImageFallback src={t.image ? preFixImg(t.image) : ""} alt={t.name} className="h-12 w-16 rounded-md object-cover" />
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
              <td className="px-4 py-3 text-gray-600">{t.city}</td>
              <td className="px-4 py-3 text-gray-600">{t.category}</td>
              <td className="px-4 py-3">
                <ReviewStatusBadge status={t.contentReviewStatus} />
              </td>
              <td className="px-4 py-3 text-gray-600">{t.isPublished ? "Published" : "Unpublished"}</td>
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
  );
};

export default ReviewFilteredList;
