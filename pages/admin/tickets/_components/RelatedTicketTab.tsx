import { ProductInfoT, UpdateProductPayloadT } from "@/types/product.type";
import { TicketFormValues } from "@/types/schema/ticketSchema";
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";

type Props = {
  control: Control<TicketFormValues>;
  errors: FieldErrors<TicketFormValues>;
  watch: any;
  getValues: UseFormGetValues<TicketFormValues>;
  setValue: UseFormSetValue<TicketFormValues>;
  trigger: UseFormTrigger<TicketFormValues>;
  mode: "create" | "edit";
  initialValues?: UpdateProductPayloadT | ProductInfoT;
};

const RelatedTicketTab = ({
  control,
  errors,
  watch,
  getValues,
  setValue,
  trigger,
  mode,
  initialValues,
}: Props) => {
  return <div>RelatedTicketTab</div>;
};

export default RelatedTicketTab;
