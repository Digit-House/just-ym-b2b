import z from "zod";

export const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

export const userSchema = z
  .object({
    userName: z.string().min(1, "User Name is required"),
    email: z.string().email("Invalid email"),
    contactNo: z.string().trim().regex(PHONE_REGEX, "Invalid phone number"),
    countryCode: z.string().optional(),
    roleIds: z.array(z.string()).min(1, "At least one role must be selected"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserFormValues = z.infer<typeof userSchema>;
