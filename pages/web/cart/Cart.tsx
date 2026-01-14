import { Calendar, Ticket, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import CartListItem from "./_components/CartListItem";
import EmptyCart from "./_components/EmptyCart";
import { useUser } from "@/provider/UserProvider";
import PageHeader from "@/components/PageHeader";
import BackBtn from "@/components/BackBtn";
import PageContainer from "@/components/PageContainer";
import { useCart } from "./useCart";
import { ADD_TO_CART_ITEM_DATA_TYPE } from "@/types/product.type";
import { allClearCart, clearCart } from "@/graphql/product";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { preFixImg } from "@/util/initData";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    data,
    setData,
    loading,
    setLoading,
    totalPrice,
    setTotalPrice,
    addToCartList,
    tickeGroupedArray,
  } = useCart();
  const navigate = useNavigate();
  const { selectedCartList, setSelectedCartList, setAddToCartCount } =
    useCartStore();

  /* ---------------------------------------------
   * DERIVED STATE (NO useState needed)
   * ------------------------------------------- */
  const allSelected =
    !!data &&
    data.items.length > 0 &&
    selectedCartList.length === data.items.length;

  /* ---------------------------------------------
   * HANDLERS
   * ------------------------------------------- */
  const handleAllSelected = () => {
    if (!data) return;

    setSelectedCartList(
      allSelected ? [] : [...data.items] // clone to avoid ref bugs
    );
  };

  const handleSelected = (item: ADD_TO_CART_ITEM_DATA_TYPE) => {
    const exists = selectedCartList.some((i) => i.id === item.id);

    const updatedList = exists
      ? selectedCartList.filter((i) => i.id !== item.id)
      : [...selectedCartList, item];

    setSelectedCartList(updatedList);
  };

  const handleDeleteAll = async () => {
    setLoading(true);
    try {
      const res = await allClearCart();
      if (res.data) {
        setData(null);
        setSelectedCartList([]);
        setTotalPrice(0);
        setAddToCartCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!data || selectedCartList.length === 0) return;

    setLoading(true);
    try {
      const responses: any = await Promise.all(
        selectedCartList.map((item) => clearCart(item.id))
      );

      const newItems = data.items.filter(
        (item) => !selectedCartList.some((s) => s.id === item.id)
      );

      setData({ ...data, items: newItems });

      const lastResponse = responses.at(-1);
      setAddToCartCount(lastResponse?.data?.removeFromCart?.itemsCount ?? 0);

      setSelectedCartList([]);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  };

  // const {
  //   items,
  //   selectedIds,
  //   toggleSelect,
  //   selectAll,
  //   clearSelection,
  //   clearCart,
  //   getSelectedTotal,
  // } = useCartStore();

  if (loading) return <p>Loading...</p>;

  // const selectedTotal = getSelectedTotal();
  // const discount = selectedTotal > 5000 ? 500 : 0;
  // const finalTotal = selectedTotal - discount;

  // const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  return (
    <>
      {!data || data.items.length === 0 ? (
        <EmptyCart />
      ) : (
        <PageContainer>
          <BackBtn route="/tickets" title="Back" />

          <PageHeader
            title="Add To Cart"
            des="Complete your booking details and payment information."
          />
          <div className="flex flex-col items-start w-full gap-10 mt-10 lg:flex-row">
            <div className="lg:p-6 p-4 rounded-2xl border border-[#D9D9D9] flex-1 divide-y divide-[#D9D9D9]">
              <div className="flex items-center justify-between pb-4 lg:pb-6">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="checkbox"
                    checked={allSelected}
                    onClick={handleAllSelected}
                  />
                  <Label
                    htmlFor="checkbox"
                    className="lg:text-lg text-sm text-[#667085]"
                  >
                    Select All ({selectedCartList.length} items)
                  </Label>
                </div>
                {selectedCartList.length > 0 && (
                  <button
                    onClick={() => {
                      if (allSelected) {
                        handleDeleteAll();
                      } else {
                        handleDelete();
                      }
                    }}
                    className="flex items-center lg:gap-2 gap-1 cursor-pointer lg:px-4 py-2 px-2 rounded-[8px] hover:bg-[#FBE8E9] transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                    {/* <Typo
                    text={`${allSelected ? "Delete All" : "Delete"}`}
                    className="text-red"
                    size={isMobile ? "md" : "lg"}
                  /> */}
                    <p className="text-red-500 ">
                      {allSelected ? "Delete All" : "Delete"}
                    </p>
                  </button>
                )}
              </div>
              <div className="flex flex-col lg:gap-6 gap-4 divide-y divide-[#D9D9D9]">
                {addToCartList.map((item, i) => {
                  const totalPrice = tickeGroupedArray[i].reduce(
                    (acc, item) => {
                      return acc + item.price * item.quantity;
                    },
                    0
                  );
                  return (
                    <div className="w-full py-5" key={i}>
                      <div className="flex items-center justify-between w-full mb-3">
                        {/* <Typo
                        text={`${item[0][0].productName}`}
                        size={isMobile ? "md" : "lg"}
                        className="text-black line-clamp-1"
                        fontWeight="bold"
                      /> */}
                        <p className="text-lg line-clamp-1 font-bold">
                          {item[0][0].productName}
                        </p>
                        <p className="text-lg text-indigo-700">
                          <span className="font-normal">Total:</span>
                          <span className="font-bold">
                            THB {totalPrice.toFixed(2)}
                          </span>
                        </p>
                        {/* <div className="flex items-center gap-1">
                        <Typo
                          text="Total:"
                          size={isMobile ? "md" : "lg"}
                          className="text-primary"
                        />
                        <p>

                        </p>
                        <Typo
                          text={`B ${totalPrice.toFixed(2)}`}
                          size={isMobile ? "md" : "lg"}
                          className="text-primary"
                          fontWeight="bold"
                        />
                      </div> */}
                      </div>
                      <div className="flex flex-col w-full gap-4">
                        {item.map((d, dIndx) => (
                          <div className="w-full" key={dIndx}>
                            {/* <Typo
                            text={d[0].productOptionName}
                            size="md"
                            className="mb-2 text-primary"
                          /> */}
                            <p className="text-base text-indigo-700 mb-2">
                              {d[0].productOptionName}
                            </p>
                            <div className="flex flex-col w-full gap-5">
                              {d.map((p, index) => (
                                <div
                                  className="flex items-center justify-between gap-5 lg:gap-20"
                                  key={index}
                                >
                                  <div className="flex items-center gap-4 lg:gap-10">
                                    <Checkbox
                                      id={`checkbox-${i}`}
                                      checked={selectedCartList.some(
                                        (i) => i.id === p.id
                                      )}
                                      onClick={() => {
                                        handleSelected(p);
                                      }}
                                    />
                                    <div className="flex flex-col gap-2">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="w-6 h-6 text-primary" />
                                        <p className="text-lg">{p.visitDate}</p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Ticket className="w-6 h-6 text-indigo-600" />
                                        <p className="text-lg">
                                          {p.quantity.toString()}{" "}
                                          {p.ticketTypeName}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-xl font-bold text-indigo-700">
                                    {p.quantity.toString()}
                                  </p>
                                  <div className="flex flex-col items-end gap-3 w-32.5">
                                    <p className="text-base">THB {p.price}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-[405px] flex flex-col">
              {selectedCartList.length > 0 && (
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
                    <p className="text-white text-2xl font-bold">
                      {selectedCartList.length > 1
                        ? "Order Summary"
                        : selectedCartList[0].productName}
                    </p>
                  </div>
                  <div
                    className="absolute top-0 left-0 z-0 w-full h-full bg-indigo-600"
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
                      className="absolute bottom-0 right-0 top-0 left-0 object-cover object-bottom w-full h-full"
                    />
                  ) : (
                    <img
                      src={preFixImg(selectedCartList[0].image)}
                      alt="addToCart"
                      className="absolute object-cover object-center w-full h-full -z-10 top-0 left-0"
                    />
                  )}
                </div>
              )}

              {selectedCartList.length > 0 && (
                <div
                  className=" p-6 w-full rounded-b-2xl border-b border-r border-l border-[#D9D9D9] divide-y divide-[#D9D9D9]"
                  style={{
                    boxShadow: "4px 4px 30px 0 rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="flex flex-col gap-4 pb-4">
                    {selectedCartList.map(
                      (item: ADD_TO_CART_ITEM_DATA_TYPE) => (
                        <div
                          key={item.id + item.productId}
                          className="flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <Ticket className="w-6 h-6 " />
                            {/* <Typo text={item.productName} size="sm" /> */}
                            <p className="text-sm">{item.productOptionName}</p>
                          </div>
                          {/* <Typo
                            text={`B ${(item.price * item.quantity).toFixed(
                              2
                            )}`}
                            className=" text-primary text-end"
                            size="sm"
                          /> */}
                          <p className="text-sm text-indigo-700">
                            THB {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex flex-col gap-6 pt-4">
                    <div className="flex items-center justify-between">
                      {/* <Typo
                        text="Total Payment"
                        size="md"
                        fontWeight="bold"
                        className="text-black"
                      /> */}
                      <p className="text-base font-bold">Total Payment</p>
                      <p className="text-sm font-bold text-indigo-700">
                        THB {totalPrice.toFixed(2)}
                      </p>
                      {/* <Typo
                        text={`B ${totalPrice.toFixed(2)}`}
                        size="sm"
                        fontWeight="bold"
                        className="text-primary"
                      /> */}
                    </div>

                    <Button
                      size="lg"
                      onClick={() => {
                        navigate("/cart/checkout");
                      }}
                    >
                      Confirm Payment
                    </Button>
                    {/* text="Confirm Payment"
                      className="py-4"
                      onClick={() => router.push("/cart/checkout")}
                    /> */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </PageContainer>
      )}
    </>
  );
};

export default Cart;
