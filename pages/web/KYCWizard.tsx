import React, { useState } from "react";
import Header from "../../components/Header";
import { UploadCloud } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const steps = [
  "Basic Information",
  "Business Identity Verification",
  "Authorized Person ID",
  "Financial Information",
];

const KYCWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Basic Information
            </h3>
            <p className="text-sm text-gray-500 mb-8">
              Measure your advertising ROI and report website traffic.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Business Type
                </label>
                <select className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3">
                  <option>Reseller</option>
                  <option>Distributor</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Contact Person's Designation
                </label>
                <input
                  type="text"
                  className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
                />
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm">
                      MM ▾
                    </span>
                    <input
                      type="text"
                      className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 pl-14"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Business Identify Verification
            </h3>
            <p className="text-sm text-gray-500 mb-8">
              Measure your advertising ROI and report website traffic.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Business License No
                </label>
                <input
                  type="text"
                  className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Tax Identification Number
                </label>
                <input
                  type="text"
                  className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
                />
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center flex flex-col items-center justify-center">
              <UploadCloud size={40} className="text-gray-400 mb-4" />
              <p className="font-medium text-gray-900 mb-1">
                Business Registration Certificate
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Upload the front side of your document
                <br />
                Supports: JPG, PNG, PDF
              </p>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Choose a File
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Authorized Person ID
            </h3>
            <p className="text-sm text-gray-500 mb-8">
              Measure your advertising ROI and report website traffic.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
                <UploadCloud size={40} className="text-gray-400 mb-4" />
                <p className="font-medium text-gray-900 mb-1">
                  Front Side of Government-issued ID
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Upload the front side of your document
                  <br />
                  Supports: JPG, PNG, PDF
                </p>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Choose a File
                </button>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
                <UploadCloud size={40} className="text-gray-400 mb-4" />
                <p className="font-medium text-gray-900 mb-1">
                  Back Side of Government-issued ID
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Upload the front side of your document
                  <br />
                  Supports: JPG, PNG, PDF
                </p>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Choose a File
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Financial Information
            </h3>
            <p className="text-sm text-gray-500 mb-8">
              Measure your advertising ROI and report website traffic.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Bank Name
                </label>
                <input
                  type="text"
                  className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must match business/authorized person
                </p>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Account Number
                </label>
                <input
                  type="text"
                  className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  SWIFT/BIC Code
                </label>
                <input
                  type="text"
                  className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
                />
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center flex flex-col items-center justify-center mb-6">
              <UploadCloud size={40} className="text-gray-400 mb-4" />
              <p className="font-medium text-gray-900 mb-1">
                Bank Statement (last 3 months) OR Bank Confirmation Letter
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Upload the front side of your document
                <br />
                Supports: JPG, PNG, PDF
              </p>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Choose a File
              </button>
            </div>

            <div className="flex items-center">
              <input
                id="link-checkbox"
                type="checkbox"
                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                htmlFor="link-checkbox"
                className="ml-2 text-sm font-medium text-gray-900"
              >
                I confirm all details provided are true and correct and accept
                the Distributor{" "}
                <a href="#" className="text-indigo-600 hover:underline">
                  Agreement & Terms of Service
                </a>
                .
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full mx-auto">
      <PageHeader
        title="KYC Setting"
        des="Measure your advertising ROI and report website traffic."
      />

      {/* Stepper */}
      <div className="mb-12 relative px-4">
        {/* Progress Line */}
        <div
          className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2 hidden md:block"
          style={{ left: "10%", width: "80%" }}
        ></div>

        <div className="flex justify-between items-center relative">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={index} className="flex flex-col items-center z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all duration-300 bg-white ${
                    isCurrent
                      ? "border-indigo-600 w-6 h-6 ring-4 ring-indigo-100"
                      : isCompleted
                      ? "border-indigo-600 bg-indigo-600"
                      : "border-gray-300"
                  }`}
                >
                  {isCompleted && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  )}
                  {isCurrent && (
                    <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>
                  )}
                </div>
                <span
                  className={`text-xs mt-2 text-center max-w-[100px] hidden md:block ${
                    isCurrent ? "text-indigo-600 font-medium" : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {renderStepContent()}

      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            currentStep === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Back
        </button>

        <button
          onClick={handleNext}
          className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          {currentStep === steps.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default KYCWizard;
