import BackBtn from "@/components/BackBtn";
import PageContainer from "@/components/PageContainer";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import PreviewUserInfoForm from "./_component.tsx/PreviewUserInfoForm";
import { useUserInfo } from "./useUserInfo";
import { useCartStore } from "@/store/useCartStore";
import PreviewTimeInfoForm from "./_component.tsx/PreviewTimeInfoFormFrame";
import PreviewVariantForm from "./_component.tsx/PreviewVariantForm";
import PreViewCheckOut from "./_component.tsx/PreviewCheckOut";

const UserInfoPage = () => {
  const navigate = useNavigate();
  const {
    setCurrentOpen,
    currentOpen,
    setTimeInfoCheck,
    setUserInfoCheck,
    setVariantCheck,
    userInfoCheck,
    variantCheck,
    timeInfoCheck,
    loading,
    setLoading,
  } = useUserInfo();
  const { finalPackage } = useCartStore();

  return (
    <PageContainer className="space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-6 text-sm font-bold group"
      >
        <ChevronLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />{" "}
        Back
      </button>
      <div className="flex flex-col gap-8">
        <PreviewUserInfoForm
          setCurrentOpen={setCurrentOpen}
          setUserInfoCheck={setUserInfoCheck}
        />
        {finalPackage.isCapacity && (
          <PreviewTimeInfoForm
            setCurrentOpen={setCurrentOpen}
            currentOpen={currentOpen}
            setTimeInfoCheck={setTimeInfoCheck}
          />
        )}
        {finalPackage && finalPackage.questions.length > 0 && (
          <PreviewVariantForm
            setVariantCheck={setVariantCheck}
            currentOpen={currentOpen}
            setCurrentOpen={setCurrentOpen}
          />
        )}
        {
          <PreViewCheckOut
            disable={
              !userInfoCheck || !timeInfoCheck || !variantCheck ? true : false
            }
            loading={loading}
            setLoading={setLoading}
          />
        }
      </div>
    </PageContainer>
  );
};

export default UserInfoPage;
