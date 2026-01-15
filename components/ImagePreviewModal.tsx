import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ImagePreviewModalProps {
  imageUrl: string | null;
  fileName: string;
  fileSize: number;
  onClose: () => void;
}

const ImagePreviewModal = ({ 
  imageUrl, 
  fileName, 
  fileSize, 
  onClose 
}: ImagePreviewModalProps) => {
  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (imageUrl) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh] w-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors p-2"
        >
          <X size={32} />
        </button>
        
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 truncate">{fileName}</h3>
            <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
              {(fileSize / 1024).toFixed(2)} KB
            </span>
          </div>
          
          <img
            src={imageUrl}
            alt="Payment proof preview"
            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;