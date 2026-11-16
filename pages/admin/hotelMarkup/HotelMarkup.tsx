import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getHotelMarkupSetting,
  updateHotelMarkupSetting,
} from "@/graphql/hotelMarkup";

const QUERY_KEY = ["hotel-markup-setting"];

const validate = (percent: string, floor: string) => {
  const errors: { percent?: string; floor?: string } = {};
  const p = Number(percent);
  if (percent.trim() === "" || !Number.isFinite(p)) {
    errors.percent = "Enter a number between 0 and 100.";
  } else if (p < 0 || p > 100) {
    errors.percent = "Markup percent must be between 0 and 100.";
  }
  const f = Number(floor);
  if (floor.trim() === "" || !Number.isFinite(f)) {
    errors.floor = "Enter a whole number of THB (0 or more).";
  } else if (!Number.isInteger(f)) {
    errors.floor = "Floor must be a whole number of THB.";
  } else if (f < 0) {
    errors.floor = "Floor cannot be negative.";
  }
  return errors;
};

const HotelMarkup = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getHotelMarkupSetting,
    retry: 1,
  });

  const [percent, setPercent] = useState("");
  const [floor, setFloor] = useState("");
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setPercent(String(data.percent));
      setFloor(String(data.floorThb));
    }
  }, [data]);

  const errors = validate(percent, floor);
  const hasErrors = !!errors.percent || !!errors.floor;

  const handleSave = async () => {
    setTouched(true);
    setSaved(false);
    setSaveError(null);
    if (hasErrors) return;
    setSaving(true);
    try {
      const res = await updateHotelMarkupSetting(Number(percent), Number(floor));
      queryClient.setQueryData(QUERY_KEY, res);
      setSaved(true);
      toast.success("Hotel markup updated. It applies to new searches only.");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update hotel markup";
      setSaveError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Hotel Markup"
        des="Markup added on top of the supplier price for hotel searches."
      />

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <p>Loading hotel markup...</p>
        </div>
      )}

      {isError && (
        <div className="flex justify-center items-center h-64 text-red-500">
          <p>
            Error loading hotel markup:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      )}

      {data && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-xl">
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="markupPercent">
                Markup percent (%) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="markupPercent"
                type="number"
                step="any"
                min={0}
                max={100}
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
              />
              {touched && errors.percent && (
                <p className="text-xs text-red-500">{errors.percent}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="markupFloor">
                Minimum markup (THB) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="markupFloor"
                type="number"
                step={1}
                min={0}
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              />
              {touched && errors.floor && (
                <p className="text-xs text-red-500">{errors.floor}</p>
              )}
              <p className="text-xs text-gray-500">
                The markup is never lower than this amount.
              </p>
            </div>

            <p className="text-sm text-gray-500">
              Last updated:{" "}
              {data.updatedAt
                ? new Date(data.updatedAt).toLocaleString()
                : "Never (defaults in use)"}
            </p>

            {saveError && <p className="text-sm text-red-500">{saveError}</p>}
            {saved && !saveError && (
              <p className="text-sm text-emerald-600">Saved.</p>
            )}

            <div className="flex justify-end">
              <Button loading={saving} disabled={saving} onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default HotelMarkup;
