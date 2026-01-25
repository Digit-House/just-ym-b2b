import React, { useLayoutEffect, useRef, useCallback, useEffect } from "react";

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

    const resize = useCallback(() => {
      const el = textareaRef.current;
      if (!el) return;

      // Reset height to auto to get the correct scrollHeight
      el.style.height = "auto";
      el.style.overflow = "hidden";

      const height = Math.min(
        Math.max(el.scrollHeight, minHeight),
        maxHeight
      );

      el.style.height = `${height}px`;
      el.style.overflow = "auto";
    }, [minHeight, maxHeight]);

    // Handle all resize scenarios
    useLayoutEffect(() => {
      const el = textareaRef.current;
      if (!el) return;

      // Immediate resize
      resize();

      // Set up observers and listeners
      const observers: MutationObserver[] = [];
      
      // Observe the textarea itself for value changes
      const textareaObserver = new MutationObserver(resize);
      textareaObserver.observe(el, {
        attributes: true,
        attributeFilter: ['value']
      });
      observers.push(textareaObserver);

      // If textarea is in a form, observe the form
      if (el.form) {
        const formObserver = new MutationObserver(resize);
        formObserver.observe(el.form, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['value']
        });
        observers.push(formObserver);
      }

      // Event listeners
      const handleInput = () => resize();
      const handleFocus = () => setTimeout(resize, 0);
      const handleBlur = () => setTimeout(resize, 0);
      
      el.addEventListener('input', handleInput);
      el.addEventListener('focus', handleFocus);
      el.addEventListener('blur', handleBlur);

      // Window events
      const handleResize = () => resize();
      const handlePageShow = () => setTimeout(resize, 100);
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('pageshow', handlePageShow);

      // Additional resize attempts to catch delayed content
      const timer1 = setTimeout(resize, 10);
      const timer2 = setTimeout(resize, 100);
      const timer3 = setTimeout(resize, 500);

      return () => {
        // Cleanup
        observers.forEach(observer => observer.disconnect());
        el.removeEventListener('input', handleInput);
        el.removeEventListener('focus', handleFocus);
        el.removeEventListener('blur', handleBlur);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('pageshow', handlePageShow);
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }, [resize]);

    // Handle prop value changes
    useLayoutEffect(() => {
      resize();
    }, [value, resize]);

    return (
      <textarea
        ref={setRefs}
        value={value}
        className={`${className}`}
        style={{ 
          ...style, 
          minHeight, 
          maxHeight,
          overflow: "auto",
          resize: "vertical"
        }}
        {...props}
      />
    );
  }
);

AutoResizeTextarea.displayName = "AutoResizeTextarea";
export default AutoResizeTextarea;