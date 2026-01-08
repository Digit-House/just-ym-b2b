import { z } from "zod";

export const paymentMethodSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  bankName: z.string().min(1, "Bank Name is required"),
  accountName: z.string().min(1, "Account Name is required"),
  accountNumber: z.string().min(1, "Account Number is requried"),
  description: z.string().optional(),
  instructions: z.string().optional(),
  logo: z.string().optional(),
  qrCodeUrl: z.string().optional(),
  isActive: z.boolean(),
});

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;
