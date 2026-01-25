import React, { useCallback, useEffect, useMemo, useState } from "react";
import { X, ZoomIn, Download } from "lucide-react";
import { preFixImg } from "@/util/initData";

interface ImagePreviewProps {
  images: string[];
  title?: string;
  className?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  images,
  title = "Image Preview",
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const isOpen = currentIndex !== null;
  const previewImage = useMemo(
    () => (currentIndex !== null ? images[currentIndex] : null),
    [currentIndex, images]
  );

  /* -------------------- ACTIONS -------------------- */

  const openPreview = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const closePreview = useCallback(() => {
    setCurrentIndex(null);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((i) =>
      i !== null && i < images.length - 1 ? i + 1 : i
    );
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  }, []);

  const downloadImage = useCallback(() => {
    if (!previewImage || currentIndex === null) return;

    const link = document.createElement("a");
    link.href = previewImage;
    link.download = `image-${currentIndex + 1}.jpg`;
    link.click();
  }, [previewImage, currentIndex]);

  /* -------------------- KEYBOARD -------------------- */

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closePreview, goNext, goPrev]);

  if (!images.length) return null;

  /* -------------------- RENDER -------------------- */

  return (
    <>
      {/* Thumbnails */}
      <div className={`space-y-3 ${className}`}>
        {title && (
          <h4 className="text-sm font-black text-gray-700 uppercase tracking-wide">
            {title}
          </h4>
        )}

        <div className="flex flex-wrap gap-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => openPreview(index)}
              className="relative group transition-transform hover:scale-105"
            >
              <img
                src={preFixImg(img)}
                alt={`${title} ${index + 1}`}
                className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200 group-hover:border-indigo-300"
              />

              <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <ZoomIn size={16} className="text-white" />
              </div>

              <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[8px] font-black rounded-full w-5 h-5 flex items-center justify-center">
                {index + 1}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isOpen && previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4"
          onClick={closePreview}
        >
          <div className="relative h-full max-w-6xl mx-auto flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-black">
                {title} ({currentIndex! + 1}/{images.length})
              </h3>

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadImage();
                  }}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2"
                >
                  <Download size={16} />
                  Download
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closePreview();
                  }}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center relative">
              <img
                src={preFixImg(previewImage)}
                className="max-h-full max-w-full rounded-lg shadow-2xl object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {images.length > 1 && (
                <>
                  <NavButton
                    disabled={currentIndex === 0}
                    onClick={goPrev}
                    left
                  />
                  <NavButton
                    disabled={currentIndex === images.length - 1}
                    onClick={goNext}
                  />
                </>
              )}
            </div>

            {/* Footer thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => openPreview(index)}
                    className={`w-12 h-12 rounded-lg border-2 ${
                      index === currentIndex
                        ? "border-white scale-110"
                        : "border-gray-600"
                    }`}
                  >
                    <img
                      src={preFixImg(img)}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

/* -------------------- SMALL COMPONENT -------------------- */

const NavButton = ({
  onClick,
  disabled,
  left,
}: {
  onClick: () => void;
  disabled: boolean;
  left?: boolean;
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    disabled={disabled}
    className={`absolute ${
      left ? "left-4" : "right-4"
    } top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white disabled:opacity-30`}
  >
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points={left ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  </button>
);

export default ImagePreview;
