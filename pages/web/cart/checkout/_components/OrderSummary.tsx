import React from "react";
import { useCartStore } from "@/store/useCartStore";
import { preFixImg } from "@/util/initData";

const OrderSummary = () => {
  const { selectedCartList, user } = useCartStore();
  // const { user } = useUserInfoStore();

  const totalPrice = selectedCartList.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (selectedCartList.length === 0) return <div></div>;
  return (
    <div className="w-[405px] flex flex-col">
      <div className="rounded w-full rounded-t-2xl h-[109px] px-4 py-8  relative overflow-hidden z-10">
        <div className="relative z-20">
          {/* <Typo
            text={
              selectedCartList.length > 1
                ? "Order Summary"
                : selectedCartList[0].productName
            }
            size="2xl"
            className="text-white"
            fontWeight="bold"
          /> */}
          <p className="text-white font-bold text-2xl">
            {selectedCartList.length > 1
              ? "Order Summary"
              : selectedCartList[0].productName}
          </p>
        </div>
        <div
          className="absolute top-0 left-0 z-0 w-full h-full bg-indigo-700"
          style={{
            background:
              selectedCartList.length > 1
                ? ""
                : "linear-gradient(0deg, rgba(0, 0, 0, 0.40) 0%",
          }}
        />
        {selectedCartList.length > 1 ? (
          <img
            src="/img/addToCart.png"
            alt="addToCart"
            className="absolute bottom-0 right-0 object-cover object-bottom w-full h-full"
          />
        ) : (
          <img
            src={preFixImg(selectedCartList[0].image)}
            alt="addToCart"
            className="absolute object-cover object-bottom w-full h-full -z-10 top-0 left-0"
          />
        )}
      </div>
      <div
        className=" px-4 py-6 rounded-b-2xl border-b border-r border-l border-[#D9D9D9]"
        style={{
          boxShadow: "4px 4px 30px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="flex flex-col gap-4 pb-4 border-b border-[#D9D9D9]">
          {/* <Typo
            text="Billing Info"
            size="md"
            fontWeight="bold"
            className="text-black"
          /> */}
          <p className=" font-bold">Billing Info</p>
          <div className="flex items-center justify-between gap-4">
            {/* <Typo text="Name:" size="sm" className="text-black" /> */}
            <p className="text-sm">Name:</p>
            <p className="text-sm text-indigo-700 font-bold">{user?.name}</p>
            {/* <Typo
              text={user?.name}
              size="sm"
              className="text-primary"
              fontWeight="bold"
            /> */}
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm">Email Address:</p>
            <p className="text-sm text-indigo-700 font-bold">{user?.email}</p>
            {/* <Typo text="Email Address:" size="sm" className="text-black" />
            <Typo
              text={user?.email}
              size="sm"
              className="text-primary"
              fontWeight="bold"
            /> */}
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex items-center justify-between gap-4">
            <p className=" font-bold">Total</p>
            <p className="text-indigo-700 font-bold">THB {totalPrice}</p>
            {/* <Typo
              text="Total"
              size="md"
              className="text-black"
              fontWeight="bold"
            />
            <Typo
              text={`B ${totalPrice}`}
              size="md"
              className="text-primary"
              fontWeight="bold"
            /> */}
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className=" font-bold"> Subtotal</p>
            <p className="text-indigo-700 font-bold">THB {totalPrice}</p>
            {/* <Typo
              text="Subtotal"
              size="md"
              className="text-black"
              fontWeight="bold"
            />
            <Typo
              text={`B ${totalPrice}`}
              size="md"
              className="text-primary"
              fontWeight="bold"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
