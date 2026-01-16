import { z } from "zod";

export const resellerSchema = z.object({
  name: z.string().min(2, "Reseller name is required"),
  active: z.boolean(),
  currency: z.string().min(1, "Currency is required"),
  balance: z
    .number({
      message: "Balance is required",
      // invalid_type_error: "Balance must be a number",
    })
    .min(0, "Balance must be 0 or more"),

  relatedImages: z.array(z.string()).optional(),
});

export type ResellerFormValues = z.infer<typeof resellerSchema>;
