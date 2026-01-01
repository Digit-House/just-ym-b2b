export interface CartItemT {
    id: string;
    productId: string;
    productName: string;
    date: string;
    ticketTypes: {
      id: string;
      name: string;
      quantity: number;
      price: number;
    }[];
  }