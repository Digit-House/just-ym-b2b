"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { addMonths, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";

import PageHeader from "@/components/PageHeader";
import Select from "@/components/MultiSelect";
import PageContainer from "@/components/PageContainer";

import { useCategories } from "@/hooks/useCategories";
import { useCountries } from "@/hooks/useCountries";
import { useUser } from "@/provider/UserProvider";

import { toast } from "sonner";
import { getErrMsg } from "@/util/initData";
import { generateReport, getReports } from "@/graphql/report";

import {
  FilterReportT,
  GenReportResT,
  ReportMonthT,
} from "@/types/report.type";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const ReportCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-sm text-gray-500">{title}</p>
  </div>
);

const Reports = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const oneMonthAgo = addMonths(today, -1);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: oneMonthAgo,
    to: today,
  });

  const [filterExport, setFilterExport] = useState<FilterReportT>({
    fromDate: oneMonthAgo,
    toDate: today,
    selfSale: user?.type !== "OWNER",
    sellerId: user?.id ?? null,
  });

  const [reportStats, setReportStats] = useState({
    allTimeProfit: 0,
    allTimeSales: 0,
    allTimeTickets: 0,
  });

  const [reportData, setReportData] = useState<ReportMonthT[]>([]);

  // do not remove
  // const { data: CATEGORIES } = useCategories({ limit: 10, page: 1 });
  // const { data: COUNTRIES } = useCountries({
  //   limit: 250,
  //   page: 1,
  //   orderBy: { dir: "asc" },
  //   isPublished: true,
  //   search:undefined
  // });


  useEffect(() => {
    fetchReports();
  }, [filterExport.fromDate, filterExport.toDate]);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const res = await getReports({
        ...filterExport,
        fromDate: filterExport.fromDate
          ? new Date(filterExport.fromDate).toISOString()
          : null,
        toDate: filterExport.toDate
          ? new Date(filterExport.toDate).toISOString()
          : null,
      });

      //@ts-ignore
      const monthData = res?.data?.monthlySalesReport;
      setReportData(monthData?.data ?? []);
      setReportStats({
        allTimeProfit: monthData?.allTimeProfit ?? 0,
        allTimeSales: monthData?.allTimeSales ?? 0,
        allTimeTickets: monthData?.allTimeTickets ?? 0,
      });
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  const exportGenerateReport = async () => {
    try {
      setLoading(true);

      const res: any = await generateReport({
        ...filterExport,
        fromDate: filterExport.fromDate
          ? new Date(filterExport.fromDate).toISOString()
          : null,
        toDate: filterExport.toDate
          ? new Date(filterExport.toDate).toISOString()
          : null,
      });

      const resData: GenReportResT = res.data.generateReport;

      const byteCharacters = atob(resData.data);
      const byteNumbers = Array.from(byteCharacters, (c) =>
        c.charCodeAt(0)
      );

      const blob = new Blob([new Uint8Array(byteNumbers)], {
        type: resData.contentType || "text/csv",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${resData.filename}.${resData.extension}`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      URL.revokeObjectURL(url);

      toast.success("Export CSV successful");
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Reports"
        des="Measure your advertising ROI and report website traffic."
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-end">
        <div className="flex gap-4 w-full md:w-auto">
          {/* Date Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-[260px] justify-start text-left font-normal")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from && dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                    {format(dateRange.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  <span>Select date range</span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                numberOfMonths={2}
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => {
                  if (!range?.from || !range?.to) return;

                  setDateRange(range);
                  setFilterExport((prev) => ({
                    ...prev,
                    fromDate: range.from,
                    toDate: range.to,
                  }));
                }}
              />
            </PopoverContent>
          </Popover>

           {/* // do not remove        */}
          {/* Category & Country */}
          {/* <div className="flex items-center border border-gray-200 px-2 rounded-md">
            <Select
              label="Categories"
              placeholder="Categories"
              options={CATEGORIES}
              value={[]}
              onChange={() => {}}
              width="w-32"
            />
            <Select
              label="Countries"
              placeholder="Countries"
              options={COUNTRIES?.data}
              value={[]}
              onChange={() => {}}
              width="w-32"
            />
          </div> */}
        </div>

        {/* Export */}
        <Button
          onClick={exportGenerateReport}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {loading ? "Loading..." : "Export CSV"}
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ReportCard
          title="Tickets Sold"
          value={reportStats.allTimeTickets.toLocaleString()}
        />
        <ReportCard
          title="Total Sales"
          value={`THB ${reportStats.allTimeSales.toLocaleString()}`}
        />
        <ReportCard
          title="Total Profit"
          value={`THB ${reportStats.allTimeProfit.toLocaleString()}`}
        />
      </div>

      {/* Chart */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Monthly Sales Report
        </h3>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="totalTickets"
                fill="#7C3AED"
                radius={[4, 4, 0, 0]}
                name="Tickets"
              />
              <Bar
                dataKey="totalSaleAmount"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                name="Sales"
              />
              <Bar
                dataKey="profilt"
                fill="#F59E0B"
                radius={[4, 4, 0, 0]}
                name="Profit"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PageContainer>
  );
};

export default Reports;
