"use client";

import { useCallback, useState } from "react";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import SortSelect from "@/components/SortSelect";
import Pagination from "@/components/Pagination";
import { useCategories } from "@/hooks/useCategories";
import { CategoryT } from "@/types/categories.type";
import { getErrMsg,PAGE_SIZE,SORT_OPTION } from "@/util/initData";
import { FileEdit} from "lucide-react";
import ModalWrapper from "@/components/ModalWrapper";
import CategoryForm from "./_components/CategoryForm";
import { CategoryFormValues } from "@/types/schema/categorySchema";
import { toast } from "sonner";
import { putCategory } from "@/graphql/category";
import { SortT } from "@/types/index.type";

const Categories = () => {
  const [sort, setSort] = useState<SortT>("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState<{
    mode: "edit" | null;
    category?: CategoryT;
  }>({
    mode: null,
    category: null,
  });

  const closeModal = useCallback(() => {
    setModalState({ mode: null, category: null });
  }, []);

  const {
    data = [],
    isLoading,
    refetch,
  } = useCategories({
    limit: pageSize,
    page,
    orderBy: {
      dir: sort === "newest" ? "desc" : "asc",
    },
  });

  const handleEditCategory = async (value: CategoryFormValues) => {
    try{
      setLoading(true);
      await putCategory(value);
      toast.success("Successfully Updated !");
      closeModal();
      await refetch();
    }catch(err){
      toast.error(getErrMsg(err,"message"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Categories"
        des="Manage available categories used across the system."
      />
      <div className="flex items-center justify-end mb-5 gap-4 border border-[#21212124] py-2 px-4">
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
                <th className="px-6 py-4 font-semibold">Id</th>
                <th className="px-6 py-4 font-semibold">Category Name</th>
                <th className="px-6 py-4 font-semibold">Category Name (MM)</th>
                <th className="px-6 py-4 font-semibold text-center">
                  Created At
                </th>
                <th className="px-6 py-4 font-semibold text-right">
                  Last Updated
                </th>
                <th className="px-6 py-4">Action</th>
                {/* //don't remove */}
                {/* <th className="px-6 py-4 font-semibold">Action</th> */}
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
                data.map((category: CategoryT, index: number) => (
                  <tr
                    key={category.id}
                    className="bg-white border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {category.name_mm || "-----"}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {new Date(category.createdAt).toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {new Date(category.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setModalState({ mode: "edit", category })}
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

      {modalState.mode === "edit" && modalState.category && (
        <ModalWrapper title="Edit Category" onClose={closeModal}>
          <CategoryForm
            mode="edit"
            category={modalState.category}
            loading={loading}
            onCancel={closeModal}
            onSubmit={handleEditCategory}
          />
        </ModalWrapper>
      )}
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
