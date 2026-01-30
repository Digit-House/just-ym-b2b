import { z } from "zod";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  name_mm: z.string().optional(),
  image: z.string().optional(),
  showOnLanding: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
