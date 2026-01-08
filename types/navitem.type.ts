import {
  Atom,
  BarChart3,
  Building2,
  ChartBarStacked,
  HatGlasses,
  Home,
  LayoutGrid,
  Settings,
  SquareStop,
  Ticket,
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

export const navConfig: NavItem[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: Home,
    types: "ALL",
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
    icon: LayoutGrid,
    types: ["RESELLER"],
  },
  {
    label: "Wallet",
    path: "/wallet",
    icon: Wallet,
    types: "ALL",
  },
  {
    label: "Users Management",
    path: "/users",
    icon: Users2,
    types: "ALL",
  },
  {
    label: "Reports",
    path: "/reports",
    icon: BarChart3,
    types: ["RESELLER"],
  },

  // ADMIN ONLY
  {
    label: "Topup",
    path: "/topup",
    icon: SquareStop,
    types: ["OWNER"],
  },
  {
    label: "Payment",
    path: "/paymentMethods",
    icon: SquareStop,
    types: ["OWNER"],
  },
  {
    label: "Roles",
    path: "/roles",
    icon: HatGlasses,
    types: ["OWNER"],
  },
  {
    label: "Resellers",
    path: "/resellers",
    icon: HatGlasses,
    types: ["OWNER"],
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

  // SETTINGS (USER ONLY)
  {
    label: "Setting",
    icon: Settings,
    types: ["RESELLER"],
    children: [
      {
        label: "General Setting",
        path: "/settings/general",
        types: ["RESELLER"],
      },
      {
        label: "KYC Setting",
        path: "/settings/kyc",
        types: ["RESELLER"],
      },
    ],
  },
];
