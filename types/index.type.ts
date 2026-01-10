export interface FilterT {
    limit:number;
    orderBy:{
        dir:string;
    },
    page:number;
}

export type SortT = "newest" | "oldest"