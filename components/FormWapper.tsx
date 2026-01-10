"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  required?: boolean;
  label: string;
  type?: string;
  name: string;
  placeholder: string;
  maxLength?: number;
  dissabled?: boolean;
  textArea?: boolean;
};

const FormWapper = ({
  required,
  label,
  type,
  name,
  placeholder,
  maxLength,
  dissabled = false,
  textArea = false,
}: Props) => {
  const { control, setValue } = useFormContext();
  const [isVissable, setIsVissable] = React.useState(false);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex gap-x-1" htmlFor={name}>
            <p className="text-sm">{label}</p>
            {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            {textArea ? (
              <div className="relative">
                <Textarea
                  id={name}
                  {...field}
                  className="min-h-[120px] shadow-xs border-[#D0D5DD] border rounded-md"
                  disabled={dissabled}
                />
              </div>
            ) : (
              <div className="relative ">
                <Input
                  id={name}
                  placeholder={placeholder}
                  disabled={dissabled}
                  type={
                    type === "password" && !isVissable ? "password" : "text"
                  }
                  {...field}
                  // typeOf={type}
                  maxLength={maxLength}
                  onChange={(e) => {
                    const text: string = e.target.value;
                    setValue(name, text);
                    field.onChange(e);
                  }}
                />
                {type === "password" && (
                  <button
                    type="button"
                    onClick={() => setIsVissable(!isVissable)}
                    className=" cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-[#514E4E] hover:text-primary transition-all duration-300"
                  >
                    {isVissable ? <Eye /> : <EyeOff />}
                  </button>
                )}
              </div>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormWapper;
