import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { CountrySelect } from "./ui/phone-input";

type Props = {
  required?: boolean;
  label: string;
  name: string;
  disable?: boolean;
};

const Input = () => {
  return <div>Input</div>;
};

const PhoneNumberInput = ({
  required = false,
  label,
  name,
  disable = false,
}: Props) => {
  const { control, setValue } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex gap-x-1">
            <p className="text-sm">{label}</p>
            {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <PhoneInput
              {...field}
              international
              disabled={disable}
              defaultCountry="MM"
              withCountryCallingCode
              countryCallingCodeEditable={false}
              countrySelectComponent={CountrySelect}
              onChange={(value) => field.onChange(value ?? "")}
              className={`
    h-[44px] w-full rounded-md border border-[#D0D5DD] bg-transparent shadow-xs
    ${disable ? "bg-[#D1D9E633]/20 cursor-not-allowed opacity-50" : ""}
  `}
              inputClassName={`
    w-full h-full bg-transparent outline-none ring-0 border-0
    focus:outline-none focus:ring-0 focus:border-0
  `}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhoneNumberInput;
