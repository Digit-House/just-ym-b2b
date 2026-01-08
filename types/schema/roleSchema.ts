import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  resellerId: z.string().optional(),
});

export type RoleFormValues = z.infer<typeof roleSchema>;
