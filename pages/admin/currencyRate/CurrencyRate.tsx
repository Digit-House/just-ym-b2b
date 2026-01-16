import { useState } from "react";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import ModalWrapper from "@/components/ModalWrapper";
import CurrencyRateForm from "./_components/CurrencyRateForm";
import { useCurrencyRate } from "@/hooks/useCurrencyRate";


const CurrencyRate = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  
  const {
    data: currencyRate,
    isLoading,
    isError,
    error,
    refetch: refetchCurrencyRate
  } = useCurrencyRate(true); // Enable auto-refresh every minute

  const handleSave = () => {
    setShowEditModal(false);
    refetchCurrencyRate(); // Refresh data after update
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Currency Rate"
          des="Manage THB to MMK exchange rate."
        />
        <div className="flex justify-center items-center h-64">
          <p>Loading currency rate...</p>
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <PageHeader
          title="Currency Rate"
          des="Manage THB to MMK exchange rate."
        />
        <div className="flex justify-center items-center h-64 text-red-500">
          <p>Error loading currency rate: {error?.message || 'Unknown error'}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Currency Rate"
        des="Manage THB to MMK exchange rate."
      />
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Current Exchange Rate</h2>
            <p className="text-gray-600">The current THB to MMK conversion rate</p>
          </div>
          
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-indigo-600">
                  {currencyRate?.mmk || "N/A"}
                </p>
                <p className="text-gray-600 mt-1">
                  1THB = {currencyRate?.mmk || "N/A"} MMK
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-sm font-medium">
                  {currencyRate?.updatedAt 
                    ? new Date(currencyRate.updatedAt).toLocaleString() 
                    : "N/A"}
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 text-sm">
                This exchange rate is used to convert prices from Thai Baht (THB) to Myanmar Kyat (MMK).
                When customers purchase tickets or services, this rate will be applied to show prices in MMK.
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Update Rate
            </button>
          </div>
        </div>
      </div>

      {showEditModal && currencyRate && (
        <ModalWrapper 
          title="Update Currency Rate" 
          onClose={() => setShowEditModal(false)}
        >
          <CurrencyRateForm
            initialValues={currencyRate}
            onCancel={() => setShowEditModal(false)}
            onSubmit={handleSave}
          />
        </ModalWrapper>
      )}
    </PageContainer>
  );
};

export default CurrencyRate;