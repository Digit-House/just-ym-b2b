import React, { useState } from 'react';

interface ImageFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onClick?:(value:string) => void;
}

const ImageFallback: React.FC<ImageFallbackProps> = ({
  src,
  alt,
  className,
  fallbackSrc = 'https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg',
  onClick
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onClick={() => {
        if(onClick){
          onClick(fallbackSrc);
        }
      }}
      onLoad={() => setHasError(false)} // Reset error state when image loads successfully
    />
  );
};

export default ImageFallback;