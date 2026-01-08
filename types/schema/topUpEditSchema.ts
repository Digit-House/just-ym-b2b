// types/schema/topUpSchema.ts
import { z } from "zod";

export const topUpEditSchema = z.object({
  topUpBalance: z
    .number({ error: "Top-up balance is required" })
    .min(1, "Top-up balance must be greater than 0"),
});

export type TopUpEditValues = z.infer<typeof topUpEditSchema>;
