export interface Order {
  _id?: string;
  id?: string;
  orderNumber?: string;
  customer?: string;
  email?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
  status: string;
  totalPrice?: number;
  total?: number;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  books?: {
    title: string;
    image: string;
    price: number;
    quantity: number;
    language: string;
  }[];
  
  // Add index signature to allow string indexing
  [key: string]: any;
}