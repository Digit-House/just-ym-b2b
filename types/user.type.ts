export type UserRoleTypeT =
  | "OWNER"
  | "RESELLER"
  | "USER"
  | "ADMIN"
  | "MANAGER"
  | null;
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
  roles: {
    id: string;
    name: string;
  }[];
  type: UserRoleTypeT;
  updatedAt: string;
  username: string;
};

export type UserChangePasswordT = {
  newPassword:string;
  oldPassword:string;
}

export interface UserRolesFilterT {
  active: null | boolean;
  limit: number;
  orderBy: {
    dir: string;
  };
  page: number;
  resellerId: null | string;
  type: UserRoleTypeT;
}

export interface UserManagementT {
  id: string;
  activeCount: number;
  adminCount: number;
  userCount: number;
  total: number;
  active: boolean;
  contactNo: null | string;
  createdAt: string;
  email: string;
  lastLogin: string;
  roleIds: string[];
  resellerId: null | string;
  type: UserRoleTypeT;
  roles: { id: string; name: string; resellerId: string; createdAt: string }[];
  updatedAt: string;
  username: string;
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
