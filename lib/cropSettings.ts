import { PixelCrop } from "react-image-crop";

export interface CropSettings {
  aspect?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export const CROP_SETTINGS = {
  // 🎟 Ticket Card Image — 418×208 → ~2.01:1
  TICKET_CARD: {
    aspect: 307/  192, // ✅ FIXED
    minWidth: 307,
    minHeight: 192,
  },

  // 🗂 Category Image — 252×208 → 63:52
  CATEGORY_IMAGE: {
    aspect: 252 / 208, // (63/52) same value, clearer
    minWidth: 252,
    minHeight: 208,
  },

  // ✨ Get Inspired — Big Image — 535×528 → almost square
  GET_INSPIRED_BIG: {
    aspect: 535 / 528, // ✅ FIXED (was wrong before)
    minWidth: 535,
    minHeight: 528,
  },

  // ✨ Get Inspired — Small Image — 372×256 → 93:64
  GET_INSPIRED_SMALL: {
    aspect: 372 / 256,
    minWidth: 372,
    minHeight: 256,
  },

  // 🏠 Landing Page Hero — 1440×700 → 72:35
  LANDING_HERO: {
    aspect: 1440 / 700,
    minWidth: 1440,
    minHeight: 700,
  },

  // 🧭 Explore Page — 1440×420 → 24:7
  EXPLORE_PAGE: {
    aspect: 1440 / 420,
    minWidth: 1440,
    minHeight: 420,
  },

  // 🎫 Ticket Detail — Big Image — 1095×417 → 365:139
  TICKET_DETAIL_BIG: {
    aspect: 1095 / 417,
    minWidth: 1095,
    minHeight: 417,
  },

  // 🎫 Ticket Detail — Small Image — 200×128 → 25:16
  TICKET_DETAIL_SMALL: {
    aspect: 200 / 128,
    minWidth: 200,
    minHeight: 128,
  },

  // 💳 Payment Method Logo (Square)
  PAYMENT_LOGO_SQUARE: {
    aspect: 1,
    minWidth: 200,
    minHeight: 200,
  },

  // 💳 Payment Method Logo (Landscape) — 3:2
  PAYMENT_LOGO_LANDSCAPE: {
    aspect: 3 / 2,
    minWidth: 300,
    minHeight: 200,
  },

  // 📄 Document Upload (Flexible ratio)
  DOCUMENT_UPLOAD: {
    minWidth: 720,
    minHeight: 400,
  },

  // 👤 Profile Image (Square)
  PROFILE_IMAGE: {
    aspect: 1,
    minWidth: 200,
    minHeight: 200,
  },
};


// export const CROP_SETTINGS = {
//   // 🎟 Ticket Card Image — 418×208 → aspect: 535 / 528,
//   TICKET_CARD: {
//     aspect: 535 / 528,
//     minWidth: 418,
//     minHeight: 208,
//   },

//   // 🗂 Category Image — 252×208 → 63:52
//   CATEGORY_IMAGE: {
//     aspect: 63 / 52,
//     minWidth: 252,
//     minHeight: 208,
//   },

//   // ✨ Get Inspired — Big Image — 535×528 → 535:528
//   GET_INSPIRED_BIG: {
//     aspect:209 / 104,
//     // aspect: 535 / 528,
//     minWidth: 535,
//     minHeight: 528,
//   },

//   // ✨ Get Inspired — Small Image — 372×256 → 93:64
//   GET_INSPIRED_SMALL: {
//     aspect: 93 / 64,
//     minWidth: 372,
//     minHeight: 256,
//   },

//   // 🏠 Landing Page Hero — 1440×700 → 72:35
//   LANDING_HERO: {
//     aspect: 72 / 35,
//     minWidth: 1440,
//     minHeight: 700,
//   },

//   // 🧭 Explore Page — 1440×420 → 24:7
//   EXPLORE_PAGE: {
//     aspect: 24 / 7,
//     minWidth: 1440,
//     minHeight: 420,
//   },

//   // 🎫 Ticket Detail — Big Image — 1095×417 → 365:139
//   TICKET_DETAIL_BIG: {
//     aspect: 365 / 139,
//     minWidth: 1095,
//     minHeight: 417,
//   },

//   // 🎫 Ticket Detail — Small Image — 200×128 → 25:16
//   TICKET_DETAIL_SMALL: {
//     aspect: 25 / 16,
//     minWidth: 200,
//     minHeight: 128,
//   },

//   // 💳 Payment Method Logo (Square)
//   PAYMENT_LOGO_SQUARE: {
//     aspect: 1,
//     minWidth: 200,
//     minHeight: 200,
//   },

//   // 💳 Payment Method Logo (Landscape) — 3:2
//   PAYMENT_LOGO_LANDSCAPE: {
//     aspect: 3 / 2,
//     minWidth: 300,
//     minHeight: 200,
//   },

//   // 📄 Document Upload (Flexible ratio)
//   DOCUMENT_UPLOAD: {
//     minWidth: 720,
//     minHeight: 400,
//   },

//   // 👤 Profile Image (Square)
//   PROFILE_IMAGE: {
//     aspect: 1,
//     minWidth: 200,
//     minHeight: 200,
//   },
// };

export type CropSettingType = keyof typeof CROP_SETTINGS;

/**
 * Get human-readable information about crop settings
 */
export function getCropSettingsInfo(settings: CropSettings | undefined, presetName?: CropSettingType): { label: string, description: string } {
  if (!settings) {
    return {
      label: "Flexible",
      description: "No specific crop requirements"
    };
  }

  if (presetName) {
    const presetLabelMap: Record<CropSettingType, string> = {
      TICKET_CARD: "Ticket Card",
      CATEGORY_IMAGE: "Category Image", 
      GET_INSPIRED_BIG: "Get Inspired (Big)",
      GET_INSPIRED_SMALL: "Get Inspired (Small)",
      LANDING_HERO: "Landing Hero",
      EXPLORE_PAGE: "Explore Page",
      TICKET_DETAIL_BIG: "Ticket Detail (Big)",
      TICKET_DETAIL_SMALL: "Ticket Detail (Small)",
      PAYMENT_LOGO_SQUARE: "Payment Logo (Square)",
      PAYMENT_LOGO_LANDSCAPE: "Payment Logo (Landscape)",
      DOCUMENT_UPLOAD: "Document Upload",
      PROFILE_IMAGE: "Profile Image",
    };

    const presetDescMap: Record<CropSettingType, string> = {
      TICKET_CARD: `Fixed aspect ratio: ${(CROP_SETTINGS.TICKET_CARD.aspect || 1).toFixed(2)} (${Math.round(CROP_SETTINGS.TICKET_CARD.aspect! * 100)}:${100}), Min: ${CROP_SETTINGS.TICKET_CARD.minWidth}×${CROP_SETTINGS.TICKET_CARD.minHeight}px`,
      CATEGORY_IMAGE: `Fixed aspect ratio: ${(CROP_SETTINGS.CATEGORY_IMAGE.aspect || 1).toFixed(2)} (${Math.round(CROP_SETTINGS.CATEGORY_IMAGE.aspect! * 100)}:${100}), Min: ${CROP_SETTINGS.CATEGORY_IMAGE.minWidth}×${CROP_SETTINGS.CATEGORY_IMAGE.minHeight}px`,
      GET_INSPIRED_BIG: `Fixed aspect ratio: ${(CROP_SETTINGS.GET_INSPIRED_BIG.aspect || 1).toFixed(2)} (${Math.round(CROP_SETTINGS.GET_INSPIRED_BIG.aspect! * 100)}:${100}), Min: ${CROP_SETTINGS.GET_INSPIRED_BIG.minWidth}×${CROP_SETTINGS.GET_INSPIRED_BIG.minHeight}px`,
      GET_INSPIRED_SMALL: `Fixed aspect ratio: ${(CROP_SETTINGS.GET_INSPIRED_SMALL.aspect || 1).toFixed(2)} (${Math.round(CROP_SETTINGS.GET_INSPIRED_SMALL.aspect! * 100)}:${100}), Min: ${CROP_SETTINGS.GET_INSPIRED_SMALL.minWidth}×${CROP_SETTINGS.GET_INSPIRED_SMALL.minHeight}px`,
      LANDING_HERO: `Fixed aspect ratio: ${(CROP_SETTINGS.LANDING_HERO.aspect || 1).toFixed(2)} (${Math.round(CROP_SETTINGS.LANDING_HERO.aspect! * 100)}:${100}), Min: ${CROP_SETTINGS.LANDING_HERO.minWidth}×${CROP_SETTINGS.LANDING_HERO.minHeight}px`,
      EXPLORE_PAGE: `Fixed aspect ratio: ${(CROP_SETTINGS.EXPLORE_PAGE.aspect || 1).toFixed(2)} (${Math.round(CROP_SETTINGS.EXPLORE_PAGE.aspect! * 100)}:${100}), Min: ${CROP_SETTINGS.EXPLORE_PAGE.minWidth}×${CROP_SETTINGS.EXPLORE_PAGE.minHeight}px`,
      TICKET_DETAIL_BIG: `Fixed aspect ratio: ${(CROP_SETTINGS.TICKET_DETAIL_BIG.aspect || 1).toFixed(2)} (${Math.round(CROP_SETTINGS.TICKET_DETAIL_BIG.aspect! * 100)}:${100}), Min: ${CROP_SETTINGS.TICKET_DETAIL_BIG.minWidth}×${CROP_SETTINGS.TICKET_DETAIL_BIG.minHeight}px`,
      TICKET_DETAIL_SMALL: `Fixed aspect ratio: ${(CROP_SETTINGS.TICKET_DETAIL_SMALL.aspect || 1).toFixed(2)} (${Math.round(CROP_SETTINGS.TICKET_DETAIL_SMALL.aspect! * 100)}:${100}), Min: ${CROP_SETTINGS.TICKET_DETAIL_SMALL.minWidth}×${CROP_SETTINGS.TICKET_DETAIL_SMALL.minHeight}px`,
      PAYMENT_LOGO_SQUARE: `Fixed aspect ratio: ${(CROP_SETTINGS.PAYMENT_LOGO_SQUARE.aspect || 1).toFixed(2)}, Min: ${CROP_SETTINGS.PAYMENT_LOGO_SQUARE.minWidth}×${CROP_SETTINGS.PAYMENT_LOGO_SQUARE.minHeight}px`,
      PAYMENT_LOGO_LANDSCAPE: `Fixed aspect ratio: ${(CROP_SETTINGS.PAYMENT_LOGO_LANDSCAPE.aspect || 1).toFixed(2)} (${Math.round(CROP_SETTINGS.PAYMENT_LOGO_LANDSCAPE.aspect! * 100)}:${100}), Min: ${CROP_SETTINGS.PAYMENT_LOGO_LANDSCAPE.minWidth}×${CROP_SETTINGS.PAYMENT_LOGO_LANDSCAPE.minHeight}px`,
      DOCUMENT_UPLOAD: `Flexible ratio, Min: ${CROP_SETTINGS.DOCUMENT_UPLOAD.minWidth}×${CROP_SETTINGS.DOCUMENT_UPLOAD.minHeight}px`,
      PROFILE_IMAGE: `Fixed aspect ratio: ${(CROP_SETTINGS.PROFILE_IMAGE.aspect || 1).toFixed(2)}, Min: ${CROP_SETTINGS.PROFILE_IMAGE.minWidth}×${CROP_SETTINGS.PROFILE_IMAGE.minHeight}px`,
    };

    return {
      label: presetLabelMap[presetName],
      description: presetDescMap[presetName]
    };
  } else {
    // Custom settings
    const aspectRatio = settings.aspect ? settings.aspect.toFixed(2) : "Flexible";
    const aspectStr = settings.aspect ? ` (${Math.round(settings.aspect * 100)}:${100})` : '';
    const minSize = settings.minWidth && settings.minHeight ? `, Min: ${settings.minWidth}×${settings.minHeight}px` : '';
    
    return {
      label: "Custom Settings",
      description: `Aspect ratio: ${aspectRatio}${aspectStr}${minSize}`
    };
  }
}



export async function getCroppedFile(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string,
  settings?: CropSettings
): Promise<File> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  let cropWidth = crop.width * scaleX;
  let cropHeight = crop.height * scaleY;

  /** 🚫 Enforce MIN resolution (important for hero + banners) */
  if (settings?.minWidth && cropWidth < settings.minWidth) {
    const ratio = settings.minWidth / cropWidth;
    cropWidth = settings.minWidth;
    cropHeight *= ratio;
  }

  if (settings?.minHeight && cropHeight < settings.minHeight) {
    const ratio = settings.minHeight / cropHeight;
    cropHeight = settings.minHeight;
    cropWidth *= ratio;
  }

  canvas.width = Math.round(cropWidth);
  canvas.height = Math.round(cropHeight);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas error");

  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) throw new Error("Crop failed");
        resolve(new File([blob], fileName, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.95
    );
  });
}


