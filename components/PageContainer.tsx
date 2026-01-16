import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
};

const PageContainer = ({ className = "", children }: Props) => {
  return (
    <div
      className={cn(
        "w-full  mx-auto animate-in fade-in duration-500 pt-10",
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageContainer;
