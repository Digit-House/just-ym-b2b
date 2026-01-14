import { CheckIcon, ChevronDown, LockKeyhole } from "lucide-react";

import * as React from "react";

import * as RPNInput from "react-phone-number-input";

import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input, type InputProps } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import "react-phone-number-input/style.css";

import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
    onCountryChange?: (country: RPNInput.Country) => void;
    id: string;
    label: string;
    errMsg?: string;
    isRequired?: boolean;
    isDisabled?:boolean;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    (
      {
        className,
        onChange,
        onCountryChange,
        id,
        label,
        isRequired,
        isDisabled,
        errMsg,
        ...props
      },
      ref
    ) => {
      return (
        <div className="flex flex-col gap-2">
          {label && (
            <label
              htmlFor={id}
              className="flex items-center gap-1 text-sm font-medium"
            >
              {label}

              {isRequired &&
                (isDisabled ? (
                  <LockKeyhole size={12} className="text-red-500 mb-[1px]" />
                ) : (
                  <span className="text-red-500">*</span>
                ))}
            </label>
          )}

          <RPNInput.default
            ref={ref}
            className={cn("flex text-xs!", className)}
            flagComponent={FlagComponent}
            countrySelectComponent={CountrySelect}
            inputComponent={InputComponent}
            international={true}
            onCountryChange={(country) => {
              onCountryChange?.(RPNInput.getCountryCallingCode(country || ""));
            }}
            onChange={(value: any) => onChange?.(value || "")}
            {...props}
          />
          {errMsg && <p className="text-red-500 text-sm">{errMsg}</p>}
        </div>
      );
    }
  );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      style={{
        boxShadow: "none",
        marginTop: "0",
      }}
      className={cn(
        "rounded-e-lg rounded-s-none mt-0 border-none text-sm",
        className
      )}
      {...props}
      ref={ref}
    />
  )
);
InputComponent.displayName = "InputComponent";

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
};

const CountrySelect = ({
  disabled = false,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange]
  );

  // const selectedCallingCode = value
  //   ? RPNInput.getCountryCallingCode(value)
  //   : "95";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "flex items-center gap-1 rounded-e-none rounded-s-lg px-3 border-none"
          )}
          disabled={disabled}
        >
          {/* Flag */}
          {value && <FlagComponent country={value} countryName={value} />}
          {/* Icon */}
          <ChevronDown
            className={cn(
              "-mr-1 h-4 w-4 opacity-50",
              disabled ? "hidden" : "opacity-100"
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>

              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label.toLocaleLowerCase()}
                    className="gap-2"
                    onSelect={() => handleSelect(option.value)}
                  >
                    <FlagComponent
                      country={option.value}
                      countryName={option.label}
                    />
                    <span className="flex-1 text-sm">{option.label}</span>
                    {option.value === value && (
                      <CheckIcon className="ml-auto h-4 w-4 opacity-100" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = "FlagComponent";

export { PhoneInput };
