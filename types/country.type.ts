export type CurrencyT = {
  code: string;
  creditCardFee: number;
  description: string;
  markup: number;
  roundingUp: number;
};

export type CountryT = {
  id: string;
  code: string;
  name: string;
  mobilePrefix: string;

  isBilling: boolean;
  isCurrencyExchange: boolean;
  isDistributionTable: boolean;
  isListing: boolean;
  isPublished: boolean;

  currency: CurrencyT;

  createdAt: string;
  updatedAt: string;
  lastUpdated: string;
};
