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
  roleIds:string[];
  type:"OWNER"|"RESELLER"|"USER",
  updatedAt:string;
  username:string;
};


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
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  itemsCount: number;
}

export interface InventoryStats {
  name: string;
  stock: number;
  demand: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type UserRole = 'Admin' | 'Manager' | 'Member';
export type UserStatus = 'Active' | 'Inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  role: UserRole;
  status: UserStatus;
  bookings: number;
  lastBooking: string;
  avatarColor: string;
}
