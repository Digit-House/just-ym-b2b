import { ComponentProps } from 'react';

interface NotFoundProps extends ComponentProps<'div'> {
  message?: string;
  icon?: React.ReactNode;
  showIcon?: boolean;
}

const NotFoundComponent = ({
  message = 'No data found',
  icon,
  showIcon = true,
  className = '',
  ...props
}: NotFoundProps) => {
  const defaultIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-16 h-16 mx-auto text-gray-400 mb-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.143 17.082A23.848 23.848 0 0012 18c2.884 0 5.625-.826 8.049-2.344M3.25 6.25c-.621 0-1.125.504-1.125 1.125v8.25c0 .621.504 1.125 1.125 1.125h17.5c.621 0 1.125-.504 1.125-1.125V7.375c0-.621-.504-1.125-1.125-1.125H3.25z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-1.943 5.574a1.5 1.5 0 01-2.121 0l-.818-.818a1.5 1.5 0 010-2.121l1.06-1.06a1.5 1.5 0 012.12 0l.818.818a1.5 1.5 0 010 2.121l-1.06 1.06zM12 12.75a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
      />
    </svg>
  );

  return (
    <div 
      className={`flex flex-col items-center justify-center p-10 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200 ${className}`}
      {...props}
    >
      {showIcon && (icon || defaultIcon)}
      <p className="text-lg text-gray-500 font-medium">{message}</p>
    </div>
  );
};

export default NotFoundComponent;