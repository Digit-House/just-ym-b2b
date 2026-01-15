import { useState, useCallback } from 'react';

interface OpenPreviewResult {
  success?: boolean;
  error?: string;
}

interface UseImagePreviewReturn {
  previewImage: string | null;
  previewFile: File | null;
  openPreview: (file: File) => OpenPreviewResult;
  closePreview: () => void;
}

export const useImagePreview = (): UseImagePreviewReturn => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const openPreview = useCallback((file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return { error: "Please upload only JPEG or PNG images" };
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { 
        error: `File size exceeds 5MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB` 
      };
    }

    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
    setPreviewFile(file);
    
    return { success: true };
  }, []);

  const closePreview = useCallback(() => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
    setPreviewFile(null);
  }, [previewImage]);

  return {
    previewImage,
    previewFile,
    openPreview,
    closePreview
  };
};