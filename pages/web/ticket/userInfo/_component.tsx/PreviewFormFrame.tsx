import { ChevronDown, CircleUserIcon, ClockIcon, UserIcon } from "lucide-react";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CART_ICON_ENUM } from "@/types/product.type";

type Props = {
  title: string;
  iconName: CART_ICON_ENUM;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

const PreviewFormFrame = ({
  title,
  iconName,
  open,
  setOpen,
  children,
}: Props) => {
  return (
    <div
      className={
        "w-full border border-[#E2E8F080]/50 rounded-3xl overflow-hidden"
      }
      style={{
        boxShadow: "0px 10px 15px -3px #0000001A",
      }}
    >
      <div className="flex items-center justify-between px-8 py-4 bg-indigo-100">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-700 w-9 h-9 rounded-[14px] flex items-center justify-center">
            {iconName === CART_ICON_ENUM.USER && (
              <UserIcon className="w-5 h-5 text-white" />
            )}
            {iconName === CART_ICON_ENUM.TIME && (
              <ClockIcon className="w-5 h-5 text-white" />
            )}
            {iconName === CART_ICON_ENUM.GUEST && (
              <CircleUserIcon className="w-5 h-5 text-white" />
            )}
          </div>
          <h5 className="text-[#0F172B] text-base font-medium">{title}</h5>
        </div>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="text-indigo-700 text-sm font-medium cursor-pointer flex items-center gap-2 hover:text-primary transition-all duration-300"
        >
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.span>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PreviewFormFrame;
