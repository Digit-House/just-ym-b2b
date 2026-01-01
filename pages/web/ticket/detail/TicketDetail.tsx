import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useTicketDetail } from './useTicketDetail';
import MediaCarousel from './_components/MediaCarousel';
import SummaryCard from './_components/SummaryCard';
import PackageTable from './_components/PackageTable';
import DetailTabs from './_components/DetailTabs';
import BookingPanel from './_components/BookingPanel';

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
    prevMedia
  } = useTicketDetail(id);

  if (!product || !currentOption) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-indigo-600 font-bold">Loading product details...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Navigation Header */}
      <Link 
        to="/tickets" 
        className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-6 text-sm font-bold group"
      >
        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Listings
      </Link>

      {/* Main Layout Grid */}
      <div className="flex flex-col gap-8">
        
        {/* Gallery Section */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-12">
            <SummaryCard
              product={product} 
              currentOption={currentOption} 
            />
            
            <PackageTable
              options={product.productOptions} 
            />
            
            <DetailTabs 
              product={product} 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
          </div>

          {/* Booking Widget (1/3 width) */}
          <div className="lg:col-span-1">
            <BookingPanel
              options={product.productOptions}
              selectedIndex={selectedOptionIndex}
              onSelectIndex={setSelectedOptionIndex}
              quantities={quantities}
              onUpdateQty={updateQuantity}
              totalPrice={totalPrice}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;