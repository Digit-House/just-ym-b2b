"use client";

import { ADD_TO_CART_ITEM_DATA_TYPE } from "@/types/product.type";
import { Calendar, Clock, Ticket } from "lucide-react";
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
                className=" rounded-[12px] object-cover object-center w-[60px] h-[60px]"
              />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4  text-indigo-700" />
                  <p className="text-nowrap text-md">{item.visitDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4  text-indigo-700" />
                  <p className="text-nowrap text-md">
                    {item.quantity} {item.ticketTypeName}
                  </p>
                </div>
                {item.eventTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4  text-indigo-700" />
                    <p className="text-nowrap text-md">{item.eventTime}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-indigo-700 text-base font-bold">
                {item.quantity}
              </p>
            </div>
            <div className="flex items-center justify-end w-full h-full">
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
