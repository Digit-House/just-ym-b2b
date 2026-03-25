import { Link, useParams } from "react-router-dom";
import { useTicketDetail } from "./useTicketDetail";
import MediaCarousel from "./_components/MediaCarousel";
import BackBtn from "@/components/BackBtn";
import PageContainer from "@/components/PageContainer";
import SevenDayPicker from "./_components/SevenDayPicker";
import ProductionOptionSelecter from "./_components/ProductionOptionSelecter";
import ProductAddToCart from "./_components/ProductAddToCart";
import RelatedTicketsCarousel from "@/pages/web/ticket/_components/RelatedTicketsCarousel";

const TicketDetail = () => {
  const { id } = useParams();

  const {
    product,
    loading,
    currentMediaIndex,
    setCurrentMediaIndex,
    mediaList,
    nextMedia,
    prevMedia,
    pickedDate,
    setPickedDate,
    optionLoading,
    productOptions,
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
    <PageContainer>
      <div className="space-y-8 w-full lg:w-[90%] mx-auto">
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
