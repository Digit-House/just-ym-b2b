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
import { REVENUE_DATA } from "../../constants";
import PageHeader from "@/components/PageHeader";
import Select from "@/components/Select";
import { useCategories } from "@/hooks/useCategories";
import { useCountries } from "@/hooks/useCountries";

const ReportCard = ({ title, value, subtext }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-sm text-gray-500 mb-0">{title}</p>
  </div>
);

const Reports = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  const { data: CATEGORIES } = useCategories({
    limit: 10,
    page: 1,
  });

  const { data: COUNTRIES } = useCountries();

  return (
    <div className="w-full mx-auto">
      <PageHeader
        title="Reports"
        des="Measure your advertising ROI and report website traffic."
      />
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-end">
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
              placeholder="01/09/2024 - 01/09/2025"
              readOnly
            />
          </div>

          <div className="flex items-center justify-between border border-[#21212124] py-[0px] px-[5px]">
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
              options={COUNTRIES}
              value={countries}
              onChange={setCountries}
              width="w-32"
            />
          </div>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          Export
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <ReportCard title="Tickets Purchased" value="1,025" />
        <ReportCard title="Tickets Issued" value="825" />
        <ReportCard title="Ticket Used" value="750" />
        <ReportCard title="Revenue" value="$ 25,750" />
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Tickets Sold</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={REVENUE_DATA}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={true}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar
                dataKey="value1"
                fill="#7C3AED"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
