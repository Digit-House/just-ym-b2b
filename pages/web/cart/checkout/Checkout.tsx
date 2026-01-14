import BackBtn from "@/components/BackBtn";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import { useCartStore } from "@/store/useCartStore";
import React from "react";
import MySelectedCartList from "./_components/MySelectedCartList";
import OrderSummary from "./_components/OrderSummary";
import OrderCheckOut from "./_components/OrderCheckOut";

const Checkout = () => {
  return (
    <PageContainer>
      <BackBtn route="/cart" title="Back to Cart" />
      <PageHeader
        title="Checkout"
        des="Complete your booking details and payment information."
      />
      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="flex flex-col flex-1 gap-10">
          <MySelectedCartList />
          <OrderCheckOut />
        </div>
        <OrderSummary />
      </div>
    </PageContainer>
  );
};

export default Checkout;
