import { z } from "zod";

export const resellerSchema = z
  .object({
    name: z
      .string({
        message: "Reseller name is required",
      })
      .min(2, "Reseller name must be at least 2 characters")
      .nullable(),

    credit: z.object({
      balance: z
        .number({
          message: "Balance is required",
        })
        .min(0, "Balance must be 0 or more")
        .nullable(),

      currency: z
        .string({
          message: "Currency is required",
        })
        .nullable(),

      relatedImages: z
        .array(
          z.string().url("Each related image must be a valid URL"),
          {
            message: "Related images must be an array",
          }
        )
        .optional()
        .nullable(),
    }),

    user: z.object({
      contactNo: z
        .string({
          message: "Contact number must be a string",
        })
        .min(1, "Contact number is required")
        .nullable(),

      countryCode: z
        .string({
          message: "Country code must be a string",
        })
        .nullable(),

      active: z.boolean().default(true),

      email: z
        .string({
          message: "Email must be a string",
        })
        .email("Email format is invalid")
        .min(1, "Email is required")
        .nullable(),

      username: z
        .string({
          message: "Username must be a string",
        })
        .min(3, "Username must be at least 3 characters")
        .nullable(),

      password: z
        .string({
          message: "Password must be a string",
        })
        .min(6, "Password must be at least 6 characters")
        .nullable(),

      confirmPassword: z
        .string({
          message: "Confirm password must be a string",
        })
        .nullable(),

      imageURI: z
        .string({
          message: "Image URL must be a string",
        })
        .url("Image URL must be a valid URL")
        .optional()
        .nullable(),
    }),

    active: z.boolean().default(true),
  })
  .refine(
    (data) => {
      // Password confirmation validation
      if (data.user.password && data.user.confirmPassword) {
        return data.user.password === data.user.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["user", "confirmPassword"],
    }
  );

export type ResellerFormValues = z.infer<typeof resellerSchema>;
