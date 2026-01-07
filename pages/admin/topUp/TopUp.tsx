"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import SortSelect, { SortOption } from "@/components/SortSelect";
import Pagination from "@/components/Pagination";
import { TopUpHistoryT } from "@/types/wallet.type";
import { getAdminTopupHistory} from "@/graphql/wallet";
import { getErrMsg, SORT_OPTION } from "@/util/initData";
import { toast } from "sonner";
import { FileEdit } from "lucide-react";
import ModalWrapper from "@/components/ModalWrapper";
import TopUpEditForm from "./_components/TopUpEditForm";

const TopUp = () => {
  const [topUpData, setTopUpData] = useState<TopUpHistoryT[]>([]);
  const [editTopUp, setEditTopUp] = useState<TopUpHistoryT | null>(null);
  const [loading, setLoading] = useState(false);

  const [filterData, setFilterData] = useState({
    limit: 10,
    page: 1,
    orderBy: {
      dir: "desc" as "asc" | "desc",
    },
    status: null as string | null,
  });

  useEffect(() => {
    fetchTopUpHistory();
  }, [filterData]);

  const fetchTopUpHistory = async () => {
    try {
      setLoading(true);
      const res: any = await getAdminTopupHistory(filterData);
      console.log(res?.data?.findAllTopUpHistory?.data);
      setTopUpData(res?.data?.findAllTopUpHistory?.data || []);
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Top-up History"
        des="Review and manage reseller top-up transactions."
      />

      {/* Top bar */}
      <div className="flex items-center justify-end mb-5 gap-4 border border-[#21212124] py-[8px] px-[16px]">
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

      {/* Table */}
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
                  <td colSpan={5} className="px-6 py-8 text-center">
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
                      <button onClick={() => {
                        setEditTopUp(item);
                      }} className="text-indigo-600 hover:text-indigo-800">
                        <FileEdit size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {editTopUp && (
        <ModalWrapper
          title="Edit Country"
          onClose={() => setEditTopUp(null)}
          children={
            <TopUpEditForm
              initialValues={editTopUp}
              loading={false}
              onCancel={() => setEditTopUp(null)}
              onSubmit={() => {}}
            />
          }
        />
      )}

      {/* Pagination */}
      <Pagination
        page={filterData.page}
        pageSize={filterData.limit}
        total={
          filterData.page * filterData.limit +
          (topUpData.length === filterData.limit ? filterData.limit : 0)
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

export default TopUp;
