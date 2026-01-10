import { z } from "zod";

export const paymentMethodSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  bankName: z.string().min(1, "Bank Name is required"),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  description: z.string().optional(),
  instructions: z.string().optional(),
  logo: z.string().optional(),
  qrCodeUrl: z.string().optional(),
  isActive: z.boolean(),
}).superRefine((data, ctx) => {
  if (data.type === "BANK_TRANSFER") {
    if (!data.accountName || data.accountName.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Account Name is required for Bank Transfer",
        path: ["accountName"],
      });
    }
    if (!data.accountNumber || data.accountNumber.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Account Number is required for Bank Transfer",
        path: ["accountNumber"],
      });
    }
  }
  
  if (data.type === "QR_CODE") {
    if (!data.qrCodeUrl || data.qrCodeUrl.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "QR Code Image is required for QR Code payment method",
        path: ["qrCodeUrl"],
      });
    }
  }
});

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;
