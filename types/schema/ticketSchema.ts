import { z } from "zod";

export const ticketSchema = z.object({
  id: z.string().optional().nullable(),

  name: z.string().optional().nullable(),
   originalPrice: z.number().optional().nullable(),
  description: z.string().optional().nullable(),
  description_mm:z.string().optional().nullable(),
  whatToExpect: z.string().optional().nullable(),
  whatToExpect_mm:z.string().optional().nullable(),

  addressLine: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),

  countryId: z.string().optional().nullable(),
  city_relation_id: z.string().optional().nullable(),

  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),

  keywords: z.string().optional().nullable(),
  image: z.string().optional().nullable(),

  exclusions: z.array(z.string()).optional().nullable(),
  exclusions_mm: z.array(z.string()).optional().nullable(),

  fromPrice: z.number().optional().nullable(),
  fromReseller: z.boolean().optional().nullable(),
 

  highlights: z.array(z.string()).optional().nullable(),
  highlights_mm: z.array(z.string()).optional().nullable(),

  howToUseList: z.array(z.string()).optional().nullable(),
  howToUseList_mm: z.array(z.string()).optional().nullable(),

  inclusions: z.array(z.string()).optional().nullable(),
  inclusions_mm: z.array(z.string()).optional().nullable(),
  media: z.array(
    z.object({
      extension: z.string().optional().nullable(),
      isPublished: z.boolean().optional().nullable(),
      name: z.string().optional().nullable(),
      path: z.string().optional().nullable(),
      size: z.number().optional().nullable(),
      type: z.string().optional().nullable(),
    })
  ).optional().nullable(),
  isBestSeller: z.boolean().optional().nullable(),
  isCancellable: z.boolean().optional().nullable(),
  isGTRecommend: z.boolean().optional().nullable(),
  isInstantConfirmation: z.boolean().optional().nullable(),
  isOpenDated: z.boolean().optional().nullable(),
  isOwnContracted: z.boolean().optional().nullable(),
  isPublished: z.boolean().optional().nullable(),

  timezoneOffset: z.number().optional().nullable(),

  termsAndConditions: z.string().optional().nullable(),
  termsAndConditions_mm: z.string().optional().nullable(),

  thingsToNote: z.array(z.string()).optional().nullable(),
  thingsToNote_mm: z.array(z.string()).optional().nullable(),

  operatingHours: z.object({
    custom: z.string().optional().nullable(),
    isToursActivities: z.boolean().optional().nullable(),
    fixedDays: z.array(
      z.object({
        day: z.string().optional().nullable(),
        startHour: z.string().optional().nullable(),
        endHour: z.string().optional().nullable(),
      })
    ).optional().nullable(),
  }).optional().nullable(),

  productOptions: z.array(
    z.object({
      id: z.string().optional().nullable(),

      name: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      image: z.string().optional().nullable(),
      keywords: z.string().optional().nullable(),

      inclusions: z.array(z.string()).optional().nullable(),
      inclusions_mm: z.array(z.string()).optional().nullable(),
      exclusions: z.array(z.string()).optional().nullable(),
      exclusions_mm: z.array(z.string()).optional().nullable(),

      howToUse: z.array(z.string()).optional().nullable(),
      howToUse_mm: z.array(z.string()).optional().nullable(),

      termsAndConditions: z.string().optional().nullable(),
      termsAndConditions_mm: z.string().optional().nullable(),

      cancellationNotes: z.array(z.string()).optional().nullable(),

      cancellationPolicy: z.object({
        percentReturn: z.number().optional().nullable(),
        refundDuration: z.number().optional().nullable(),
      }).optional().nullable(),

      advanceBooking: z.object({
        day: z.number().optional().nullable(),
        dayMinute: z.number().optional().nullable(),
        hour: z.number().optional().nullable(),
        minute: z.number().optional().nullable(),
        required: z.boolean().optional().nullable(),
      }).optional().nullable(),

      isCancellable: z.boolean().optional().nullable(),
      isPublished: z.boolean().optional().nullable(),
      isTagged: z.boolean().optional().nullable(),
      primaryTicket: z.boolean().optional().nullable(),

      publishStart: z.string().optional().nullable(),
      publishEnd: z.string().optional().nullable(),
      redeemStart: z.string().optional().nullable(),
      redeemEnd: z.string().optional().nullable(),

      sourceName: z.string().optional().nullable(),
      sourceTitle: z.string().optional().nullable(),

      tourInformation: z.array(z.string()).optional().nullable(),

      visitDate: z.object({
        isOpenDated: z.boolean().optional().nullable(),
        request: z.boolean().optional().nullable(),
        required: z.boolean().optional().nullable(),
      }).optional().nullable(),

      ticketTypes: z.array(
        z.object({
          originalPrice:z.number().optional().nullable(),
          dhNetMerchantPrice: z.number().optional().nullable(),
          dhNetPrice: z.number().optional().nullable(),
          minmumSellingPrice: z.number().optional().nullable(),
          dhSellingPrice: z.number().optional().nullable(),
          dhRecommendedSellingPrice: z.number().optional(),
          ticketTypeId: z.string(),
        })
      ).optional().nullable(),
    })
  ).optional().nullable(),
});

export type TicketFormValues = z.infer<typeof ticketSchema>;
