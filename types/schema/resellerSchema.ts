// schemas/reseller.schema.ts
import { z } from "zod";

export const resellerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  active: z.boolean(),
  currency: z.string().min(1, "Currency is required"),
  balance: z.number().min(0),
});

export type ResellerFormValues = z.infer<typeof resellerSchema>;
