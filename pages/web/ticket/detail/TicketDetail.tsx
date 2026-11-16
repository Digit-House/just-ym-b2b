import { Link, useParams } from "react-router-dom";
import { useTicketDetail } from "./useTicketDetail";
import MediaCarousel from "./_components/MediaCarousel";
import BackBtn from "@/components/BackBtn";
import PageContainer from "@/components/PageContainer";
import MascotLoader from "@/components/MascotLoader";
import EmptyState from "@/components/EmptyState";
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
        <MascotLoader label="Loading ticket details..." />
      </div>
    );
  }

  if (!loading && !product) {
    return (
      <EmptyState
        className="min-h-[60vh]"
        title="Ticket Not Found"
        description="The ticket you're looking for doesn't exist or may have been removed."
      >
        <Link
          to="/tickets"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Browse Tickets
        </Link>
      </EmptyState>
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
