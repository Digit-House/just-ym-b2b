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
