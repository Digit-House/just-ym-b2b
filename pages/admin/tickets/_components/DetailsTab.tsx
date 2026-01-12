import React, { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { TicketFormValues } from "@/types/schema/ticketSchema";
import { ProductInfoT, UpdateProductPayloadT } from "@/types/product.type";
import TextareaField from "@/components/TextareaField";
import InputField from "@/components/InputField";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, NotebookIcon } from "lucide-react";

type DetailsTabProps = {
  control: Control<TicketFormValues>;
  errors: FieldErrors<TicketFormValues>;
  watch: any;
  setValue: any;
  mode: "create" | "edit";
  initialValues?: UpdateProductPayloadT;
};

const DetailsTab: React.FC<DetailsTabProps> = ({
  control,
  errors,
  initialValues,
}) => {
  // State for dynamic arrays
  const [exclusions, setExclusions] = useState<string[]>(
    initialValues?.exclusions ?? []
  );
  const [highlights, setHighlights] = useState<string[]>(
    initialValues?.highlights ?? []
  );
  const [howToUseList, setHowToUseList] = useState<string[]>(
    initialValues?.howToUseList ?? []
  );
  const [inclusions, setInclusions] = useState<string[]>(
    initialValues?.inclusions ?? []
  );
  const [thingsToNote, setThingsToNote] = useState<string[]>(
    initialValues?.thingsToNote ?? []
  );
  const [blockedDates, setBlockedDates] = useState(
    initialValues?.blockedDate ?? []
  );

  // Array management functions
  const addToArray = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string = ""
  ) => {
    setter((prev) => [...prev, value]);
  };

  const removeFromArray = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const updateArrayValue = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const addBlockedDate = () => {
    setBlockedDates((prev) => [...prev, { date: "", title: "" }]);
  };

  const removeBlockedDate = (index: number) => {
    setBlockedDates((prev) => prev.filter((_, i) => i !== index));
  };

  const updateBlockedDate = (
    index: number,
    field: keyof (typeof blockedDates)[0],
    value: string
  ) => {
    setBlockedDates((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-indigo-600"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Detailed Information
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Provide comprehensive details about the ticket
        </p>
      </div>

      <div className="space-y-6">
        <div
          className={`space-y-3 ${
            errors.description
              ? "border border-red-300 rounded-lg p-3 bg-red-50"
              : ""
          }`}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextareaField
                label="Description"
                rows={5}
                {...field}
                errMsg={errors.description?.message}
                placeholder="Enter a detailed description of the ticket..."
              />
            )}
          />
        </div>

        <div
          className={`space-y-3 ${
            errors.whatToExpect
              ? "border border-red-300 rounded-lg p-3 bg-red-50"
              : ""
          }`}
        >
          <Controller
            name="whatToExpect"
            control={control}
            render={({ field }) => (
              <TextareaField
                label="What To Expect"
                rows={5}
                {...field}
                errMsg={errors.whatToExpect?.message}
                placeholder="Describe what customers can expect from this ticket..."
              />
            )}
          />
        </div>

        <div
          className={`space-y-3 ${
            errors.termsAndConditions
              ? "border border-red-300 rounded-lg p-3 bg-red-50"
              : ""
          }`}
        >
          <Controller
            name="termsAndConditions"
            control={control}
            render={({ field }) => (
              <TextareaField
                label="Terms & Conditions"
                rows={5}
                {...field}
                errMsg={errors.termsAndConditions?.message}
                placeholder="Enter terms and conditions for this ticket..."
              />
            )}
          />
        </div>
      </div>

      <div className="border-t pt-6 space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <NotebookIcon className="h-5 w-5 text-green-500" />
              <h4 className="text-lg font-medium">Highlights</h4>
            </div>
            <Button
              type="button"
              onClick={() => addToArray(setHighlights)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Highlight
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-center py-3 rounded-lg w-full"
              >
                <InputField
                  value={highlight}
                  onChange={(e) =>
                    updateArrayValue(setHighlights, index, e.target.value)
                  }
                  placeholder="Enter highlight"
                  className="w-full rounded-md "
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromArray(setHighlights, index)}
                  className="text-red-500  hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <NotebookIcon className="h-5 w-5 text-green-500" />
              <h4 className="text-lg font-medium">How To Use</h4>
            </div>
            <Button
              type="button"
              onClick={() => addToArray(setHowToUseList)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Instruction
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {howToUseList.map((item, index) => (
              <div
                key={index}
                className="flex items-center py-3 rounded-lg w-full"
              >
                <InputField
                  value={item}
                  onChange={(e) =>
                    updateArrayValue(
                      setHowToUseList,
                      index,
                      e.target.value
                    )
                  }
                  placeholder="Enter instruction"
                  className="w-full rounded-md"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromArray(setHowToUseList, index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <NotebookIcon className="h-5 w-5 text-green-500" />
              <h4 className="text-lg font-medium">Inclusions</h4>
            </div>
            <Button
              type="button"
              onClick={() => addToArray(setInclusions)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Inclusion
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {inclusions.map((inclusion, index) => (
              <div
                key={index}
                className="flex items-center py-3 rounded-lg w-full"
              >
                <InputField
                  value={inclusion}
                  onChange={(e) =>
                    updateArrayValue(setInclusions, index, e.target.value)
                  }
                  placeholder="Enter inclusion"
                  className="w-full rounded-md"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromArray(setInclusions, index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <NotebookIcon className="h-5 w-5 text-green-500" />
              <h4 className="text-lg font-medium">Exclusions</h4>
            </div>
            <Button
              type="button"
              onClick={() => addToArray(setExclusions)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Exclusion
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {exclusions.map((exclusion, index) => (
              <div
                key={index}
                className="flex items-center py-3 rounded-lg w-full"
              >
                <InputField
                  value={exclusion}
                  onChange={(e) =>
                    updateArrayValue(setExclusions, index, e.target.value)
                  }
                  placeholder="Enter exclusion"
                  className="w-full rounded-md"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromArray(setExclusions, index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <NotebookIcon className="h-5 w-5 text-green-500" />
              <h4 className="text-lg font-medium">Things To Note</h4>
            </div>
            <Button
              type="button"
              onClick={() => addToArray(setThingsToNote)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Note
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {thingsToNote.map((note, index) => (
              <div
                key={index}
                className="flex items-center py-3 rounded-lg w-full"
              >
                <InputField
                  value={note}
                  onChange={(e) =>
                    updateArrayValue(
                      setThingsToNote,
                      index,
                      e.target.value
                    )
                  }
                  placeholder="Enter note"
                  className="w-full rounded-md"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromArray(setThingsToNote, index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-orange-500"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <h4 className="text-lg font-medium">Blocked Dates</h4>
            </div>
            <Button type="button" onClick={addBlockedDate} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Date
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {blockedDates.map((date, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border grid grid-cols-1 md:grid-cols-2 gap-4 ${
                  errors.blockedDate?.[index]
                    ? "bg-red-50 border-red-300"
                    : ""
                }`}
              >
                <div
                  className={`${
                    errors.blockedDate?.[index]?.date
                      ? "border border-red-300 rounded-lg p-2 bg-red-50"
                      : ""
                  }`}
                >
                  <InputField
                    label="Date"
                    type="datetime-local"
                    value={date.date}
                    onChange={(e) =>
                      updateBlockedDate(index, "date", e.target.value)
                    }
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                <div className="flex gap-3">
                  <div
                    className={`${
                      errors.blockedDate?.[index]?.title
                        ? "border border-red-300 rounded-lg p-2 bg-red-50"
                        : ""
                    }`}
                  >
                    <InputField
                      label="Title"
                      value={date.title}
                      onChange={(e) =>
                        updateBlockedDate(index, "title", e.target.value)
                      }
                      placeholder="Event title"
                      className="grow"
                    />
                  </div>
                  <div className="flex items-end pb-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBlockedDate(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;