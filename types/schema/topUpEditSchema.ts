// types/schema/topUpEditSchema.ts
import { z } from "zod";

export const topUpEditSchema = z.object({
  topUpBalance: z
    .number({ error: "Top-up balance is required" })
    .min(1, "Top-up balance must be greater than 0"),
  status: z.string().min(1, "Status is required"),
});

export type TopUpEditValues = z.infer<typeof topUpEditSchema>;
