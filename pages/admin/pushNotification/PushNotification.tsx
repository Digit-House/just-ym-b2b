import { useState } from "react";
import { toast } from "sonner";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sendBroadcastNotification } from "@/graphql/pushNotification";

const SCREENS = [
  "HOME",
  "TICKET_DETAIL",
  "HOTEL_DETAIL",
  "BOOKINGS",
  "BOOKING_DETAIL",
  "HOTEL_BOOKING_DETAIL",
  "NOTIFICATIONS",
  "VOUCHERS",
];
const DEFAULT_SCREEN = "DEFAULT";
const TITLE_MAX = 100;
const BODY_MAX = 500;
const URL_MAX = 2000;

const parseUserIds = (raw: string) =>
  Array.from(
    new Set(
      raw
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean)
    )
  );

const PushNotification = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [screen, setScreen] = useState(DEFAULT_SCREEN);
  const [productId, setProductId] = useState("");
  const [hotelId, setHotelId] = useState("");
  const [url, setUrl] = useState("");
  const [userIdsRaw, setUserIdsRaw] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [sending, setSending] = useState(false);

  const userIds = parseUserIds(userIdsRaw);
  const audience =
    userIds.length > 0
      ? `${userIds.length} user${userIds.length === 1 ? "" : "s"}`
      : "all users";
  const canSubmit = title.trim() !== "" && body.trim() !== "" && !sending;

  const handleSend = async () => {
    setSending(true);
    try {
      const res = await sendBroadcastNotification({
        title: title.trim(),
        body: body.trim(),
        screen: screen === DEFAULT_SCREEN ? undefined : screen,
        productId: productId.trim() || undefined,
        hotelId: hotelId.trim() || undefined,
        url: url.trim() || undefined,
        userIds: userIds.length > 0 ? userIds : undefined,
      });
      const count = res.data?.sendBroadcastNotification?.targetCount ?? 0;
      toast.success(`Notification queued for ${count} user${count === 1 ? "" : "s"}`);
      setShowConfirm(false);
      setTitle("");
      setBody("");
      setScreen(DEFAULT_SCREEN);
      setProductId("");
      setHotelId("");
      setUrl("");
      setUserIdsRaw("");
    } catch (error) {
      toast.error("Failed to send notification");
      console.error("Error sending notification:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Push Notifications"
        des="Send a push notification to app users."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">
              Title <span className="text-red-600">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              maxLength={TITLE_MAX}
              onChange={(e) => setTitle(e.target.value)}
              disabled={sending}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="body">
              Body <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id="body"
              value={body}
              maxLength={BODY_MAX}
              onChange={(e) => setBody(e.target.value)}
              disabled={sending}
            />
            <p className="text-xs text-gray-500">
              {body.length}/{BODY_MAX}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Screen (optional)</Label>
            <Select value={screen} onValueChange={setScreen} disabled={sending}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DEFAULT_SCREEN}>Default (HOME)</SelectItem>
                {SCREENS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="productId">Product ID (optional)</Label>
              <Input
                id="productId"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                disabled={sending}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="hotelId">Hotel ID (optional)</Label>
              <Input
                id="hotelId"
                value={hotelId}
                onChange={(e) => setHotelId(e.target.value)}
                disabled={sending}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="url">URL (optional)</Label>
            <Input
              id="url"
              value={url}
              maxLength={URL_MAX}
              onChange={(e) => setUrl(e.target.value)}
              disabled={sending}
            />
          </div>

          <div className="text-sm p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Where the notification opens</h3>
            <p className="text-gray-600">
              A Product ID opens TICKET_DETAIL and a Hotel ID opens
              HOTEL_DETAIL. Otherwise the selected screen opens (HOME if none
              is chosen).
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="userIds">User IDs (optional)</Label>
            <Textarea
              id="userIds"
              value={userIdsRaw}
              onChange={(e) => setUserIdsRaw(e.target.value)}
              placeholder="Separate with commas or new lines"
              disabled={sending}
            />
            <p className="text-xs text-gray-500">
              Leave empty to send to all users. Currently targeting: {audience}.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={() => setShowConfirm(true)}
              disabled={!canSubmit}
              loading={sending}
            >
              Send Notification
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showConfirm} onOpenChange={(o) => !sending && setShowConfirm(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send notification?</DialogTitle>
            <DialogDescription>
              This will send "{title.trim()}" to {audience}. This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button onClick={handleSend} loading={sending} disabled={sending}>
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default PushNotification;
