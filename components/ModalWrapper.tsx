"use client";

import React from "react";
import * as Icons from "lucide-react";
import { Outlet } from "react-router-dom";

type Props = {
  title?: string;
  children:React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
  width?: "sm" | "md" | "lg";
};

export default function ModalWrapper({
  title,
  children,
  onClose,
  footer,
  width = "md",
}: Props) {
  const modalWidth =
    width === "sm"
      ? "max-w-sm"
      : width === "lg"
      ? "max-w-3xl"
      : "max-w-xl";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div
        className={`bg-white w-full ${modalWidth} rounded-2xl shadow-xl overflow-hidden animate-fadeIn`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <button
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            onClick={onClose}
          >
            <Icons.X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>

        {/* FOOTER */}
        {footer && (
          <div className="px-6 py-4 border-t bg-slate-50">{footer}</div>
        )}
      </div>
    </div>
  );
}
