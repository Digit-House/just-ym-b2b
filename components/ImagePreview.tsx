import React, { useState } from 'react';
import { X, ZoomIn, Download } from 'lucide-react';
import { preFixImg } from '@/util/initData';

interface ImagePreviewProps {
  images: string[];
  title?: string;
  className?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  images, 
  title = "Image Preview",
  className = ""
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const openPreview = (imageUrl: string, index: number) => {
    setPreviewImage(imageUrl);
    setCurrentIndex(index);
  };

  const closePreview = () => {
    setPreviewImage(null);
    setCurrentIndex(0);
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPreviewImage(images[currentIndex + 1]);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setPreviewImage(images[currentIndex - 1]);
    }
  };

  const downloadImage = () => {
    if (previewImage) {
      const link = document.createElement('a');
      link.href = previewImage;
      link.download = `image-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!previewImage) return;
      
      switch (e.key) {
        case 'Escape':
          closePreview();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewImage, currentIndex, images.length]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      {/* Thumbnail Gallery */}
      <div className={`space-y-3 ${className}`}>
        {title && (
          <h4 className="text-sm font-black text-gray-700 uppercase tracking-wide">
            {title}
          </h4>
        )}
        
        <div className="flex flex-wrap gap-2">
          {images.map((imgUrl, index) => (
            <div 
              key={index}
              className="relative group cursor-pointer transition-transform hover:scale-105"
              onClick={() => openPreview(imgUrl, index)}
            >
              <div className="relative">
                <img
                  src={preFixImg(imgUrl)}
                  alt={`${title} ${index + 1}`}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200 group-hover:border-indigo-300 transition-all"
                />
                <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn size={16} className="text-white" />
                </div>
              </div>
              
              {/* Image counter badge */}
              <div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[8px] font-black rounded-full w-5 h-5 flex items-center justify-center">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Screen Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={closePreview}
        >
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-white text-lg font-black">
                {title} ({currentIndex + 1}/{images.length})
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadImage();
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  <Download size={16} />
                  <span className="text-sm">Download</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closePreview();
                  }}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Image Container */}
            <div className="flex-1 flex items-center justify-center relative">
              <img
                src={preFixImg(previewImage)}
                alt="Full size preview"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
                    disabled={currentIndex === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    disabled={currentIndex === images.length - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Footer with thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      openPreview(img, index);
                    }}
                    className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 transition-all ${
                      index === currentIndex 
                        ? 'border-white scale-110' 
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={preFixImg(img)}
                      alt={`Thumbnail ${index + 1}`}
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

export default ImagePreview;