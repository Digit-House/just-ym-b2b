import React from "react";
import { ProductT } from "@/types/product.type";
import { Checkbox } from "@/components/ui/checkbox";
import ImageFallback from "@/components/ImageFallback";
import { preFixImg } from "@/util/initData";
import { truncateDescription } from "@/lib/utils";

interface RelatedTicketCardProps {
  product: ProductT | any; // Using any to accommodate both ProductT and form values
  isSelected?: boolean;
  onToggle?: () => void;
  showCheckbox?: boolean;
  onProductIdChange?: (productId: string) => void;
  onLinkBackChange?: (linkBack: boolean) => void;
  productId?: string;
  linkBack?: boolean;
  isDisabled?: boolean;
}

const RelatedTicketCard: React.FC<RelatedTicketCardProps> = ({
  product,
  isSelected = false,
  onToggle,
  showCheckbox = false,
  onProductIdChange,
  onLinkBackChange,
  productId,
  linkBack,
  isDisabled = false,
}) => {
  const handleProductIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onProductIdChange?.(e.target.value);
  };

  const handleLinkBackChange = (checked: boolean) => {
    onLinkBackChange?.(checked);
  };

  return (
    <div className={`rounded-lg border overflow-hidden shadow-sm transition-shadow ${isDisabled ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:shadow-md'} ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      <div className="relative">
        {showCheckbox && (
          <div className="absolute top-3 left-3 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={isDisabled ? undefined : onToggle}
              className="h-5 w-5"
              disabled={isDisabled}
            />
          </div>
        )}
        <div className="h-40 overflow-hidden">
          <ImageFallback
            src={preFixImg(product?.image)}
            alt={product?.name}
            className={`w-full h-full object-cover transition-transform duration-300 ${isDisabled ? '' : 'hover:scale-105'}`}
          />
        </div>
      </div>

      <div className="p-4">
        <h3 className={`font-semibold line-clamp-1 mb-1 ${isDisabled ? 'text-gray-500' : 'text-gray-800'}`}>
          {product?.name}
        </h3>
        
        <p className={`text-sm line-clamp-2 mb-3 ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
          {truncateDescription(product.description || "-----",20)}
        </p>

        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${isDisabled ? 'text-gray-400' : 'text-indigo-600'}`}>
            {product?.originalPrice !== undefined 
              ? `THB ${product?.originalPrice?.toLocaleString()}` 
              : ''}
          </span>
          
          {onProductIdChange && (
            <input
              type="text"
              value={productId || product?.id || ""}
              onChange={handleProductIdChange}
              className="text-xs border border-gray-300 rounded px-2 py-1 w-20"
              placeholder="ID"
            />
          )}
        </div>

        {onLinkBackChange !== undefined && (
          <div className="mt-3 flex items-center">
            <Checkbox
              id={`linkBack-${product?.id}`}
              checked={linkBack}
              onCheckedChange={isDisabled ? undefined : handleLinkBackChange}
              className="mr-2"
              disabled={isDisabled}
            />
            <label 
              htmlFor={`linkBack-${product?.id}`} 
              className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-700'}`}
            >
              Link Back
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedTicketCard;