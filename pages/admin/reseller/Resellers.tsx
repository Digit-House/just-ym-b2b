"use client";

import { useCallback, useEffect, useState } from "react";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import SortSelect from "@/components/SortSelect";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";
import { createReseller, getResellers, updateReseller } from "@/graphql/reseller";
import { ResellerFilterT, ResellerT } from "@/types/reseller.type";
import { getErrMsg, PAGE_SIZE, SORT_OPTION } from "@/util/initData";
import ResellerForm from "./_components/ResellerForm";
import ModalWrapper from "@/components/ModalWrapper";
import { Edit2, Plus} from "lucide-react";
import RoleCheckAction from "@/components/RoleCheckAction";
import { ResellerFormValues } from "@/types/schema/resellerSchema";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Resellers = () => {
  const [data, setData] = useState<ResellerT[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);

  const [modalState, setModalState] = useState<{
    mode: "create" | "edit" | null;
    reseller?: ResellerT | null;
  }>({
    mode: null,
    reseller: null,
  });

  const closeModal = useCallback(() => {
    setModalState({ mode: null, reseller: null });
  }, []);

  const [filterData, setFilterData] = useState<ResellerFilterT>({
    active: null,
    limit: PAGE_SIZE,
    page: 1,
    orderBy: {
      dir: "desc" as "asc" | "desc",
    },
    search: undefined,
  });

  useEffect(() => {
    fetchResellers();
  }, [filterData, fetchAgain]);

  const fetchResellers = async () => {
    try {
      setLoading(true);
      const res: any = await getResellers(filterData);
      setData(res?.data?.findAllResellers?.data || []);
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReseller = async (value: ResellerFormValues) => {
    try {
      setLoading(true);
      await createReseller({
        name: value.name,
        active: value.active,
        credit: {
          balance: value.credit.balance,
          currency: value.credit.currency,
          relatedImages: value.credit.relatedImages || [],
        },
        user: {
          contactNo: value.user.contactNo,
          countryCode: value.user.countryCode,
          email: value.user.email,
          username: value.user.username,
          password: value.user.password,
          imageURI: value.user.imageURI || "",
        },
      });
      closeModal();
      setFetchAgain((prev) => !prev);
      toast.success("Successfully Created!");
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  const handleEditReseller = async (value: ResellerFormValues) => {
    try {
      setLoading(true);
      await updateReseller(modalState.reseller!.id, {
        id: modalState.reseller!.id,
        name: value.name,
        active: value.active,
        credit: {
          relatedImages: value.credit.relatedImages || [],
        },
      });
      closeModal();
      setFetchAgain((prev) => !prev);
      toast.success("Successfully Updated!");
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Resellers"
        des="Manage reseller accounts and credit balances."
      />
      <div className="flex items-center flex-row-reverse justify-between mb-5 gap-4 border border-[#21212124] py-[8px] px-[16px]">
        <div className="flex items-center gap-4">
          <Select
            value={filterData.active === true ? "active" : filterData.active === false ? "inactive" : "all"}
            onValueChange={(value) => {
              const activeValue = value === "active" ? true : value === "inactive" ? false : null;
              setFilterData((prev) => ({
                ...prev,
                page: 1,
                active: activeValue,
              }));
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resellers</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
          
          <SortSelect
            options={SORT_OPTION}
            value={filterData.orderBy.dir === "desc" ? "newest" : "oldest"}
            onChange={(value) =>
              setFilterData((prev) => ({
                ...prev,
                page: 1,
                orderBy: {
                  dir: value === "newest" ? "desc" : "asc",
                  field:"name"
                },
              }))
            }
          />
        </div>

        <RoleCheckAction>
          <Button
            onClick={() => {
              setModalState({ mode: "create" });
            }}
            size="lg"
            type="button"
            loading={loading}
          >
            <Plus size={18} />
            Add Reseller
          </Button>
        </RoleCheckAction>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-900 uppercase bg-indigo-50">
              <tr>
                <th className="px-6 py-4 font-semibold">Reseller</th>
                <th className="px-6 py-4 font-semibold">Currency</th>
                <th className="px-6 py-4 font-semibold">Balance</th>
                <th className="px-6 py-4 font-semibold">Total Top-up</th>
                <th className="px-6 py-4 font-semibold">Total Usage</th>
                <th className="px-6 py-4 font-semibold">Outstanding</th>
                <th className="px-6 py-4 font-semibold">Updated At</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    Loading resellers...
                  </td>
                </tr>
              )}

              {!loading &&
                data.map((reseller) => (
                  <tr
                    key={reseller.id}
                    className="bg-white border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {reseller.name}
                    </td>

                    <td className="px-6 py-4">
                      {reseller.credit?.currency ?? "-"}
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      {reseller.credit?.balance?.toLocaleString() ?? 0}
                    </td>

                    <td className="px-6 py-4">
                      {reseller.credit?.totalTopUp?.toLocaleString() ?? 0}
                    </td>

                    <td className="px-6 py-4">
                      {reseller.credit?.totalUsage?.toLocaleString() ?? 0}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          reseller.credit?.hasOutstandingDebt
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {reseller.credit?.hasOutstandingDebt ? "Yes" : "No"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {new Date(reseller.credit?.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setModalState({
                              mode: "edit",
                              reseller,
                            });
                          }}
                          className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg"
                        >
                          <Edit2 size={16} />
                        </button>
                        {/* //no delete */}
                        {/* <button
                          onClick={() => {}}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalState.mode === "create" && (
        <ModalWrapper title="Create Reseller" onClose={closeModal}>
          <ResellerForm
            mode="create"
            loading={loading}
            onCancel={closeModal}
            onSubmit={handleCreateReseller}
          />
        </ModalWrapper>
      )}

      {modalState.mode === "edit" && (
        <ModalWrapper title="Edit Reseller" onClose={closeModal}>
          <ResellerForm
            mode="edit"
            initialValues={modalState.reseller!}
            loading={loading}
            onCancel={closeModal}
            onSubmit={handleEditReseller}
          />
        </ModalWrapper>
      )}

      <Pagination
        page={filterData.page}
        pageSize={filterData.limit}
        total={
          filterData.page * filterData.limit +
          (data.length === filterData.limit ? filterData.limit : 0)
        }
        onPageChange={(page) => setFilterData((prev) => ({ ...prev, page }))}
        onPageSizeChange={(limit) =>
          setFilterData((prev) => ({
            ...prev,
            limit,
            page: 1,
          }))
        }
      />
    </PageContainer>
  );
};

export default Resellers;
