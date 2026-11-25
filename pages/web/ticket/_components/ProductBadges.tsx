import { cn } from "@/lib/utils";

const chip =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold";

// OWNER-only: callers gate on user?.type === "OWNER".
const ProductBadges = ({
  product,
  className,
}: {
  product: { isPinned?: boolean | null; isManualFulfilment?: boolean | null };
  className?: string;
}) => {
  if (!product.isPinned && !product.isManualFulfilment) return null;
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {product.isPinned && (
        <span className={cn(chip, "bg-blue-50 text-blue-700 border-blue-200")}>
          Pinned
        </span>
      )}
      {product.isManualFulfilment && (
        <span
          className={cn(chip, "bg-amber-50 text-amber-700 border-amber-200")}
        >
          Manual booking
        </span>
      )}
    </div>
  );
};

export default ProductBadges;
