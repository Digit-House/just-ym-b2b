"use client";

import { useState } from "react";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import SortSelect, { SortOption } from "@/components/SortSelect";
import Pagination from "@/components/Pagination";
import { useCategories } from "@/hooks/useCategories";
import { FileEdit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CategoryT } from "@/types/categories.type";


const SORT_OPTION: SortOption[] = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

const Categories = () => {
  const navigate = useNavigate();

  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data = [], isLoading } = useCategories({
    limit: pageSize,
    page,
    orderBy: {
      dir: sort === "newest" ? "desc" : "asc",
    },
  });

  return (
    <PageContainer>
      <PageHeader
        title="Categories"
        des="Manage available categories used across the system."
      />

      {/* Top bar */}
      <div className="flex items-center justify-end mb-5 gap-4 border border-[#21212124] py-[8px] px-[16px]">
        <SortSelect
          options={SORT_OPTION}
          value={sort}
          onChange={(value) => {
            setSort(value as "newest" | "oldest");
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-900 uppercase bg-indigo-50">
              <tr>
                <th className="px-6 py-4 font-semibold">Category Name</th>
                <th className="px-6 py-4 font-semibold">Created At</th>
                <th className="px-6 py-4 font-semibold">Last Updated</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    Loading categories...
                  </td>
                </tr>
              )}

              {!isLoading &&
                data.map((category: CategoryT) => (
                  <tr
                    key={category.id}
                    className="bg-white border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {category.name}
                    </td>

                    <td className="px-6 py-4">
                      {new Date(category.createdAt).toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      {new Date(category.updatedAt).toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          navigate(`/categories/${category.id}`)
                        }
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <FileEdit size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        pageSize={pageSize}
        total={pageSize * page + (data.length === pageSize ? pageSize : 0)}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </PageContainer>
  );
};

export default Categories;
