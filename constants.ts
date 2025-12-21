import { Booking, ChartDataPoint, Ticket, Voucher } from './types';

export const REVENUE_DATA: ChartDataPoint[] = [
  { name: 'Jan', value1: 45000, value2: 30000, value3: 15000 },
  { name: 'Feb', value1: 75000, value2: 38000, value3: 19000 },
  { name: 'Mar', value1: 50000, value2: 32000, value3: 16000 },
  { name: 'Apr', value1: 90000, value2: 45000, value3: 22000 },
  { name: 'May', value1: 38000, value2: 25000, value3: 12000 },
  { name: 'Jun', value1: 95000, value2: 50000, value3: 25000 },
  { name: 'Jul', value1: 85000, value2: 42000, value3: 21000 },
  { name: 'Aug', value1: 80000, value2: 39000, value3: 19000 },
  { name: 'Sep', value1: 75000, value2: 36000, value3: 18000 },
  { name: 'Oct', value1: 85000, value2: 42000, value3: 21000 },
  { name: 'Nov', value1: 75000, value2: 37000, value3: 18000 },
  { name: 'Dec', value1: 95000, value2: 50000, value3: 25000 },
];

export const TICKETS: Ticket[] = [
  {
    id: '1',
    title: '6 Nights at Amanpuri, Phuket',
    image: 'https://picsum.photos/800/400?random=1',
    description: 'For just $1,125 per night, enjoy a 6-night stay in one of our elegantly appointed rooms!',
    price: 1125,
    duration: '6 nights',
    location: 'Phuket'
  },
  {
    id: '2',
    title: '3 Nights at Marina Bay Sands',
    image: 'https://picsum.photos/800/400?random=2',
    description: 'Experience luxury at its finest with a 3-night stay including breakfast and pool access.',
    price: 850,
    duration: '3 nights',
    location: 'Singapore'
  },
  {
    id: '3',
    title: 'Safari Adventure Package',
    image: 'https://picsum.photos/800/400?random=3',
    description: 'A full day adventure exploring the wild. Includes transport, guide, and lunch.',
    price: 150,
    duration: '1 day',
    location: 'Thailand'
  },
  {
    id: '4',
    title: 'Island Hopping Tour',
    image: 'https://picsum.photos/800/400?random=4',
    description: 'Visit 5 beautiful islands in one day. Snorkeling gear and lunch buffet included.',
    price: 95,
    duration: '1 day',
    location: 'Krabi'
  },
  {
    id: '5',
    title: 'Cultural Heritage Walk',
    image: 'https://picsum.photos/800/400?random=5',
    description: 'Guided tour through the historic districts with local food tasting.',
    price: 45,
    duration: '4 hours',
    location: 'Bangkok'
  },
  {
    id: '6',
    title: 'Mountain Retreat',
    image: 'https://picsum.photos/800/400?random=6',
    description: 'Escape the city heat with a weekend in the cool mountains of Chiang Mai.',
    price: 300,
    duration: '2 nights',
    location: 'Chiang Mai'
  }
];

export const BOOKINGS: Booking[] = [
  { id: '1', package: 'Safari Park Only', country: 'Thailand', validityStart: 'Oct 1', validityEnd: 'Dec 31, 2025', sold: 150, totalSold: 50, remaining: 100, totalRemaining: 20, status: 'Active' },
  { id: '2', package: 'Ocean Park', country: 'Thailand', validityStart: 'Oct 1', validityEnd: 'Dec 31, 2025', sold: 150, totalSold: 50, remaining: 100, totalRemaining: 20, status: 'Expired' },
  { id: '3', package: 'Water Kingdom', country: 'Thailand', validityStart: 'Oct 1', validityEnd: 'Dec 31, 2025', sold: 150, totalSold: 50, remaining: 100, totalRemaining: 20, status: 'Near Expiry' },
  { id: '4', package: 'Dream Land', country: 'Singapore', validityStart: 'Oct 1', validityEnd: 'Dec 31, 2025', sold: 150, totalSold: 50, remaining: 100, totalRemaining: 20, status: 'Expired' },
  { id: '5', package: 'River Cruise', country: 'Vietnam', validityStart: 'Oct 1', validityEnd: 'Dec 31, 2025', sold: 150, totalSold: 50, remaining: 100, totalRemaining: 20, status: 'Near Expiry' },
  { id: '6', package: 'Jungle Camp', country: 'Vietnam', validityStart: 'Oct 1', validityEnd: 'Dec 31, 2025', sold: 150, totalSold: 50, remaining: 100, totalRemaining: 20, status: 'Near Expiry' },
  { id: '7', package: 'Snow World', country: 'Singapore', validityStart: 'Oct 1', validityEnd: 'Dec 31, 2025', sold: 150, totalSold: 50, remaining: 100, totalRemaining: 20, status: 'Active' },
  { id: '8', package: 'Mountain Pass', country: 'Singapore', validityStart: 'Oct 1', validityEnd: 'Dec 31, 2025', sold: 150, totalSold: 50, remaining: 100, totalRemaining: 20, status: 'Active' },
  { id: '9', package: 'Fun Park', country: 'Vietnam', validityStart: 'Oct 1', validityEnd: 'Dec 31, 2025', sold: 150, totalSold: 50, remaining: 100, totalRemaining: 20, status: 'Active' },
];

export const VOUCHERS: Voucher[] = [
  { id: '1', discount: '30% Off', description: 'Enjoy 30% off with a min amount of Baht 600!', minAmount: 600, expiry: '22.08.2022', status: 'Active', bgColor: 'bg-indigo-600' },
  { id: '2', discount: '30% Off', description: 'Enjoy 30% off with a min amount of Baht 600!', minAmount: 600, expiry: '22.08.2022', status: 'Active', bgColor: 'bg-indigo-600' },
  { id: '3', discount: '30% Off', description: 'Enjoy 30% off with a min amount of Baht 600!', minAmount: 600, expiry: 'Expired', status: 'Expired', bgColor: 'bg-indigo-500' },
  { id: '4', discount: '30% Off', description: 'Enjoy 30% off with a min amount of Baht 600!', minAmount: 600, expiry: 'Expired', status: 'Expired', bgColor: 'bg-indigo-500' },
];
