import { Product, User } from "@/types/user.type";



export const MOCK_USERS: User[] = [
  {
    id: 'U1',
    name: 'John Carter',
    email: 'john.carter@company.com',
    phone: '+1 (555) 123-4567',
    joinedDate: '1/15/2024',
    role: 'Admin',
    status: 'Active',
    bookings: 45,
    lastBooking: '12/30/2024',
    avatarColor: 'bg-indigo-100 text-indigo-700'
  },
  {
    id: 'U2',
    name: 'Sarah',
    email: 'sarah@company.com',
    phone: '+1 (555) 123-4567',
    joinedDate: '1/15/2024',
    role: 'Manager',
    status: 'Active',
    bookings: 35,
    lastBooking: '12/30/2024',
    avatarColor: 'bg-purple-100 text-purple-700'
  },
  {
    id: 'U3',
    name: 'Taylor',
    email: 'taylor@company.com',
    phone: '+1 (555) 123-4567',
    joinedDate: '1/15/2024',
    role: 'Member',
    status: 'Active',
    bookings: 24,
    lastBooking: '12/30/2024',
    avatarColor: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'U4',
    name: 'Mia',
    email: 'mia@company.com',
    phone: '+1 (555) 123-4567',
    joinedDate: '1/15/2024',
    role: 'Member',
    status: 'Inactive',
    bookings: 18,
    lastBooking: '12/30/2024',
    avatarColor: 'bg-pink-100 text-pink-700'
  }
];


export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'tickets', label: 'Tickets', icon: 'Ticket' },
  { id: 'bookings', label: 'My Bookings', icon: 'CalendarDays' },
  { id: 'wallet', label: 'Wallet', icon: 'Wallet' },
  { id: 'users', label: 'Users Management', icon: 'Users' },
  { id: 'reports', label: 'Reports', icon: 'BarChart3' },
  { id: 'setting', label: 'Setting', icon: 'Settings' },
];
