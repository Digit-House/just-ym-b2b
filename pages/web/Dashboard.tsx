import React from "react";
import Header from "../../components/Header";
import { Ticket, Package, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { REVENUE_DATA } from "../../constants";
import PageHeader from "@/components/PageHeader";
import { useUser } from "@/provider/UserProvider";

const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  colorClass,
  iconBgClass,
}: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900 mb-4">{value}</h3>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-green-500 flex items-center font-medium">
          <TrendingUp size={16} className="mr-1" />
          8.5%
        </span>
        <span className="text-gray-400">{subtext}</span>
      </div>
    </div>
    <div className={`p-4 rounded-full ${iconBgClass}`}>
      <Icon size={24} className={colorClass} />
    </div>
  </div>
);

const Dashboard = () => {
  const {user} = useUser();
  return (
    <div className="w-full mx-auto pt-10">
      <PageHeader
        title={`Welcome Back, ${user?.username}`}
        des="Measure your advertising ROI and report website traffic."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Tickets Sold"
          value="1,245"
          subtext="Up from last month"
          icon={Ticket}
          iconBgClass="bg-indigo-50"
          colorClass="text-indigo-600"
        />
        <StatCard
          title="Available Tickets"
          value="80"
          subtext="Up from yesterday"
          icon={Package}
          iconBgClass="bg-green-50"
          colorClass="text-green-600"
        />
        <StatCard
          title="Total Earnings"
          value="THB 12,450"
          subtext="Up from last month"
          icon={TrendingUp}
          iconBgClass="bg-yellow-50"
          colorClass="text-yellow-600"
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              Revenue by customer type
            </p>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-gray-900">THB 240.8K</h3>
              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md flex items-center">
                14% <TrendingUp size={12} className="ml-1" />
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            {/* Legend Customization simulation */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>{" "}
              Bangkok
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>{" "}
              Singapore
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>{" "}
              Vietnam
            </div>
            <button className="px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">
              Jan 2024 - Dec 2024
            </button>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={REVENUE_DATA}
              barSize={20}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
                stackId="a"
                fill="#A78BFA"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="value2"
                stackId="a"
                fill="#2DD4BF"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="value3"
                stackId="a"
                fill="#FBBF24"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
