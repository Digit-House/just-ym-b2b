import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <div>
      <input
        spellCheck={true}
        style={{
          boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        }}
        type={type}
        className={cn(
          ' px-[14px] py-[10px] border border-gray-300 text-lg w-full focus:outline-none rounded-[8px] mt-[6px] font-texta font-medium',
          className,
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
Input.displayName = 'Input';

export { Input };
