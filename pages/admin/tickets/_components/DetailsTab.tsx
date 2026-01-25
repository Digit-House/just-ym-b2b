import React, { useState, useEffect } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { TicketFormValues } from "@/types/schema/ticketSchema";
import { ProductInfoT, UpdateProductPayloadT } from "@/types/product.type";
import TextareaField from "@/components/TextareaField";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, NotebookIcon, FileText, ListTodo } from "lucide-react";

type DetailsTabProps = {
  control: Control<TicketFormValues>;
  errors: FieldErrors<TicketFormValues>;
  watch: any;
  setValue: any;
  mode: "create" | "edit";
  initialValues?: UpdateProductPayloadT | ProductInfoT;
};

const DetailsTab: React.FC<DetailsTabProps> = ({
  control,
  errors,
  setValue,
  initialValues,
}) => {
  // State for dynamic arrays
  const [exclusions, setExclusions] = useState<string[]>(
    (initialValues as UpdateProductPayloadT)?.exclusions ?? []
  );
  const [exclusions_mm, setExclusionsMm] = useState<string[]>(
    (initialValues as UpdateProductPayloadT)?.exclusions_mm ?? []
  );
  const [highlights, setHighlights] = useState<string[]>(
    (initialValues as UpdateProductPayloadT)?.highlights ?? []
  );
  const [highlights_mm, setHighlightsMm] = useState<string[]>(
    (initialValues as UpdateProductPayloadT)?.highlights_mm ?? []
  );
  const [howToUseList, setHowToUseList] = useState<string[]>(
    (initialValues as UpdateProductPayloadT)?.howToUseList ?? []
  );
  const [howToUseList_mm, setHowToUseListMm] = useState<string[]>(
    (initialValues as UpdateProductPayloadT)?.howToUseList_mm ?? []
  );
  const [inclusions, setInclusions] = useState<string[]>(
    (initialValues as UpdateProductPayloadT)?.inclusions ?? []
  );
  const [inclusions_mm, setInclusionsMm] = useState<string[]>(
    (initialValues as UpdateProductPayloadT)?.inclusions_mm ?? []
  );
  const [thingsToNote, setThingsToNote] = useState<string[]>(
    (initialValues as UpdateProductPayloadT)?.thingsToNote ?? []
  );
  const [thingsToNoteMm, setThingsToNoteMm] = useState<string[]>(
    (initialValues as UpdateProductPayloadT)?.thingsToNote_mm ?? []
  );
  const [termsAndConditionsMm, setTermsAndConditionsMm] = useState<string>(
    (initialValues as UpdateProductPayloadT)?.termsAndConditions_mm ?? ""
  );
 
 
  useEffect(() => {
    setValue("exclusions", exclusions);
  }, [exclusions, setValue]);

  useEffect(() => {
    setValue("exclusions_mm", exclusions_mm);
  }, [exclusions_mm, setValue]);

  useEffect(() => {
    setValue("highlights", highlights);
  }, [highlights, setValue]);

  useEffect(() => {
    setValue("highlights_mm", highlights_mm);
  }, [highlights_mm, setValue]);

  useEffect(() => {
    setValue("howToUseList", howToUseList);
  }, [howToUseList, setValue]);

  useEffect(() => {
    setValue("howToUseList_mm", howToUseList_mm);
  }, [howToUseList_mm, setValue]);

  useEffect(() => {
    setValue("inclusions", inclusions);
  }, [inclusions, setValue]);

  useEffect(() => {
    setValue("inclusions_mm", inclusions_mm);
  }, [inclusions_mm, setValue]);

  useEffect(() => {
    setValue("thingsToNote", thingsToNote);
  }, [thingsToNote, setValue]);

  useEffect(() => {
    setValue("thingsToNote_mm", thingsToNoteMm);
  }, [thingsToNoteMm, setValue]);

  useEffect(() => {
    setValue("termsAndConditions_mm", termsAndConditionsMm);
  }, [termsAndConditionsMm, setValue]);

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

  return (
    <div className="space-y-8">
      {/* Header */}
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

      {/* Group 1: Overview Fields */}
      <div className="space-y-6">
        <div
          className={`space-y-3 ${
            errors.description
              ? "border border-red-300 rounded-lg p-4 bg-red-50"
              : ""
          }`}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextareaField
                label="Description"
                minHeight={120}
                maxHeight={300}
                {...field}
                errMsg={errors.description?.message}
                placeholder="Enter a detailed description of the ticket..."
              />
            )}
          />
        </div>

        <div
          className={`space-y-3 ${
            errors.description
              ? "border border-red-300 rounded-lg p-4 bg-red-50"
              : ""
          }`}
        >
          <Controller
            name="description_mm"
            control={control}
            render={({ field }) => (
              <TextareaField
                label="Description MM"
                minHeight={120}
                maxHeight={300}
                {...field}
                errMsg={errors.description_mm?.message}
                placeholder="Enter a detailed description of the ticket..."
              />
            )}
          />
        </div>

        <div
          className={`space-y-3 ${
            errors.whatToExpect
              ? "border border-red-300 rounded-lg p-4 bg-red-50"
              : ""
          }`}
        >
          <Controller
            name="whatToExpect"
            control={control}
            render={({ field }) => (
              <TextareaField
                label="What To Expect"               
                minHeight={120}
                maxHeight={300}
                {...field}
                errMsg={errors.whatToExpect?.message}
                placeholder="Describe what customers can expect from this ticket..."
              />
            )}
          />
        </div>

        <div
          className={`space-y-3 ${
            errors.whatToExpect
              ? "border border-red-300 rounded-lg p-4 bg-red-50"
              : ""
          }`}
        >
          <Controller
            name="whatToExpect_mm"
            control={control}
            render={({ field }) => (
              <TextareaField
                label="What To Expect MM"
                minHeight={120}
                maxHeight={300}
                {...field}
                errMsg={errors.whatToExpect_mm?.message}
                placeholder="Describe what customers can expect from this ticket..."
              />
            )}
          />
        </div>

      </div>

      <hr className="border-gray-200" />

      {/* Group 2: Terms & Conditions */}
      <div className="space-y-6">
        <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-600" />
          Terms & Conditions
        </h4>
        <div className="grid grid-cols-1  gap-6">
          <div
            className={`space-y-3 ${
              errors.termsAndConditions
                ? "border border-red-300 rounded-lg p-4 bg-red-50"
                : ""
            }`}
          >
            <Controller
              name="termsAndConditions"
              control={control}
              render={({ field }) => (
                <TextareaField
                  label="Terms & Conditions (English)"
                  minHeight={140}
                  maxHeight={400}
                  {...field}
                  errMsg={errors.termsAndConditions?.message}
                  placeholder="Enter terms and conditions..."
                />
              )}
            />
          </div>

          <div
            className={`space-y-3 ${
              errors.termsAndConditions_mm
                ? "border border-red-300 rounded-lg p-4 bg-red-50"
                : ""
            }`}
          >
            <Controller
              name="termsAndConditions_mm"
              control={control}
              render={({ field }) => (
                <TextareaField
                  label="Terms & Conditions (Myanmar)"
                  minHeight={140}
                  maxHeight={400}
                  {...field}
                  value={termsAndConditionsMm}
                  onChange={(e) => setTermsAndConditionsMm(e.target.value)}
                  errMsg={errors.termsAndConditions_mm?.message}
                  placeholder="Enter terms and conditions in Myanmar..."
                />
              )}
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Group 3: Dynamic Lists */}
      
      {/* Exclusions Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
           <NotebookIcon className="h-5 w-5 text-red-500" />
           <h4 className="text-lg font-semibold text-gray-800">Exclusions</h4>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* English */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-600 uppercase tracking-wider">English</h5>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                {exclusions.map((item, index) => (
                <div key={index} className="relative group">
                    <TextareaField
                        label=""
                        value={item}
                        onChange={(e) => updateArrayValue(setExclusions, index, e.target.value)}
                        placeholder="Enter exclusion"
                        minHeight={60}
                        maxHeight={150}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromArray(setExclusions, index)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                ))}
                <Button
                type="button"
                onClick={() => addToArray(setExclusions)}
                size="sm"
                variant="outline"
                className="w-full"
                >
                <Plus className="h-4 w-4 mr-2" /> Add Exclusion
                </Button>
            </div>
          </div>

          {/* Myanmar */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-600 uppercase tracking-wider">Myanmar</h5>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                {exclusions_mm.map((item, index) => (
                <div key={index} className="relative group">
                    <TextareaField
                        label=""
                        value={item}
                        onChange={(e) => updateArrayValue(setExclusionsMm, index, e.target.value)}
                        placeholder="Enter exclusion (MM)"
                        minHeight={60}
                        maxHeight={150}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromArray(setExclusionsMm, index)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                ))}
                <Button
                type="button"
                onClick={() => addToArray(setExclusionsMm)}
                size="sm"
                variant="outline"
                className="w-full"
                >
                <Plus className="h-4 w-4 mr-2" /> Add Exclusion MM
                </Button>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Highlights Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
           <NotebookIcon className="h-5 w-5 text-yellow-500" />
           <h4 className="text-lg font-semibold text-gray-800">Highlights</h4>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-600 uppercase tracking-wider">English</h5>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {highlights.map((item, index) => (
                    <div key={index} className="relative group">
                        <TextareaField
                        label=""
                        value={item}
                        onChange={(e) => updateArrayValue(setHighlights, index, e.target.value)}
                        placeholder="Enter highlight"
                        minHeight={60}
                        maxHeight={150}
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromArray(setHighlights, index)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    ))}
                    <Button
                    type="button"
                    onClick={() => addToArray(setHighlights)}
                    size="sm"
                    variant="outline"
                    className="w-full"
                    >
                    <Plus className="h-4 w-4 mr-2" /> Add Highlight
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-600 uppercase tracking-wider">Myanmar</h5>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {highlights_mm.map((item, index) => (
                    <div key={index} className="relative group">
                        <TextareaField
                        label=""
                        value={item}
                        onChange={(e) => updateArrayValue(setHighlightsMm, index, e.target.value)}
                        placeholder="Enter highlight (MM)"
                        minHeight={60}
                        maxHeight={150}
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromArray(setHighlightsMm, index)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    ))}
                    <Button
                    type="button"
                    onClick={() => addToArray(setHighlightsMm)}
                    size="sm"
                    variant="outline"
                    className="w-full"
                    >
                    <Plus className="h-4 w-4 mr-2" /> Add Highlight MM
                    </Button>
                </div>
            </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* How to Use Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
           <ListTodo className="h-5 w-5 text-blue-500" />
           <h4 className="text-lg font-semibold text-gray-800">How to Use</h4>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-600 uppercase tracking-wider">English</h5>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {howToUseList.map((item, index) => (
                    <div key={index} className="relative group">
                        <TextareaField
                        label=""
                        value={item}
                        onChange={(e) => updateArrayValue(setHowToUseList, index, e.target.value)}
                        placeholder="Enter instruction"
                        minHeight={60}
                        maxHeight={150}
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromArray(setHowToUseList, index)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    ))}
                    <Button
                    type="button"
                    onClick={() => addToArray(setHowToUseList)}
                    size="sm"
                    variant="outline"
                    className="w-full"
                    >
                    <Plus className="h-4 w-4 mr-2" /> Add Instruction
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-600 uppercase tracking-wider">Myanmar</h5>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {howToUseList_mm.map((item, index) => (
                    <div key={index} className="relative group">
                        <TextareaField
                        label=""
                        value={item}
                        onChange={(e) => updateArrayValue(setHowToUseListMm, index, e.target.value)}
                        placeholder="Enter instruction (MM)"
                        minHeight={60}
                        maxHeight={150}
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromArray(setHowToUseListMm, index)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    ))}
                    <Button
                    type="button"
                    onClick={() => addToArray(setHowToUseListMm)}
                    size="sm"
                    variant="outline"
                    className="w-full"
                    >
                    <Plus className="h-4 w-4 mr-2" /> Add Instruction MM
                    </Button>
                </div>
            </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Inclusions Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
           <NotebookIcon className="h-5 w-5 text-green-500" />
           <h4 className="text-lg font-semibold text-gray-800">Inclusions</h4>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-600 uppercase tracking-wider">English</h5>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {inclusions.map((item, index) => (
                    <div key={index} className="relative group">
                        <TextareaField
                        label=""
                        value={item}
                        onChange={(e) => updateArrayValue(setInclusions, index, e.target.value)}
                        placeholder="Enter inclusion"
                        minHeight={60}
                        maxHeight={150}
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromArray(setInclusions, index)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    ))}
                    <Button
                    type="button"
                    onClick={() => addToArray(setInclusions)}
                    size="sm"
                    variant="outline"
                    className="w-full"
                    >
                    <Plus className="h-4 w-4 mr-2" /> Add Inclusion
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-600 uppercase tracking-wider">Myanmar</h5>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {inclusions_mm.map((item, index) => (
                    <div key={index} className="relative group">
                        <TextareaField
                        label=""
                        value={item}
                        onChange={(e) => updateArrayValue(setInclusionsMm, index, e.target.value)}
                        placeholder="Enter inclusion (MM)"
                        minHeight={60}
                        maxHeight={150}
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromArray(setInclusionsMm, index)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    ))}
                    <Button
                    type="button"
                    onClick={() => addToArray(setInclusionsMm)}
                    size="sm"
                    variant="outline"
                    className="w-full"
                    >
                    <Plus className="h-4 w-4 mr-2" /> Add Inclusion MM
                    </Button>
                </div>
            </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Things to Note Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
           <NotebookIcon className="h-5 w-5 text-purple-500" />
           <h4 className="text-lg font-semibold text-gray-800">Things to Note</h4>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-600 uppercase tracking-wider">English</h5>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {thingsToNote.map((item, index) => (
                    <div key={index} className="relative group">
                        <TextareaField
                        label=""
                        value={item}
                        onChange={(e) => updateArrayValue(setThingsToNote, index, e.target.value)}
                        placeholder="Enter note"
                        minHeight={60}
                        maxHeight={150}
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromArray(setThingsToNote, index)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    ))}
                    <Button
                    type="button"
                    onClick={() => addToArray(setThingsToNote)}
                    size="sm"
                    variant="outline"
                    className="w-full"
                    >
                    <Plus className="h-4 w-4 mr-2" /> Add Note
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-600 uppercase tracking-wider">Myanmar</h5>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {thingsToNoteMm.map((item, index) => (
                    <div key={index} className="relative group">
                        <TextareaField
                        label=""
                        value={item}
                        onChange={(e) => updateArrayValue(setThingsToNoteMm, index, e.target.value)}
                        placeholder="Enter note (MM)"
                        minHeight={60}
                        maxHeight={150}
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromArray(setThingsToNoteMm, index)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    ))}
                    <Button
                    type="button"
                    onClick={() => addToArray(setThingsToNoteMm)}
                    size="sm"
                    variant="outline"
                    className="w-full"
                    >
                    <Plus className="h-4 w-4 mr-2" /> Add Note MM
                    </Button>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default DetailsTab;