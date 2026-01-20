export type FilterReportT = {
  fromDate: string | Date | null;
  selfSale: boolean;
  sellerId: string | null;
  toDate: string | Date | null;
};

export type ReportMonthT = {
  month: string;
  profilt: number;
  totalSaleAmount: number;
  totalTickets: number;
};

export type MonthlySalesReportT = {
  allTimeProfit: number;
  allTimeSales: number;
  allTimeTickets: number;
  data: ReportMonthT[];
};

export type ReportT = {
  allTimeTickets: number;
  allTimeSales: number;
  allTimeProfit: number;
  data: ReportMonthT[];
};

export type GenReportResT = {
  contentType: string;
  data: string;
  extension: string;
  filename: string;
};


export const MOCK_REPORT_MONTH_DATA: ReportMonthT[] = [
    {
      month: "Jan",
      totalTickets: 820,
      totalSaleAmount: 16400,
      profilt: 4200,
    },
    {
      month: "Feb",
      totalTickets: 760,
      totalSaleAmount: 15200,
      profilt: 3900,
    },
    {
      month: "Mar",
      totalTickets: 910,
      totalSaleAmount: 18200,
      profilt: 4800,
    },
    {
      month: "Apr",
      totalTickets: 1050,
      totalSaleAmount: 21000,
      profilt: 5600,
    },
    {
      month: "May",
      totalTickets: 980,
      totalSaleAmount: 19600,
      profilt: 5200,
    },
    {
      month: "Jun",
      totalTickets: 1120,
      totalSaleAmount: 22400,
      profilt: 6100,
    },
  ];
  