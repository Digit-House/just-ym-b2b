export interface Ticket {
  id: string;
  title: string;
  image: string;
  description: string;
  price: number;
  duration: string;
  location: string;
}

export interface Booking {
  id: string;
  package: string;
  country: string;
  validityStart: string;
  validityEnd: string;
  sold: number;
  totalSold: number;
  remaining: number;
  totalRemaining: number;
  status: 'Active' | 'Expired' | 'Near Expiry';
}

export interface Voucher {
  id: string;
  discount: string;
  description: string;
  minAmount: number;
  expiry: string;
  status: 'Active' | 'Expired' | 'Used';
  bgColor: string;
}

export interface ChartDataPoint {
  name: string;
  value1: number;
  value2: number;
  value3?: number;
}
