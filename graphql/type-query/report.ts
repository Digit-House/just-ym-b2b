export const GENERATE_REPORTS = `
query GenerateReport($data: ReportInput!) {
    generateReport(data: $data) {
      contentType
      data
      extension
      filename
    }
  }
`;

export const GET_REPORTS = `
query MonthlySalesReport($data: MonthlySaleReportInput!) {
  monthlySalesReport(data: $data) {
    allTimeTickets
    allTimeSales
    allTimeProfit
    data {
      month
      profit
      totalSaleAmount
      totalTickets
    }
  }
}
`;
