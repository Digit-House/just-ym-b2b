import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

export const topUpSchema = z.object({
  amount: z.number().min(1000, "Minimum top up amount is THB 1000"),
  paymentMethod: z.enum(["BANK_TRANSFER", "QR_CODE"]),
  paymentMethodId: z.string().optional(),
  proofFiles: z
    .array(z.instanceof(File))
    .max(MAX_FILES, `Maximum ${MAX_FILES} files allowed`)
    .refine(
      (files) => files.every((f) => f.size <= MAX_FILE_SIZE),
      "Each file must be less than 5MB"
    )
    .optional(),
});

export type TopUpFormValues = z.infer<typeof topUpSchema>;

// Admin Topup Schema
export const adminTopupSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  from: z.enum(["CUSTOMER", "MAIN"]),
});

export type AdminTopupValues = z.infer<typeof adminTopupSchema>;
