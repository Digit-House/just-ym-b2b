import React, { useState, useEffect } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { TicketFormValues } from "@/types/schema/ticketSchema";
import { ProductInfoT, UpdateProductPayloadT } from "@/types/product.type";
import LongText from "@/components/ticket-fields/LongText";
import StringListEditor from "@/components/ticket-fields/StringListEditor";
import BilingualListSection, { LIST_ICONS } from "@/components/ticket-fields/BilingualListSection";
import TermsAndConditionsEditor from "@/components/TermsAndConditionsEditor";
import { ReviewField, useLocked } from "@/components/OwnerReviewContext";

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
  watch,
  setValue,
  initialValues,
}) => {
  const locked = useLocked();
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

  const listSections = [
    { names: "exclusions", title: "Exclusions", icon: LIST_ICONS.exclusions, one: "Exclusion", en: exclusions, setEn: setExclusions, mm: exclusions_mm, setMm: setExclusionsMm },
    { names: "highlights", title: "Highlights", icon: LIST_ICONS.highlights, one: "Highlight", en: highlights, setEn: setHighlights, mm: highlights_mm, setMm: setHighlightsMm },
    { names: "howToUseList", title: "How to Use", icon: LIST_ICONS.howToUseList, one: "Instruction", en: howToUseList, setEn: setHowToUseList, mm: howToUseList_mm, setMm: setHowToUseListMm },
    { names: "inclusions", title: "Inclusions", icon: LIST_ICONS.inclusions, one: "Inclusion", en: inclusions, setEn: setInclusions, mm: inclusions_mm, setMm: setInclusionsMm },
    { names: "thingsToNote", title: "Things to Note", icon: LIST_ICONS.thingsToNote, one: "Note", en: thingsToNote, setEn: setThingsToNote, mm: thingsToNoteMm, setMm: setThingsToNoteMm },
  ];

  const textArea = (name: "description" | "description_mm" | "whatToExpect" | "whatToExpect_mm", label: string, placeholder: string) => {
    const base = name.replace("_mm", "") as "description" | "whatToExpect";
    return (
      <div className={`space-y-3 ${errors[base] ? "border border-red-300 rounded-lg p-4 bg-red-50" : ""}`}>
        <ReviewField names={[name]} label={label} current={watch(name)}>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <LongText label={label} {...field} errMsg={errors[name]?.message} placeholder={placeholder} />
            )}
          />
        </ReviewField>
      </div>
    );
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
        {textArea("description", "Description", "Enter a detailed description of the ticket...")}
        {textArea("description_mm", "Description MM", "Enter a detailed description of the ticket...")}
        {textArea("whatToExpect", "What To Expect", "Describe what customers can expect from this ticket...")}
        {textArea("whatToExpect_mm", "What To Expect MM", "Describe what customers can expect from this ticket...")}
      </div>

      <hr className="border-gray-200" />

      {/* Group 2: Terms & Conditions */}
      <div className="space-y-6">
        <ReviewField names={["termsAndConditions", "termsAndConditions_mm"]} label="Terms and conditions" current={watch("termsAndConditions")}>
        <Controller
          name="termsAndConditions"
          control={control}
          render={({ field, fieldState }) => (
            <TermsAndConditionsEditor
              readOnly={locked}
              englishValue={field.value || ""}
              myanmarValue={termsAndConditionsMm}
              onEnglishChange={field.onChange}
              onMyanmarChange={setTermsAndConditionsMm}
              englishError={fieldState.error?.message}
              myanmarError={errors.termsAndConditions_mm?.message}
            />
          )}
        />
        </ReviewField>
      </div>

      <hr className="border-gray-200" />


      {listSections.map((l, i) => (
        <React.Fragment key={l.names}>
          {i > 0 && <hr className="border-gray-200" />}
          <ReviewField names={[l.names, `${l.names}_mm`]} label={l.title === "How to Use" ? "How to use" : l.title === "Things to Note" ? "Things to note" : l.title} current={l.en}>
            <BilingualListSection
              title={l.title}
              icon={l.icon}
              en={
                <StringListEditor
                  label={l.title}
                  value={l.en}
                  onChange={l.setEn}
                  readOnly={locked}
                  placeholder={`Enter ${l.one.toLowerCase()}`}
                  addLabel={`Add ${l.one}`}
                />
              }
              mm={
                <StringListEditor
                  label={`${l.title} MM`}
                  value={l.mm}
                  onChange={l.setMm}
                  readOnly={locked}
                  placeholder={`Enter ${l.one.toLowerCase()} (MM)`}
                  addLabel={`Add ${l.one} MM`}
                />
              }
            />
          </ReviewField>
        </React.Fragment>
      ))}
    </div>
  );
};

export default DetailsTab;
