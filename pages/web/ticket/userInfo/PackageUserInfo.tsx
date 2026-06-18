import PageContainer from "@/components/PageContainer";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import PreviewUserInfoForm from "./_component.tsx/PreviewUserInfoForm";
import { useUserInfo } from "./useUserInfo";
import usePackageStore from "@/store/usePackageStore";
import PackageTimeInfoFrom from "./_component.tsx/PackageTimeInfoForm";
import PackageVariantForm from "./_component.tsx/PackageVariantForm";
import PackagePreViewCheckOut from "./_component.tsx/PackagePreviewCheckout";

const PackageUserInfo = () => {
  const navigate = useNavigate();
  const { setCurrentOpen, setUserInfoCheck } = useUserInfo();
  const { packageList } = usePackageStore();
  return (
    <PageContainer className="space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-6 text-sm font-bold group"
      >
        <ChevronLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back
      </button>

      <PreviewUserInfoForm
        setCurrentOpen={setCurrentOpen}
        setUserInfoCheck={setUserInfoCheck}
      />

      <div className="flex flex-col gap-4 divide-y divide-[#D9D9D9]">
        {packageList.map((data) => (
          <div className="flex flex-col gap-3 pt-4" key={data.ticketTypeId}>
            <p className=" capitalize text-base font-bold">
              For {data.variantName.toLowerCase()}
            </p>
            <div className="px-4 pb-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-[-4px_4px_30px_0px_#0000000D] flex flex-col gap-6 divide-y divide-[#D9D9D9]">
              {data.packageItems.map((item) => (
                <div className="flex flex-col gap-4 pt-4" key={item.name}>
                  <p className="font-bold text-indigo-700">{item.name}</p>
                  {(item.isCapacity || item.isVisitDate) && (
                    <PackageTimeInfoFrom data={item} id={data.ticketTypeId} />
                  )}
                  {item.questionList.length > 0 &&
                    item.questions.length > 0 && (
                      <div className="flex flex-col gap-4">
                        {item.questionList.map((q, index) => (
                          <PackageVariantForm
                            key={index}
                            name={data.variantName}
                            id={data.ticketTypeId}
                            guestIndex={index}
                            item={item}
                          />
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <PackagePreViewCheckOut />
    </PageContainer>
  );
};

export default PackageUserInfo;
