import React, { useLayoutEffect, useRef } from "react";

interface AutoResizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minHeight?: number;
  maxHeight?: number;
}

const AutoResizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextareaProps
>(
  (
    {
      minHeight = 40,
      maxHeight = 200,
      value,
      className = "",
      style,
      ...props
    },
    forwardedRef
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const setRefs = (el: HTMLTextAreaElement | null) => {
      textareaRef.current = el;
      if (typeof forwardedRef === "function") {
        forwardedRef(el);
      } else if (forwardedRef) {
        forwardedRef.current = el;
      }
    };

    const resize = () => {
      const el = textareaRef.current;
      if (!el) return;

      el.style.height = "auto";

      const height = Math.min(
        Math.max(el.scrollHeight, minHeight),
        maxHeight
      );

      el.style.height = `${height}px`;
    };

    // ✅ FIX: runs after DOM layout, before paint
    useLayoutEffect(() => {
      resize();
    }, [value]);

    return (
      <textarea
        ref={setRefs}
        value={value}
        className={`overflow-y-scroll ${className}`}
        style={{ ...style, minHeight, maxHeight }}
        {...props}
      />
    );
  }
);

AutoResizeTextarea.displayName = "AutoResizeTextarea";
export default AutoResizeTextarea;
