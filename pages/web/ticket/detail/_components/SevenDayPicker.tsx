import { useEffect, useState } from "react";
import { addDays, format, isBefore, isSameDay } from "date-fns";
import { ProductInfoT } from "@/types/product.type";
import DatePicker from "./DatePicker";

type SevenDayPickerProps = {
  pickedDate: Date;
  setPickedDate: (date: Date) => void;
  product: ProductInfoT | null;
};

const SevenDayPicker = ({
  pickedDate,
  setPickedDate,
  product,
}: SevenDayPickerProps) => {
  const today = new Date();
  const todayLocal = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const [selectedDate, setSelectedDate] = useState<Date>(todayLocal);
  const [dayList, setDayList] = useState<Date[]>([]);
  const [blockedDate, setBlockedDate] = useState<Date[]>([]);

  useEffect(() => {
    const days = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i));
    setDayList(days);
  }, [selectedDate]);

  // Only re-center the 7-day window when the picked date falls outside
  // the currently visible days; otherwise keep the window (and today) in view.
  const handleWindowAnchor = (date: Date) => {
    setSelectedDate((prev) => {
      const currentWindow = Array.from({ length: 7 }, (_, i) => addDays(prev, i));
      const alreadyVisible = currentWindow.some((d) => isSameDay(d, date));
      return alreadyVisible ? prev : date;
    });
  };

  useEffect(() => {
    if (!product) return;
    const normalized =
      product.blockedDate?.map((item) => {
        const d = new Date(item.date);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      }) ?? [];

    setBlockedDate(normalized);
  }, [product]);

  useEffect(() => {
    if (!product) return;

    let startDay = todayLocal;

    if (product.productOptions[0]?.advanceBooking?.day) {
      startDay = addDays(
        todayLocal,
        product.productOptions[0].advanceBooking.day
      );
    }

    const normalizedBlocked =
      product.blockedDate?.map((item) => {
        const d = new Date(item.date);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      }) ?? [];

    // Find the first available day (not blocked)
    let firstAvailable = startDay;
    const maxSearch = 30;

    for (let i = 0; i < maxSearch; i++) {
      const candidate = addDays(startDay, i);
      const isBlocked = normalizedBlocked.some((b) => isSameDay(b, candidate));

      if (!isBlocked) {
        firstAvailable = candidate;
        break;
      }
    }

    setSelectedDate(firstAvailable);
    setPickedDate(firstAvailable);
  }, [product]);

  return (
    <div className="w-full">
      <h5 className="mb-3">Select Date</h5>
      <div className="flex overflow-x-auto gap-2 sm:gap-3 pb-2 scrollbar-hide">
        {dayList.map((d, i) => {
          const isSelected =
            pickedDate &&
            format(pickedDate, "yyyy-MM-dd") === format(d, "yyyy-MM-dd");

          const isDisable =
            blockedDate.some((b) => isSameDay(b, d)) ||
            isBefore(d, todayLocal);

          return (
            <button
              key={i}
              disabled={isDisable}
              className={`flex-shrink-0 flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 w-16 sm:w-20 py-3 sm:py-4 rounded-2xl text-xs sm:text-sm ${
                isSelected
                  ? "bg-[#F0EBF8] border border-[#673AB7]"
                  : isDisable
                  ? "text-[#21212140]/25 cursor-not-allowed"
                  : "text-gray-600"
              }`}
              onClick={() => setPickedDate(d)}
            >
              <span className="font-medium">{format(d, "EEE")}</span>
              <span>{format(d, "MMM d")}</span>
              <span
                className={`px-2 py-0.5 rounded-2xl text-xs ${
                  isDisable ? "bg-[#21212114]" : "bg-[#C4E9C7]"
                }`}
              >
                {format(d, "yyyy")}
              </span>
            </button>
          );
        })}
        <div className="flex-shrink-0">
          <DatePicker
            selectedDate={selectedDate}
            setSelectedDate={handleWindowAnchor}
            ticketDetail={product}
            setPickedDate={setPickedDate}
          />
        </div>
      </div>
    </div>
  );
};

export default SevenDayPicker;

// import { useEffect, useState } from "react";
// import { addDays, format, isBefore, isSameDay } from "date-fns";
// import { ProductInfoT } from "@/types/product.type";
// import DatePicker from "./DatePicker";

// type SevenDayPickerProps = {
//   pickedDate: Date;
//   setPickedDate: (date: Date) => void;
//   product: ProductInfoT | null;
// };

