import React, { useEffect, useRef, useState } from 'react';

interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minHeight?: number;
  maxHeight?: number;
}

const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
  ({ minHeight = 40, maxHeight = 200, value, onChange, className = '', style, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [textareaHeight, setTextareaHeight] = useState(minHeight);

    const syncHeight = () => {
      if (!textareaRef.current) return;
      
      const textarea = textareaRef.current;
      // Reset height to auto to calculate the correct scrollHeight
      textarea.style.height = 'auto';
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight || Infinity);
      setTextareaHeight(newHeight);
    };

    useEffect(() => {
      syncHeight();
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e);
      }
    };

    const combinedClassName = `resize-none overflow-hidden ${className}`;

    return (
      <textarea
        ref={ref ? (instance) => {
          if (typeof ref === 'function') {
            ref(instance);
          } else if (ref) {
            ref.current = instance;
          }
          // Also assign to our internal ref
          if (textareaRef && instance) {
            textareaRef.current = instance;
          }
        } : textareaRef}
        value={value}
        onChange={handleChange}
        style={{ ...style, height: `${textareaHeight}px` }}
        className={combinedClassName}
        {...props}
      />
    );
  }
);

AutoResizeTextarea.displayName = 'AutoResizeTextarea';

export default AutoResizeTextarea;