import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { createNewProduct } from "@/graphql/product";
import { getErrMsg } from "@/util/initData";
import ModalWrapper from "@/components/ModalWrapper";
import InputField from "@/components/InputField";
import { toast } from "sonner";

// ✅ Zod schema (string-based)
const schema = z.object({
  ticketId: z
    .string()
    .min(1, "Ticket ID is required")
    .min(3, "Ticket ID must be at least 3 characters")
    .regex(/^\d+$/, "Ticket ID must contain only numbers"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onOpenChange: (open: boolean) => void;
}

const CreateNewProductDialog = ({ onOpenChange }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ticketId: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      // ✅ convert to number for API
      await createNewProduct(Number(data.ticketId));

      toast.success("Ticket successfully created !");
      onOpenChange(false);
      reset(); // clear form after success
    } catch (error) {
      toast.error(getErrMsg(error, "message"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    reset(); // reset when closing
  };

  const footer = (
    <div className="flex justify-end space-x-3 pt-4">
      <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting || !isDirty}
      >
        {isSubmitting ? "Saving..." : "Save Order"}
      </Button>
    </div>
  );

  return (
    <ModalWrapper
      title="Sort Recommended Tickets"
      onClose={handleClose}
      footer={footer}
      width="lg"
    >
      <div className="py-4 space-y-4">
        <InputField
          label="Ticket ID"
          placeholder="Enter ticket ID"
          inputMode="numeric"
          {...register("ticketId")}
          errMsg={errors.ticketId?.message}
          isRequired
        />
      </div>
    </ModalWrapper>
  );
};

export default CreateNewProductDialog;
