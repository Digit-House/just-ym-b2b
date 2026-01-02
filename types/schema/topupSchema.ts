import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

export const topUpSchema = z.object({
  amount: z.number().min(100, "Minimum top up amount is THB 100"),
  paymentMethod: z.enum(["card", "bank"]),
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
