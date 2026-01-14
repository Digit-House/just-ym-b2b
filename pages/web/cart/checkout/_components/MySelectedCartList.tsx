"use client";

import { ADD_TO_CART_ITEM_DATA_TYPE } from "@/types/product.type";
import React from "react";
import { Calendar, Ticket } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { preFixImg } from "@/util/initData";

const MySelectedCartList = () => {
  const { selectedCartList } = useCartStore();
  return (
    <div className="w-full lg:px-6 px-4 lg:pt-6 pt-4 border rounded-2xl border-[#D9D9D9] flex flex-col lg:gap-6 gap-4 divide-y divide-[#D9D9D9]">
      {selectedCartList.map((item: ADD_TO_CART_ITEM_DATA_TYPE) => (
        <div className="pb-4 lg:pb-6" key={item.id + item.productId}>
          <p className="text-lg line-clamp-1 font-bold">
            {item.productName} - {item.productOptionName}
          </p>
          <div className="grid items-center grid-cols-5 mt-4 lg:grid-cols-3 lg:mt-6">
            <div className="flex items-center col-span-3 gap-2 lg:gap-4 lg:col-span-1">
              <img
                src={preFixImg(item.image)}
                alt="addToCart"
                // width={60}
                // height={60}
                className=" rounded-[12px] object-cover object-center w-[60px] h-[60px]"
              />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 lg:w-6 lg:h-6 text-indigo-700" />
                  {/* <Typo
                    text={item.visitDate}
                    size={isMobile ? "sm" : "lg"}
                    className="text-black text-nowrap"
                  /> */}
                  <p className="text-nowrap text-lg">{item.visitDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 lg:w-6 lg:h-6 text-indigo-700" />
                  {/* <CouponIcon fill="#ff924d" /> */}
                  {/* <Typo
                    text={`${item.quantity} ${item.ticketTypeName}`}
                    size={isMobile ? "sm" : "lg"}
                    className="text-black text-nowrap"
                  /> */}
                  <p className="text-nowrap text-lg">
                    {item.quantity} {item.ticketTypeName}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center w-full h-full">
              {/* <Typo
                text={`${item.quantity}`}
                size="md"
                className="text-primary"
                fontWeight="bold"
              /> */}
              <p className="text-indigo-700 text-base font-bold">
                {item.quantity}
              </p>
            </div>
            <div className="flex items-center justify-end w-full h-full">
              {/* <Typo
                text={`B ${item.price}`}
                size={isMobile ? "sm" : "md"}
                fontWeight="bold"
                className="text-primary"
              /> */}
              <p className="text-indigo-700 text-base font-bold">
                THB {item.price}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MySelectedCartList;
