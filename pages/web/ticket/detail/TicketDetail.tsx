import React from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useTicketDetail } from "./useTicketDetail";
import MediaCarousel from "./_components/MediaCarousel";
import SummaryCard from "./_components/SummaryCard";
import PackageTable from "./_components/PackageTable";
import DetailTabs from "./_components/DetailTabs";
import BookingPanel from "./_components/BookingPanel";
import BackBtn from "@/components/BackBtn";
import PageContainer from "@/components/PageContainer";
import SevenDayPicker from "./_components/SevenDayPicker";
import ProductionOptionSelecter from "./_components/ProductionOptionSelecter";
import VariantSelecter from "./_components/VariantSelecter";
import ProductAddToCart from "./_components/ProductAddToCart";

const TicketDetail = () => {
  const { id } = useParams();

  const {
    product,
    currentOption,
    selectedOptionIndex,
    setSelectedOptionIndex,
    quantities,
    updateQuantity,
    totalPrice,
    activeTab,
    setActiveTab,
    currentMediaIndex,
    setCurrentMediaIndex,
    mediaList,
    nextMedia,
    prevMedia,
    pickedDate,
    setPickedDate,
    optionLoading,
    setOptionLoading,
    productOptions,
    setProductOptions,
    selectedProductOption,
    setSelectedProductOption,
    eventLoading,
  } = useTicketDetail(id);


  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-indigo-600 font-bold">
          Loading product details...
        </div>
      </div>
    );
  }

  return (
    <PageContainer className="space-y-8">
      <BackBtn route="/tickets" title="Back to Tickets" />
      <div className="flex flex-col gap-8">
        <MediaCarousel
          mediaList={mediaList}
          currentIndex={currentMediaIndex}
          onNext={nextMedia}
          onPrev={prevMedia}
          setIndex={setCurrentMediaIndex}
          isRecommended={product.isGTRecommend}
          isInstant={product.isInstantConfirmation}
          productName={product.name}
        />

        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-12">
            <SummaryCard product={product} currentOption={currentOption} />

            <PackageTable options={product.productOptions} />

            <DetailTabs
              product={product}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <div className="lg:col-span-1">
            <BookingPanel
              product={product}
              options={product.productOptions}
              selectedIndex={selectedOptionIndex}
              onSelectIndex={setSelectedOptionIndex}
              quantities={quantities}
              onUpdateQty={updateQuantity}
              totalPrice={totalPrice}
            />
          </div>
        </div> */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h3 className="text-2xl font-bold text-gray-900">Package Info</h3>
            <SevenDayPicker
              pickedDate={pickedDate}
              setPickedDate={setPickedDate}
              product={product}
            />
            <ProductionOptionSelecter
              loading={optionLoading}
              productOptions={productOptions}
              selectedProductOption={selectedProductOption}
              setSelectedProductOption={setSelectedProductOption}
            />
            {selectedProductOption && (
              <VariantSelecter
                selectedProductOption={selectedProductOption}
                setSelectedProductOption={setSelectedProductOption}
              />
            )}
          </div>
          <ProductAddToCart
            title={product.name}
            pickedDate={pickedDate}
            selectedProductOption={selectedProductOption}
            eventLoading={eventLoading}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default TicketDetail;
