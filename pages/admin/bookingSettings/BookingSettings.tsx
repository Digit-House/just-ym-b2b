import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import MascotLoader from "@/components/MascotLoader";
import {
  getBookingSettings,
  updateBookingSettings,
} from "@/graphql/bookingSettings";

const QUERY_KEY = ["booking-settings"];

const BookingSettings = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getBookingSettings,
    retry: 1,
  });

  const [block, setBlock] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setBlock(data.blockMixedManualCart);
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateBookingSettings(block);
      queryClient.setQueryData(QUERY_KEY, res);
      toast.success("Booking settings updated.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update booking settings",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Booking Settings"
        des="Choose how checkout handles special carts."
      />

      {isLoading && (
        <MascotLoader label="Loading booking settings..." className="h-64" />
      )}

      {isError && (
        <div className="flex justify-center items-center h-64 text-red-500">
          <p>
            Error loading booking settings:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      )}

      {data && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-xl space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="blockMixedManualCart">Block mixed carts</Label>
              <p className="text-xs text-gray-500">
                On: checkout refuses a cart that has the manual-booking ticket
                plus other tickets. Off: the whole booking is held, and you book
                every ticket by hand.
              </p>
            </div>
            <Switch
              id="blockMixedManualCart"
              checked={block}
              onCheckedChange={setBlock}
            />
          </div>
          <div className="flex justify-end">
            <Button loading={saving} disabled={saving} onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default BookingSettings;
