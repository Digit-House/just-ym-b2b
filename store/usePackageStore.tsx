import { VISIT_DATE_TYPE } from "@/types/booking.type";
import {
  EVENT_AVAILABLE_DATA_TYPE,
  ProductOptionQuestionT,
  QusetionT,
  VisitDateT,
} from "@/types/product.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface EVENT_DATA_TYPE {
  eventId: string | number;
  eventTime: string;
  id: string;
}

export interface PACKAGE_ITEM_DATA_TYPE {
  name: string;
  questions: ProductOptionQuestionT[];
  isCapacity: boolean;
  id: string;
  questionList: QusetionT[][];
  visitDateSettings: VISIT_DATE_TYPE | null;
  isVisitDate: boolean;
  eventTime: EVENT_DATA_TYPE | null;
  eventList: EVENT_AVAILABLE_DATA_TYPE[];
  ageFrom: number | null;
  ageTo: number | null;
}

export interface PACKAGE_DATA_TYPE {
  ticketTypeId: string;
  visitDate: string | null;
  cartItemId: string | null;
  eventId: null | string;
  eventTime: string | null;
  quantity: number;
  packageItems: PACKAGE_ITEM_DATA_TYPE[];
  variantName: string;
}

type PackageStore = {
  _hasHydrated: boolean;
  packageList: PACKAGE_DATA_TYPE[];
  setPackageList: (packageList: PACKAGE_DATA_TYPE[]) => void;
};

const usePackageStore = create<PackageStore>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      packageList: [],
      setPackageList: (packageList: PACKAGE_DATA_TYPE[]) =>
        set(() => ({ packageList })),
    }),
    {
      name: "packageStore",
      onRehydrateStorage: () => (state: any) => {
        state._hasHydrated = true;
      },
      partialize: (state) => ({
        packageList: state.packageList,
      }),
    }
  )
);

export default usePackageStore;
