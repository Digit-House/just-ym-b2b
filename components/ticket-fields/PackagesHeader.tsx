import { Button } from "@/components/ui/button";

/** "Packages" title with Expand all / Collapse all (shown for 2+ packages, hidden when read-only). */
const PackagesHeader = ({
  count,
  onExpandAll,
  onCollapseAll,
  hidden,
}: {
  count: number;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  hidden?: boolean;
}) => (
  <div className="flex justify-between items-center">
    <h4 className="text-lg font-medium">Packages</h4>
    {count > 1 && !hidden && (
      <div className="flex items-center gap-1">
        <Button type="button" variant="ghost" size="sm" onClick={onExpandAll}>
          Expand all
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCollapseAll}>
          Collapse all
        </Button>
      </div>
    )}
  </div>
);

export default PackagesHeader;
