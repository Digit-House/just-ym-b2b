"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import SortSelect from "@/components/SortSelect";
import Pagination from "@/components/Pagination";
import ModalWrapper from "@/components/ModalWrapper";
import TopUpEditForm from "./_components/TopUpEditForm";

import { TopUpHistoryT } from "@/types/wallet.type";
import { confirmTopup, getAdminTopupHistory } from "@/graphql/wallet";
import { getErrMsg, PAGE_SIZE, SORT_OPTION } from "@/util/initData";

import { toast } from "sonner";
import { FileEdit } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TopUpStatus = "CONFIRMED" | "PENDING" | "REJECTED";

const TopUp = () => {
  const [topUpData, setTopUpData] = useState<TopUpHistoryT[]>([]);
  const [editTopUp, setEditTopUp] = useState<TopUpHistoryT | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);

  const [filterData, setFilterData] = useState<{
    limit: number;
    page: number;
    orderBy: { dir: "asc" | "desc" };
    status: TopUpStatus | null;
  }>({
    limit: PAGE_SIZE,
    page: 1,
    orderBy: { dir: "desc" },
    status: null,
  });

  useEffect(() => {
    fetchTopUpHistory();
  }, [filterData, fetchAgain]);

  const fetchTopUpHistory = async () => {
    try {
      setLoading(true);
      const res: any = await getAdminTopupHistory(filterData);

      setTopUpData(res?.data?.findAllTopUpHistory?.data ?? []);
      setTotal(res?.data?.findAllTopUpHistory?.total ?? 0);
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  const updateTopUp = async (id: string, topUpBalance: number, status: string) => {
    try {
      setLoading(true);
      await confirmTopup(id, topUpBalance, status);
      setFetchAgain((prev) => !prev);
      setEditTopUp(null);
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Top up History"
        des="Review and manage reseller top-up transactions."
      />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border border-[#21212124] py-3 px-4 rounded-lg">
        <Select
          value={filterData.status ?? "all"}
          onValueChange={(value) =>
            setFilterData((prev) => ({
              ...prev,
              page: 1,
              status: value === "all" ? null : (value as TopUpStatus),
            }))
          }
        >
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <SortSelect
          options={SORT_OPTION}
          value={filterData.orderBy.dir === "desc" ? "newest" : "oldest"}
          onChange={(value) =>
            setFilterData((prev) => ({
              ...prev,
              page: 1,
              orderBy: {
                dir: value === "newest" ? "desc" : "asc",
              },
            }))
          }
        />
      </div>

      {/* --------------------------- Table --------------------------- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-900 uppercase bg-indigo-50">
              <tr>
                <th className="px-6 py-4 font-semibold">Reseller</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Currency</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Created At</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    Loading top-up history...
                  </td>
                </tr>
              )}

              {!loading &&
                topUpData.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.reseller?.name ?? "-"}
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      {item.topUpBalance.toLocaleString()}
                    </td>

                    <td className="px-6 py-4">{item.currency}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700"
                            : item.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => setEditTopUp(item)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <FileEdit size={18} />
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading && topUpData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    No Top up History found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editTopUp && (
        <ModalWrapper title="Edit TopUp" onClose={() => setEditTopUp(null)}>
          <TopUpEditForm
            initialValues={editTopUp}
            loading={loading}
            onCancel={() => setEditTopUp(null)}
            onSubmit={updateTopUp}
          />
        </ModalWrapper>
      )}

      <Pagination
        page={filterData.page}
        pageSize={filterData.limit}
        total={total}
        onPageChange={(page) =>
          setFilterData((prev) => ({ ...prev, page }))
        }
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

export default TopUp;
