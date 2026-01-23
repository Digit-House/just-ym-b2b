export type PaymentMethodTypeT = "BANK_TRANSFER" | "QR_CODE"

export type PaymentMethodT = {
  accountName: string;
  accountNumber: string;
  bankName: string;
  id: string;
  instructions: string;
  description:string;
  isActive: boolean;
  logo: string;
  name: string;
  qrCodeUrl: string;
  type: "BANK_TRANSFER" | "QR_CODE";
  createdAt: string;
  updatedAt: string;
  currency: "THB" | "MMK";
};
