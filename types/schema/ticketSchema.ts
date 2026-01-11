import { z } from "zod";

export const ticketSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  whatToExpect: z.string().min(1, "What to expect is required"),
  addressLine: z.string().min(1, "Address line is required"),
  location: z.string().min(1, "Location is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  city: z.string().min(1, "City is required"),
  cityId: z.number().int().min(1, "City ID is required"),
  city_relation_id: z.string().min(1, "City relation ID is required"),
  countryId: z.string().min(1, "Country ID is required"),
  latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  longitude: z.number().min(-180).max(180, "Longitude must be between -180 and 180"),
  keywords: z.string().min(1, "Keywords are required"),
  image: z.string().min(1, "Image is required"),
  exclusions: z.array(z.string()),
  highlights: z.array(z.string()),
  howToUseList: z.array(z.string()),
  inclusions: z.array(z.string()),
  thingsToNote: z.array(z.string()),
  isBestSeller: z.boolean(),
  isCancellable: z.boolean(),
  isGTRecommend: z.boolean(),
  isInstantConfirmation: z.boolean(),
  isOpenDated: z.boolean(),
  originalPrice: z.number().min(0, "Original price must be greater than or equal to 0"),
  timezoneOffset: z.number().int(),
  blockedDate: z.array(
    z.object({
      date: z.string(),
      title: z.string(),
    })
  ),
  media: z.array(
    z.object({
      extension: z.string(),
      name: z.string(),
      path: z.string(),
      size: z.number().int().min(0),
      type: z.string(),
    })
  ),
  operatingHours: z.object({
    custom: z.string().nullable(),
    isToursActivities: z.boolean().nullable(),
    fixedDays: z.array(
      z.object({
        day: z.string(),
        startHour: z.string(),
        endHour: z.string(),
      })
    ),
  }),
  termsAndConditions: z.string().min(1, "Terms and conditions are required"),
  productOptions: z.array(
    z.object({
      currency: z.string().optional(),
      definedDuration: z.string().optional(),
      demandType: z.string().optional(),
      description: z.string().optional(),
      inclusions: z.array(z.string()).optional(),
      isDynamicPricing: z.boolean().optional(),
      isTagged: z.boolean().optional(),
      keywords: z.string().optional(),
      name: z.string().optional(),
      primaryTicket: z.string().optional(),
      productId: z.string().optional(),
      publishStart: z.date().optional(),
      isCapacity: z.boolean().optional(),
      redeemEnd: z.date().optional(),
      redeemStart: z.date().optional(),
      ticketFormat: z.string().optional(),
      ticketType: z.array(
        z.object({
          id: z.string().optional(),
          name: z.string(),
          sku: z.string(),
          globaltixId: z.number().int(),
          issuanceLimit: z.number().int().nullable(),
          maxPurchaseQty: z.number().int().nullable(),
          minPurchaseQty: z.number().int().nullable(),
          useBin: z.boolean(),
          applyToAllQna: z.boolean(),
          ageFrom: z.number().int().nullable(),
          ageTo: z.number().int().nullable(),
          nettPrice: z.number(),
          dhNetPrice: z.number(),
          dhSellingPrice: z.number(),
          dhRecommendedSellingPrice: z.number(),
          originalPrice: z.number(),
          similarTicketId: z.number().int().nullable(),
          createdAt: z.string(),
          updatedAt: z.string(),
          quantity: z.number().int(),
        })
      ),
      ticketValidity: z.string().optional(),
      timeSlot: z.array(z.string()).optional(),
      tourInformation: z.array(z.string()).optional(),
      type: z.string().optional(),
      // updatedAt: z.date(),
      // publishEnd: z.date().optional(),
      questions: z.array(
        z.object({
          cartItemId: z.string(),
          createdAt: z.date(),
          globaltixId: z.string(),
          id: z.string(),
          isAnswerLater: z.boolean(),
          optionCode: z.string(),
          optional: z.boolean(),
          optionList: z.array(
            z.object({
              key: z.string(),
              value: z.string(),
            })
          ),
          options: z.array(z.string()),
          question: z.string(),
          questionCode: z.string(),
          type: z.string(),
          updatedAt: z.date(),
        })
      ).optional(),
      visitDate: z.object({
        isOpenDated: z.boolean(),
        request: z.boolean(),
        required: z.boolean(),
      }).optional(),
      advanceBooking: z
        .object({
          day: z.number().int(),
          dayMinute: z.number().int(),
          hour: z.number().int(),
          minute: z.number().int(),
          required: z.boolean(),
        })
        .nullable().optional(),
      availability: z.enum(["AVAILABLE", "NOT_AVAILABLE"]).nullable().optional(),
    })
  ),
});

export type TicketFormValues = z.infer<typeof ticketSchema>;