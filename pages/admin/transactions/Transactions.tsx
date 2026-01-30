
import { useEffect, useState } from "react";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import SortSelect from "@/components/SortSelect";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";
import { getAllCreditLogs } from "@/graphql/transaction";
import { TransactionT } from "@/types/transaction.type";
import { getErrMsg, PAGE_SIZE, SORT_OPTION } from "@/util/initData";
import MultiSelect, { SelectOption } from "@/components/MultiSelect";
import { RotateCcw, ArrowUpRight, ArrowDownRight } from "lucide-react";
import NotFoundComponent from "@/components/NotFoundComponent";

const Transactions = () => {
  const [data, setData] = useState<TransactionT[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [filterData, setFilterData] = useState({
    included_credits: ["CUSTOMER"],
    limit: PAGE_SIZE,
    page: 1,
    orderBy: {
      dir: "desc",
      field: "updatedAt",
    }
  });

  useEffect(() => {
    fetchTransactions();
  }, [filterData]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // Transform filter data to match GraphQL expected format
      const payload: any = {
        ...filterData,
        included_credits: filterData.included_credits
      };
      const res: any = await getAllCreditLogs(payload);
      setData(res?.data?.findAllCreditLogs?.data || []);
      setTotal(res?.data?.findAllCreditLogs?.total || 0);
    } catch (err) {
      toast.error(getErrMsg(err as any, "message"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreditTypeChange = (selectedValues: string[]) => {
    setFilterData(prev => ({
      ...prev,
      page: 1,
      included_credits: selectedValues
    }));
  };

  const handleSortChange = (value: string) => {
    setFilterData(prev => ({
      ...prev,
      page: 1,
      orderBy: {
        dir: value === "newest" ? "desc" : "asc",
        field: "updatedAt"
      }
    }));
  };

  const handleResetFilters = () => {
    setFilterData({
      included_credits: ["CUSTOMER"],
      limit: PAGE_SIZE,
      page: 1,
      orderBy: {
        dir: "desc",
        field: "updatedAt",
      }
    });
  };

  const getCreditTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "CUSTOMER": "Customer",
      "GT_BALANCE": "GT Balance",
      "GT_BALANCE_MAIN": "GT Balance Main",
      "MAIN": "Main"
    };
    return labels[type] || type;
  };

  const getActionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "ADMIN_SALE": "Admin Sale",
      "AGENT_SALE": "Agent Sale",
      "CUSTOMER_SALE": "Customer Sale",
      "GT_TOP_UP": "GT Top Up",
      "TOP_UP": "Top Up"
    };
    return labels[type] || type;
  };

  const filtersChanged = 
    (filterData.included_credits.length !== 1 || filterData.included_credits[0] !== "CUSTOMER") || 
    filterData.orderBy.dir !== "desc";

  return (
    <PageContainer>
      <PageHeader
        title="Transactions"
        des="View and manage credit transaction logs."
      />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border border-[#21212124] py-3 px-4 rounded-lg">
        <div className="flex gap-5 items-center">
          <MultiSelect
            options={
              [
                { name: "Customer", id: "CUSTOMER" },
                { name: "GT Balance", id: "GT_BALANCE" },
                { name: "GT Balance Main", id: "GT_BALANCE_MAIN" },
                { name: "Main", id: "MAIN" }
              ]
            }
            value={filterData.included_credits}
            onChange={handleCreditTypeChange}
            placeholder="Select Credit Types"
            width="w-[250px]"
          />
        </div>

        <div className="flex items-center gap-4">
          <SortSelect
            options={SORT_OPTION}
            value={filterData.orderBy.dir === "desc" ? "newest" : "oldest"}
            onChange={handleSortChange}
          />
          
          {filtersChanged && (
            <button
              onClick={handleResetFilters}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Reset filters"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-900 uppercase bg-indigo-50">
              <tr>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Action Type</th>
                <th className="px-6 py-4 font-semibold">Transaction ID</th>
                <th className="px-6 py-4 font-semibold">TopUp ID</th>
                <th className="px-6 py-4 font-semibold">Reseller Email</th>
                <th className="px-6 py-4 font-semibold">Created At</th>
                <th className="px-6 py-4 font-semibold">Updated At</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    Loading transactions...
                  </td>
                </tr>
              )}

              {!loading && data.length > 0 && 
                data.map((transaction, index) => (
                  <tr
                    key={`${transaction?.actionLog?.txn?.id}-${index}`}
                    className="bg-white border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {transaction.type === "PLUS" ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`font-semibold ${transaction.type === "PLUS" ? "text-green-600" : "text-red-600"}`}>
                          {transaction.type === "PLUS" ? "+" : "-"} {Math.abs(transaction.amount).toLocaleString()}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {filterData.included_credits.map((creditType: string) => (
                          <span 
                            key={creditType} 
                            className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                          >
                            {getCreditTypeLabel(creditType)}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {getActionTypeLabel(transaction.actionLog.type)}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono text-sm">
                      {transaction?.actionLog?.txn?.id || "-"}
                    </td>

                    <td className="px-6 py-4 font-mono text-sm">
                      {transaction?.actionLog?.topUpId || "-"}
                    </td>

                    <td className="px-6 py-4">
                      {transaction.credit?.reseller?.email || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {new Date(transaction?.actionLog?.createdAt).toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {new Date(transaction.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}

              {!loading && data.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10">
                    <NotFoundComponent message="No transactions found" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={filterData.page}
        pageSize={filterData.limit}
        total={total}
        onPageChange={(page) => setFilterData(prev => ({ ...prev, page }))}
        onPageSizeChange={(limit) =>
          setFilterData(prev => ({
            ...prev,
            limit,
            page: 1,
          }))
        }
      />
    </PageContainer>
  );
};

export default Transactions;