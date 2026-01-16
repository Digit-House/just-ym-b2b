import React, { useState } from "react";
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

import { REVENUE_DATA } from "../../constants";
import PageHeader from "@/components/PageHeader";
import Select from "@/components/Select";
import PageContainer from "@/components/PageContainer";

import { useCategories } from "@/hooks/useCategories";
import { useCountries } from "@/hooks/useCountries";
import { useUser } from "@/provider/UserProvider";

import { toast } from "sonner";
import { getErrMsg } from "@/util/initData";
import { generateReport } from "@/graphql/report";

import { FilterReportT, ReportResT } from "@/types/report.type";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/* ----------------------------- Small Card ----------------------------- */
const ReportCard = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-sm text-gray-500">{title}</p>
  </div>
);

/* ----------------------------- Main Page ------------------------------ */
const Reports = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  /* -------- Default date = last 1 month -------- */
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

  /* ----------------------------- Data ----------------------------- */
  const { data: CATEGORIES } = useCategories({ limit: 10, page: 1 });
  const { data: COUNTRIES } = useCountries({
    limit: 250,
    page: 1,
    orderBy: { dir: "asc" },
    isPublished: true,
    search:undefined
  });

  /* ----------------------------- Export CSV ----------------------------- */
  const exportGenerateReport = async () => {
    try {
      setLoading(true);

      const res:any = await generateReport({
        ...filterExport,
        fromDate: filterExport.fromDate
          ? new Date(filterExport.fromDate).toISOString()
          : null,
        toDate: filterExport.toDate
          ? new Date(filterExport.toDate).toISOString()
          : null,
      });

      const resData:ReportResT = res.data.generateReport;
      // base64 -> blob
      const byteCharacters = atob(resData.data);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(null)
        .map((_, i) => byteCharacters.charCodeAt(i));

      const blob = new Blob([new Uint8Array(byteNumbers)], {
        type: resData.contentType || "text/csv",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${resData.filename}.${resData.extension}`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Export CSV successful");
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------- UI ----------------------------- */
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
                className={cn(
                  "w-[260px] justify-start text-left font-normal"
                )}
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
                initialFocus
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

          {/* Category & Country */}
          <div className="flex items-center border border-gray-200 px-2">
            <Select
              label="Categories"
              placeholder="Categories"
              options={CATEGORIES}
              value={categories}
              onChange={setCategories}
              width="w-32"
            />
            <Select
              label="Countries"
              placeholder="Countries"
              options={COUNTRIES?.data}
              value={countries}
              onChange={setCountries}
              width="w-32"
            />
          </div>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <ReportCard title="Tickets Purchased" value="1,025" />
        <ReportCard title="Tickets Issued" value="825" />
        <ReportCard title="Ticket Used" value="750" />
        <ReportCard title="Revenue" value="$25,750" />
      </div>

      {/* Chart */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Tickets Sold
        </h3>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value1" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PageContainer>
  );
};

export default Reports;
