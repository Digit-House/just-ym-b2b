export type FindAllProductsT = {
    data: ProductT[];
    total:number;
}

export type FilterProductListT = {
    category: string;
    cityId:string;
    countryId:string;
    limit:number;
    orderBy:{
        dir: string;
    },
    page:number;
}

export type ProductT = {
  category: string;
  city: string;
  description: string;
  dhSellingPrice: number;
  id:string;
  image: string;
  isCancellable: boolean;
  media: [];
  name: string;
  originalPrice: number;
  price: number;
};
