// Predefined crop settings for different use cases
export const CROP_SETTINGS = {
  // Ticket Card Image: 418×208px (aspect ratio ~2.01:1)
  TICKET_CARD: {
    aspect: 418 / 208, // ~2.01
    minWidth: 418,
    minHeight: 208
  },
  
  // Category Image: 252×208px (aspect ratio ~1.21:1)
  CATEGORY_IMAGE: {
    aspect: 252 / 208, // ~1.21
    minWidth: 252,
    minHeight: 208
  },
  
  // Get Inspired Big Image: 535×528px (aspect ratio ~1.01:1)
  GET_INSPIRED_BIG: {
    aspect: 535 / 528, // ~1.01
    minWidth: 535,
    minHeight: 528
  },
  
  // Get Inspired Small Image: 372×256px (aspect ratio ~1.45:1)
  GET_INSPIRED_SMALL: {
    aspect: 372 / 256, // ~1.45
    minWidth: 372,
    minHeight: 256
  },
  
  // Landing Page Hero: 1440×700px (aspect ratio ~2.06:1)
  LANDING_HERO: {
    aspect: 1440 / 700, // ~2.06
    minWidth: 1440,
    minHeight: 700
  },
  
  // Explore Page Image: 1440×420px (aspect ratio ~3.43:1)
  EXPLORE_PAGE: {
    aspect: 1440 / 420, // ~3.43
    minWidth: 1440,
    minHeight: 420
  },
  
  // Ticket Detail Big Image: 1095×417px (aspect ratio ~2.63:1)
  TICKET_DETAIL_BIG: {
    aspect: 1095 / 417, // ~2.63
    minWidth: 1095,
    minHeight: 417
  },
  
  // Ticket Detail Small Image: 200×128px (aspect ratio ~1.56:1)
  TICKET_DETAIL_SMALL: {
    aspect: 200 / 128, // ~1.56
    minWidth: 200,
    minHeight: 128
  },
  
  // Payment Method Logo (Square)
  PAYMENT_LOGO_SQUARE: {
    aspect: 1,
    minWidth: 200,
    minHeight: 200
  },
  
  // Payment Method Logo (Landscape)
  PAYMENT_LOGO_LANDSCAPE: {
    aspect: 600 / 400, // 3:2
    minWidth: 300,
    minHeight: 200
  },
  
  // Document Upload (Flexible)
  DOCUMENT_UPLOAD: {
    minWidth: 720,
    minHeight: 400
  },
  
  // Profile Image (Square)
  PROFILE_IMAGE: {
    aspect: 1,
    minWidth: 200,
    minHeight: 200
  }
};

export type CropSettingType = keyof typeof CROP_SETTINGS;