import { PixelCrop } from "react-image-crop";

export interface CropSettings {
  aspect?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export const CROP_SETTINGS = {
  // 🎟 Ticket Card Image — 418×208 → 209:104
  TICKET_CARD: {
    aspect: 209 / 104,
    minWidth: 500,
    minHeight: 500,
  },

  // 🗂 Category Image — 252×208 → 63:52
  CATEGORY_IMAGE: {
    aspect: 63 / 52,
    minWidth: 252,
    minHeight: 208,
  },

  // ✨ Get Inspired — Big Image — 535×528 → 535:528
  GET_INSPIRED_BIG: {
    aspect: 535 / 528,
    minWidth: 535,
    minHeight: 528,
  },

  // ✨ Get Inspired — Small Image — 372×256 → 93:64
  GET_INSPIRED_SMALL: {
    aspect: 93 / 64,
    minWidth: 372,
    minHeight: 256,
  },

  // 🏠 Landing Page Hero — 1440×700 → 72:35
  LANDING_HERO: {
    aspect: 72 / 35,
    minWidth: 1440,
    minHeight: 700,
  },

  // 🧭 Explore Page — 1440×420 → 24:7
  EXPLORE_PAGE: {
    aspect: 24 / 7,
    minWidth: 1440,
    minHeight: 420,
  },

  // 🎫 Ticket Detail — Big Image — 1095×417 → 365:139
  TICKET_DETAIL_BIG: {
    aspect: 365 / 139,
    minWidth: 1095,
    minHeight: 417,
  },

  // 🎫 Ticket Detail — Small Image — 200×128 → 25:16
  TICKET_DETAIL_SMALL: {
    aspect: 25 / 16,
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

export type CropSettingType = keyof typeof CROP_SETTINGS;



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
