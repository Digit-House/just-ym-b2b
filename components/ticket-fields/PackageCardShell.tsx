import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * One collapsible package card. `keepMounted` hides the body instead of unmounting it, so unsaved
 * edits survive collapsing; otherwise the body animates in and out.
 */
const PackageCardShell = ({
  index,
  name,
  published,
  badges,
  open,
  onToggle,
  children,
  keepMounted,
  ticketTypeCount,
  hasError,
}: {
  index: number;
  name?: string | null;
  published?: boolean | null;
  badges?: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  keepMounted?: boolean;
  ticketTypeCount: number;
  hasError?: boolean;
}) => {
  const body = "space-y-4 px-6 pb-6 pt-2 border-t";
  return (
    <div className={`rounded-lg border bg-gray-50 ${hasError ? "border-red-300" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-6 py-4 text-left cursor-pointer"
      >
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Package {index + 1}</p>
          <p className="truncate text-base font-semibold text-gray-900">{name || "Untitled package"}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {badges}
          <span className="hidden sm:inline text-xs text-gray-500">
            {ticketTypeCount} ticket type{ticketTypeCount === 1 ? "" : "s"}
          </span>
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-medium ${
              published ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
            }`}
          >
            {published ? "Published" : "Unpublished"}
          </span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      {keepMounted ? (
        <div className={`${body} ${open ? "" : "hidden"}`}>{children}</div>
      ) : (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="package-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className={body}>{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default PackageCardShell;
