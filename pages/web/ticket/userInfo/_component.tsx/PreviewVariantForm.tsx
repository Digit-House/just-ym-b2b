import React, { useEffect } from "react";
import PreviewGuestForm from "./PreviewGuestForm";
import { useCartStore } from "@/store/useCartStore";

type Props = {
  setVariantCheck: React.Dispatch<React.SetStateAction<boolean>>;
  currentOpen: number;
  setCurrentOpen: React.Dispatch<React.SetStateAction<number>>;
};

const PreviewVariantForm = ({
  setVariantCheck,
  currentOpen,
  setCurrentOpen,
}: Props) => {
  const { guestList, finalPackage } = useCartStore();

  useEffect(() => {
    const newVariantCheck = guestList.every((data) => data.isFilled);
    setVariantCheck(newVariantCheck);
  }, [guestList]);
  return (
    <div className="flex flex-col w-full gap-6">
      {guestList.map((item, i) => (
        <PreviewGuestForm
          key={i}
          guestInfo={item}
          step={finalPackage?.isCapacity ? i + 3 : i + 2}
          currentOpen={currentOpen}
          setCurrentOpen={setCurrentOpen}
        />
      ))}
    </div>
  );
};

export default PreviewVariantForm;
