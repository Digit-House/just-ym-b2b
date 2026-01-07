export type CityFilterT = {
  countryId: string;
  isPublished: boolean | null;
  limit: number;
  orderBy: {
    dir: string | any;
  };
  page: number;
  search: string | null;
};

export type CityT = {
  countryId: string;
  createdAt: string;
  id: string;
  isCapital: boolean;
  isPublished: boolean;
  name: string;
  timezoneOffset: number;
  updatedAt: string;
};
