export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: Category;
  createdAt?: string;
  updatedAt?: string;
} 