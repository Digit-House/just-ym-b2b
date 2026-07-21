import { RotateCcw } from "lucide-react";
import MultiSelect from "@/components/MultiSelect";
import SortSelect, { SortOption } from "@/components/SortSelect";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { HotelSearchState, HotelSortBy } from "@/types/hotel.type";

const STAR_RATING_OPTIONS = [5, 4, 3, 2, 1].map((n) => ({
  id: String(n),
  name: `${n} Star${n > 1 ? "s" : ""}`,
}));

const MEAL_TYPE_OPTIONS = [
  { id: "nomeal", name: "Room Only" },
  { id: "breakfast", name: "Breakfast Included" },
  { id: "half-board", name: "Half Board" },
  { id: "full-board", name: "Full Board" },
  { id: "all-inclusive", name: "All Inclusive" },
];

const SORT_OPTIONS: SortOption[] = [
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Star Rating: Low to High", value: "star_rating_asc" },
  { label: "Star Rating: High to Low", value: "star_rating_desc" },
];

type Props = {
  search: HotelSearchState;
  setSearch: React.Dispatch<React.SetStateAction<HotelSearchState>>;
  onReset: () => void;
  showReset: boolean;
};

const HotelFilters = ({ search, setSearch, onReset, showReset }: Props) => {
  return (
    <div className="flex flex-col gap-4 mt-3 mb-6 border p-4 bg-white rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <MultiSelect
          label="Star Rating"
          placeholder="Star Rating"
          options={STAR_RATING_OPTIONS}
          value={search.starRating}
          onChange={(v) => setSearch((s) => ({ ...s, starRating: v }))}
          width="w-full"
        />

        <MultiSelect
          label="Meal Type"
          placeholder="Meal Type"
          options={MEAL_TYPE_OPTIONS}
          value={search.mealType}
          onChange={(v) => setSearch((s) => ({ ...s, mealType: v }))}
          width="w-full"
        />

        <div className="flex-1 flex items-center gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Min price"
            value={search.priceFrom ?? ""}
            onChange={(e) =>
              setSearch((s) => ({
                ...s,
                priceFrom: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
          />
          <span className="text-gray-400">-</span>
          <Input
            type="number"
            min={0}
            placeholder="Max price"
            value={search.priceTo ?? ""}
            onChange={(e) =>
              setSearch((s) => ({
                ...s,
                priceTo: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 w-full border-t border-gray-100 pt-4 md:border-none md:pt-0">
        <label className="flex items-center gap-2 cursor-pointer">
          <Switch
            checked={search.freeCancellationOnly}
            onCheckedChange={(checked) =>
              setSearch((s) => ({ ...s, freeCancellationOnly: checked }))
            }
          />
          <span className="text-sm text-gray-600">Free cancellation only</span>
        </label>

        <SortSelect
          value={search.sort}
          options={SORT_OPTIONS}
          onChange={(v) => setSearch((s) => ({ ...s, sort: v as HotelSortBy }))}
        />

        {showReset && (
          <button
            onClick={onReset}
            title="Reset filters"
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          >
            <RotateCcw size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default HotelFilters;
