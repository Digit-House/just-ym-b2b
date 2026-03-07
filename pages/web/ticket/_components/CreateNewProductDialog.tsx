import { useState} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ProductT } from "@/types/product.type";
import {
    createNewProduct,
} from "@/graphql/product";
import { getErrMsg} from "@/util/initData";
import ModalWrapper from "@/components/ModalWrapper";
import InputField from "@/components/InputField";
import { toast } from "sonner";

// Zod schema
const schema = z.object({
  ticketId: z
    .string()
    .min(1, "Ticket ID is required")
    .min(3, "Ticket ID must be at least 3 characters"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateNewProductDialog = ({ open, onOpenChange }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors,isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ticketId: "",
    },
  });


  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      await createNewProduct(data.ticketId);
      toast.success("Ticket successfully created !");
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrMsg(error, "message"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const footer = (
    <div className="flex justify-end space-x-3 pt-4">
      <Button
        variant="outline"
        onClick={() => onOpenChange(false)}
        disabled={isSubmitting}
      >
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
      onClose={() => onOpenChange(false)}
      footer={footer}
      width="lg"
    >
      <div className="py-4 space-y-4">
        <InputField
          label="Ticket ID"
          placeholder="Enter ticket ID"
          {...register("ticketId")}
          errMsg={errors.ticketId?.message}
          isRequired
        />

      </div>
    </ModalWrapper>
  );
};

export default CreateNewProductDialog;