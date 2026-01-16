export type FilterReportT = {
    fromDate: string|Date|null,
    selfSale: boolean,
    sellerId: string|null,
    toDate: string|Date|null
}

export type ReportResT = {
    contentType:string
    data:string;
    extension:string;
    filename:string;
}