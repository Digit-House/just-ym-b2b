



export type CurrencyRateT = {
  id: string;
  mmk: string; // THB → MMK rate
  createdAt: string;
  updatedAt: string;
  // creditTopUps: CreditTopUpT[];
};

// export type UserT = {
//   id: string;
//   email: string;
//   username: string;
//   contactNo?: string | null;
//   active: boolean;
// };

// export type ResellerT = {
//   id: string;
//   name: string;
//   email: string;
//   active: boolean;
// };

// export type CreditTopUpT = {
//   id: string;
//   currency: string;
//   relatedImages: string[];
//   topUpBalance: number;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   paymentMethod: PaymentMethodT;
//   createdUser: UserT;
//   confirmedUser?: UserT | null;
//   reseller: ResellerT;
// };



// export type PaymentMethodT = {
//   name: string;
//   type: "QR_CODE" | "BANK_TRANSFER";
//   bankName?: string | null;
//   accountName?: string | null;
//   accountNumber?: string | null;
//   qrCodeUrl?: string | null;
//   isActive: boolean;
// };



export type UpdateCurrencyRateInputT = {
  mmk: string;
};