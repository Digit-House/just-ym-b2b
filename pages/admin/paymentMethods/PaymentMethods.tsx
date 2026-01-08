"use client";

import { useCallback, useEffect, useState } from "react";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import {
  getPaymentMethods,
  postPaymentMethod,
  putPaymentMethod,
} from "@/graphql/paymentMethod";
import { PaymentMethodT } from "@/types/paymentMethod.type";
import { toast } from "sonner";
import { getErrMsg } from "@/util/initData";
import { FileEdit, Plus } from "lucide-react";
import ModalWrapper from "@/components/ModalWrapper";
import PaymentMethodForm from "./_components/PaymentMethodForm";
import RoleCheckAction from "@/components/RoleCheckAction";
import { PaymentMethodFormValues } from "@/types/schema/paymentMethodSchema";

const PaymentMethods = () => {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentMethodT[]>([]);
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [fetchAgain, setFetchAgain] = useState(false);

  const [modalState, setModalState] = useState<{
    mode: "create" | "edit" | null;
    paymentMethod?: PaymentMethodT | null;
  }>({
    mode: null,
    paymentMethod: null,
  });

  const closeModal = useCallback(() => {
    setModalState({ mode: null, paymentMethod: null });
  }, []);

  useEffect(() => {
    fetchPaymentMethods();
  }, [isActive, fetchAgain]);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const res: any = await getPaymentMethods(isActive);
      setPaymentData(res?.data?.paymentMethods || []);
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePaymentMethod = async (value: PaymentMethodFormValues) => {
    try {
      setLoading(true);
      await postPaymentMethod(value);
      toast.success("Successfully Created !");
      closeModal();
      setTimeout(() => {
        setFetchAgain((prev) => !prev);
      }, 2000);
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  const handleEditPaymentMethod = async (value: PaymentMethodFormValues) => {
    try {
      setLoading(true);
      await putPaymentMethod(value);
      toast.success("Successfully Updated !");
      closeModal();
      setTimeout(() => {
        setFetchAgain((prev) => !prev);
      }, 2000);
    } catch (err) {
      toast.error(getErrMsg(err, "message"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Payment Methods"
        des="Manage available payment methods for top-up transactions."
      />

      {/* Top filter bar */}
      <div className="flex items-center justify-between mb-5 gap-3 border border-[#21212124] py-[8px] px-[16px]">
        <RoleCheckAction>
          <button
            onClick={() => {
              setModalState({ mode: "create" });
            }}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Plus size={18} />
            Add Payment Method
          </button>
        </RoleCheckAction>
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={isActive === null ? "all" : isActive ? "active" : "inactive"}
          onChange={(e) => {
            const value = e.target.value;
            setIsActive(
              value === "all" ? null : value === "active" ? true : false
            );
          }}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="all">All</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-900 uppercase bg-indigo-50">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Bank</th>
                <th className="px-6 py-4 font-semibold">Account</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Created At</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    Loading payment methods...
                  </td>
                </tr>
              )}

              {!loading && paymentData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    No payment methods found
                  </td>
                </tr>
              )}

              {!loading &&
                paymentData.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.name}
                    </td>

                    <td className="px-6 py-4">{item.type}</td>

                    <td className="px-6 py-4">{item.bankName || "-"}</td>

                    <td className="px-6 py-4">
                      {item.accountName}
                      {item.accountNumber && (
                        <div className="text-xs text-gray-400">
                          {item.accountNumber}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setModalState({
                            mode: "edit",
                            paymentMethod: item,
                          });
                        }}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <FileEdit size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalState.mode === "create" && (
        <ModalWrapper title="Create Role" onClose={closeModal}>
          <PaymentMethodForm
            mode="create"
            initialValues={modalState.paymentMethod}
            loading={loading}
            onCancel={closeModal}
            onSubmit={handleCreatePaymentMethod}
          />
        </ModalWrapper>
      )}

      {modalState.mode === "edit" && (
        <ModalWrapper title="Edit Role" onClose={closeModal}>
          <PaymentMethodForm
            mode="edit"
            initialValues={modalState.paymentMethod}
            loading={loading}
            onCancel={closeModal}
            onSubmit={handleEditPaymentMethod}
          />
        </ModalWrapper>
      )}
    </PageContainer>
  );
};

export default PaymentMethods;
