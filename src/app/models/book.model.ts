export interface Book {
  _id: string;
  title: string;
  author?: string;
  price?: number;
  description?: string;
  authorDescription?: string;
  category?: {
    _id: string;
    name: string;
  };
  stock?: {
    ar?: number;
    en?: number;
    fr?: number;
  };
  image?: string;
  reviews?: string[];
  user?: string;
  createdAt?: string;
  updatedAt?: string;
  slug: string;
}
