export type CurrencyRateT = {
  id: string;
  mmk: string; // THB to MMK rate
  createdAt: string;
  updatedAt: string;
};

export type UpdateCurrencyRateInputT = {
  mmk: string;
};