import {
  Atom,
  BarChart3,
  Building2,
  ChartBarStacked,
  CreditCard,
  Currency,
  DollarSign,
  FileText,
  HatGlasses,
  Home,
  LayoutGrid,
  Settings,
  Ticket,
  UserPlus,
  UserRoundCog,
  Users2,
  Wallet,
} from "lucide-react";
import { USER_TYPE } from "./role.type";

export type NavItem = {
  label: string;
  path?: string;
  icon?: any;
  types: USER_TYPE[] | "ALL";
  children?: NavItem[];
};

export const NAV_CONFIG: NavItem[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: Home,
    types: "ALL",
  },
  {
    label: "Categories",
    path: "/categories",
    icon: ChartBarStacked,
    types: ["OWNER"],
  },
  {
    label: "Countries",
    path: "/countries",
    icon: Atom,
    types: ["OWNER"],
  },
  {
    label: "Cities",
    path: "/cities",
    icon: Building2,
    types: ["OWNER"],
  },
  {
    label: "Tickets",
    path: "/tickets",
    icon: Ticket,
    types: "ALL",
  },
  {
    label: "My Bookings",
    path: "/bookings",
    icon: FileText,
    types: "ALL",
  },
  {
    label: "Vouchers",
    path: "/vouchers",
    icon: Ticket,
    types: ["OWNER"],
  },
  {
    label: "Wallet",
    path: "/wallet",
    icon: Wallet,
    types: ["RESELLER"],
  },
  {
    label: "Reports",
    path: "/reports",
    icon: BarChart3,
    types: "ALL",
  },

  {
    label: "Currency Rate",
    path: "/currencyRate",
    icon: Currency,
    types: ["OWNER"],
  },
  {
    label: "Resellers",
    path: "/resellers",
    icon: UserPlus,
    types: ["OWNER"],
  },
  {
    label: "Topup",
    path: "/topup",
    icon: DollarSign,
    types: ["OWNER"],
  },
  {
    label: "Payment",
    path: "/paymentMethods",
    icon: CreditCard,
    types: ["OWNER"],
  },
  {
    label: "Roles",
    path: "/roles",
    icon: UserRoundCog,
    types: ["OWNER"],
  },
  {
    label: "Users Management",
    path: "/users",
    icon: Users2,
    types: "ALL",
  },

  // SETTINGS (USER ONLY)
  {
    label: "Setting",
    path: "/settings/general",
    icon: Settings,
    types: ["RESELLER"],
    // children: [
    //   {
    //     label: "General Setting",
    //     path: "/settings/general",
    //     types: ["RESELLER"],
    //   },
    //   {
    //     label: "KYC Setting",
    //     path: "/settings/kyc",
    //     types: ["RESELLER"],
    //   },
    // ],
  },
];
