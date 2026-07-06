import { z } from "zod";
import { VOUCHER_DISCOUNT_TYPE_ENUM } from "../voucher.type";

export const voucherSchema = z
  .object({
    active: z.boolean(),

    name: z.string().min(1, "Name is required"),

    name_mm: z.string().min(1, "Name is required"),

    description: z.string().min(1, "Description is required"),

    description_mm: z.string().min(1, "Description is required"),

    discountType: z.nativeEnum(VOUCHER_DISCOUNT_TYPE_ENUM, {
      message: "Discount type is required",
    }),

    discountValue: z
      .number({ message: "Discount value is required" })
      .positive("Must be greater than 0"),

    // ✅ OPTIONAL dates
    startDate: z.date().optional(),
    endDate: z.date().optional(),

    minPurchase: z
      .number({ message: "Minimum purchase is required" })
      .nonnegative(),

    minQuantity: z
      .number({ message: "Minimum quantity is required" })
      .int()
      .positive(),

    maximumAmount: z.preprocess(
      (v) => (v === "" || v == null ? undefined : Number(v)),
      z.number().positive().optional()
    ),

    usageLimit: z
      .number({ message: "Usage limit is required" })
      .int()
      .positive(),

    // ✅ optional
    specialDay: z.string().optional().nullable(),

    isCodeOnly: z.boolean(),

    codePrefix: z.string().optional().nullable(),

    codes: z.object({
      comment: z.string().optional().nullable(),
      count: z.number().int().positive().optional(),
    }),

    // Tracks whether the "Add Coupon Code" panel has been opened (edit mode
    // only) — new codes.comment/count are only required once it has.
    addCodeRequested: z.boolean().optional(),

    // Edits to already-generated codes (edit mode only).
    codeUpdates: z
      .array(
        z.object({
          id: z.string(),
          code: z.string().optional(),
          redeemedAt: z.string().optional().nullable(),
          active: z.boolean(),
          comment: z.string().optional().nullable(),
        })
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    const {
      startDate,
      endDate,
      discountType,
      discountValue,
      maximumAmount,
      isCodeOnly,
      codePrefix,
      codes,
      addCodeRequested,
    } = data;

    // ✅ codePrefix required whenever isCodeOnly is enabled
    if (isCodeOnly) {
      if (!codePrefix) {
        ctx.addIssue({
          path: ["codePrefix"],
          message: "Code prefix is required",
          code: z.ZodIssueCode.custom,
        });
      }

      // codes.comment/count are only required once the "Add Coupon Code"
      // panel is active (always true on create, opt-in on edit).
      if (addCodeRequested) {
        if (codes.count == null) {
          ctx.addIssue({
            path: ["codes", "count"],
            message: "Code count is required",
            code: z.ZodIssueCode.custom,
          });
        }

        if (!codes.comment) {
          ctx.addIssue({
            path: ["codes", "comment"],
            message: "Code comment is required",
            code: z.ZodIssueCode.custom,
          });
        }
      }
    }

    // ✅ Only validate if BOTH dates exist
    if (startDate && endDate && endDate <= startDate) {
      ctx.addIssue({
        path: ["endDate"],
        message: "End date must be greater than start date",
        code: z.ZodIssueCode.custom,
      });
    }

    // ✅ Percentage discount max 100
    if (
      discountType === VOUCHER_DISCOUNT_TYPE_ENUM.PERCENTAGE &&
      discountValue > 100
    ) {
      ctx.addIssue({
        path: ["discountValue"],
        message: "Percentage discount cannot be more than 100",
        code: z.ZodIssueCode.custom,
      });
    }

    // ✅ maximumAmount required ONLY for percentage
    if (
      discountType === VOUCHER_DISCOUNT_TYPE_ENUM.PERCENTAGE &&
      maximumAmount == null
    ) {
      ctx.addIssue({
        path: ["maximumAmount"],
        message: "Maximum amount is required for percentage discount",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type VoucherFormValues = z.input<typeof voucherSchema>;
