import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { ChevronDown } from "lucide-react";

import PreviewFormFrame from "@/pages/web/ticket/userInfo/_component.tsx/PreviewFormFrame";
import { CART_ICON_ENUM } from "@/types/product.type";
import { Form } from "@/components/ui/form";
import FormWapper from "@/components/FormWapper";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useHotelBookingStore } from "@/store/useHotelBookingStore";
import { useUser } from "@/provider/UserProvider";
import { useCartStore } from "@/store/useCartStore";

const ARRIVAL_TIMES = Array.from({ length: 24 }, (_, h) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:00 – ${pad((h + 1) % 24)}:00`;
});

const contactSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .refine((v) => isValidPhoneNumber(v), { message: "Invalid phone number" }),
});
type ContactFormData = z.infer<typeof contactSchema>;

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDone: () => void;
};

const ContactInfoSection = ({ open, setOpen, onDone }: Props) => {
  const { selection, contactInfo, setContactInfo } = useHotelBookingStore();
  const { user } = useUser();
  const { userInfo } = useCartStore();

  const [arrivalTimeOpen, setArrivalTimeOpen] = useState(false);
  const [arrivalTime, setArrivalTime] = useState(
    contactInfo?.arrivalTime ?? "",
  );

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contactInfo?.name ?? userInfo?.name ?? "",
      email: contactInfo?.email ?? userInfo?.email ?? "",
      phone: contactInfo?.phone ?? userInfo?.phone ?? "",
    },
  });

  const onSubmit = (data: ContactFormData) => {
    setContactInfo({
      ...data,
      // No picker here — nationality carries over from the availability bar's residency.
      nationality: selection?.residency ?? "",
      nationalityLabel: selection?.residencyLabel ?? "",
      arrivalTime,
    });
    onDone();
  };

  const inputBase =
    "w-full h-10 bg-white border border-gray-200 rounded-md px-3 text-sm flex items-center justify-between hover:border-gray-300 transition-colors";

  return (
    <PreviewFormFrame
      title="Contact Information"
      iconName={CART_ICON_ENUM.USER}
      open={open}
      setOpen={setOpen}
    >
      <div className="w-full px-8 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormWapper
                  name="name"
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                />
                <FormWapper
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <PhoneNumberInput name="phone" label="Phone Number" required />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex gap-x-1">
                  <p className="text-sm">Arrival Time</p>
                  <span className="text-xs text-gray-400 self-end mb-0.5">
                    (optional)
                  </span>
                </div>
                <Popover
                  open={arrivalTimeOpen}
                  onOpenChange={setArrivalTimeOpen}
                >
                  <PopoverTrigger asChild>
                    <button type="button" className={`${inputBase} md:w-72`}>
                      <span
                        className={
                          arrivalTime
                            ? "text-gray-900"
                            : "text-gray-400 text-sm"
                        }
                      >
                        {arrivalTime || "Select your estimated arrival time"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-1 overflow-y-auto w-72 max-h-52"
                    align="start"
                  >
                    {ARRIVAL_TIMES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className="w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                        onClick={() => {
                          setArrivalTime(t);
                          setArrivalTimeOpen(false);
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex justify-end">
                <Button type="submit" size="lg">
                  Save & Continue
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </PreviewFormFrame>
  );
};

export default ContactInfoSection;