// const SevenDayPicker = ({
//   pickedDate,
//   setPickedDate,
//   product,
// }: SevenDayPickerProps) => {
//   const today = new Date();
//   const todayLocal = new Date(
//   today.getFullYear(),
//   today.getMonth(),
//   today.getDate()
// );
//   // const tomorrow = addDays(today, 1);
//   const [selectedDate, setSelectedDate] = useState<Date>(today);
//   const [dayList, setDayList] = useState<Date[]>([]);
//   const [blockedDate, setBlockedDate] = useState<Date[]>([]);

//   useEffect(() => {
//     const days = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i));
//     setDayList(days);
//   }, [selectedDate]);

//   useEffect(() => {
//     if (!product) return;
//     const normalized =
//       product.blockedDate?.map((item) => {
//         const d = new Date(item.date); // UTC date
//         // convert to local day (remove timezone)
//         return new Date(d.getFullYear(), d.getMonth(), d.getDate());
//       }) ?? [];

//     setBlockedDate(normalized);
//   }, [product]);

//   useEffect(() => {
//     if (!product) return;
//     let selectDay = today;
//     if (product.productOptions[0]?.advanceBooking?.day) {
//       selectDay = addDays(
//         selectedDate,
//         product.productOptions[0]?.advanceBooking?.day
//       );
//     } else {
//       selectDay = today;
//     }
//     setSelectedDate(selectDay);
//     setPickedDate(selectDay);
//   }, [product]);

//   return (
//     <div className="w-full">
//       <h5 className="mb-3">Select Date</h5>
//       <div className="flex overflow-x-auto gap-2 sm:gap-3 pb-2 scrollbar-hide">
//         {dayList.map((d, i) => {
//           const isSelected =
//             pickedDate &&
//             format(pickedDate, "yyyy-MM-dd") === format(d, "yyyy-MM-dd");

//           const isDisable = blockedDate.some((b) => isSameDay(b, d)) || isBefore(d,todayLocal) || isSameDay(d,todayLocal);
//           return (
//             <button
//               key={i}
//               className={`flex-shrink-0 flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 w-16 sm:w-20 py-3 sm:py-4 rounded-2xl text-xs sm:text-sm ${
//                 isSelected
//                   ? "bg-[#F0EBF8] border border-[#673AB7]"
//                   : isDisable
//                   ? "text-[#21212166]"
//                   : "text-gray-600"
//               }`}
//               disabled={isDisable}
//               onClick={() => setPickedDate(d)}
//             >
//               <span className="font-medium">{format(d, "EEE")}</span>
//               <span>{format(d, "MMM d")}</span>
//               <span
//                 className={`px-2 py-0.5 rounded-2xl text-xs ${
//                   isDisable ? "bg-[#21212108]/30" : "bg-[#C4E9C7]"
//                 }`}
//               >
//                 {format(d, "yyyy")}
//               </span>
//             </button>
//           );
//         })}
//         <div className="flex-shrink-0">
//           <DatePicker
//             selectedDate={selectedDate}
//             setSelectedDate={setSelectedDate}
//             ticketDetail={product}
//             setPickedDate={setPickedDate}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SevenDayPicker;



// <div className="w-full ">
    //   <h5 className="mb-3">Select Date</h5>
    //   <div className="grid grid-cols-8 w-full gap-5 ">
    //     {dayList.map((d, i) => {
    //       const isSelected =
    //         pickedDate &&
    //         format(pickedDate, "yyyy-MM-dd") === format(d, "yyyy-MM-dd");

    //       const isDisable = blockedDate.some((b) => isSameDay(b, d));
    //       return (
    //         <button
    //           key={i}
    //           className={`w-full h-full col-span-1 flex flex-col items-center justify-center text-center gap-3 py-4 rounded-2xl text-sm ${
    //             isSelected
    //               ? "bg-[#F0EBF8] border border-[#673AB7] "
    //               : isDisable
    //               ? " text-[#21212140]/25"
    //               : " text-gray-600"
    //           }`}
    //           onClick={() => setPickedDate(d)}
    //         >
    //           <span>{format(d, "EEE")}</span>
    //           <span>{format(d, "MMM d")}</span>
    //           <span
    //             className={`px-3 py-0.5 rounded-2xl   ${
    //               isDisable ? "bg-[#21212108]/30" : " bg-[#C4E9C7]"
    //             }`}
    //           >
    //             {format(d, "yyyy")}
    //           </span>
    //         </button>
    //       );
    //     })}
    //     <DatePicker
    //       selectedDate={selectedDate}
    //       setSelectedDate={setSelectedDate}
    //       ticketDetail={product}
    //       setPickedDate={setPickedDate}
    //     />
    //   </div>
    // </div>