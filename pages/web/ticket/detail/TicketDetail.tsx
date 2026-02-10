import React from "react";
import { Link, useParams } from "react-router-dom";
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
import RelatedTicketsCarousel from "@/pages/web/ticket/_components/RelatedTicketsCarousel";
import { truncate } from "fs";
import { truncateDescription } from "@/lib/utils";

const TicketDetail = () => {
  const { id } = useParams();

  const {
    product,
    loading,
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

  if (loading && !product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-gray-600 font-medium">
            Loading ticket details...
          </p>
        </div>
      </div>
    );
  }

  if (!loading && !product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Ticket Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              The ticket you're looking for doesn't exist or may have been
              removed.
            </p>
          </div>
          <Link
            to="/tickets"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Browse Tickets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageContainer className="space-y-8 w-full lg:w-[90%] mx-auto">
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
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 items-start relative">
          <div className="lg:col-span-4 flex flex-col gap-6">
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
              pickedDate={pickedDate}
              isManual={product.requiresManualConfirmation}
            />
            {/* {selectedProductOption && (
              <VariantSelecter
                selectedProductOption={selectedProductOption}
                setSelectedProductOption={setSelectedProductOption}
              />
            )} */}
          </div>
          <div className="lg:col-span-2 sticky top-20 z-10">
            <ProductAddToCart
              title={product.name}
              pickedDate={pickedDate}
              selectedProductOption={selectedProductOption}
              eventLoading={eventLoading}
            />
          </div>
        </div>
      </div>
      {product && (
        <RelatedTicketsCarousel
          ticketId={product.id}
          isPublished={product.isPublished}
        />
      )}
    </PageContainer>
  );
};

export default TicketDetail;
