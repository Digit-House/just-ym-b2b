export type UserRoleTypeT = "OWNER" | "RESELLER" | "USER" | "ADMIN" | "MANAGER";
export type UserStatusT = "Active" | "Inactive";

export type ProfileDataT = {
  dateOfBirth: string;
  email: string;
  firstName: string;
  gender: string;
  lastName: string;
  nationality: string;
  phoneNumber: string;
  profilePicture: string;
};

export type UserT = {
  active: boolean;
  contactNo: string;
  countryCode: string;
  createdAt: string;
  email: string;
  id: string;
  imageURI: string;
  lastLogin: string;
  profileData: ProfileDataT;
  roleIds: string[];
  type: UserRoleTypeT;
  updatedAt: string;
  username: string;
};

export interface UserRolesFilterT {
  page: number;
  limit: number;
  orderBy: {
    dir: string;
  };
  resellerId: string | null;
}




export interface UserRoleT {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  role: UserRoleTypeT;
  status: UserStatusT;
  bookings: number;
  lastBooking: string;
  avatarColor: string;
  createdAt: string;
  description: string;
  resellerId: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  moq: number;
  stock: number;
  image: string;
  description: string;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  itemsCount: number;
}

export interface InventoryStats {
  name: string;
  stock: number;
  demand: number;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: Date;
}
