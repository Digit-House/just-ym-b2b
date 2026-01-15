import ImagePreview from '@/components/ImagePreview';


const EditTopup = ({ relatedImages }) => {
  return (
    <div className="space-y-6">
      {/* Other form fields */}
      
      {/* Image Preview Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100">
        <ImagePreview 
          images={relatedImages || []}
          title="Related Images"
          className="mb-4"
        />
      </div>
    </div>
  );
};

// Example usage in Edit PaymentMethod for QR Code preview
const EditPaymentMethod = ({ paymentMethod }) => {
  return (
    <div className="space-y-6">
      {/* Other form fields */}
      
      {/* QR Code Preview Section */}
      {paymentMethod?.qrCodeUrl && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <ImagePreview 
            images={[paymentMethod.qrCodeUrl]}
            title="QR Code Preview"
            className="mb-4"
          />
        </div>
      )}
    </div>
  );
};

export { EditTopup, EditPaymentMethod };