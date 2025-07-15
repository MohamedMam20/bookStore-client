export interface Category {
  _id?: string;
  name: string;
  description?: string;
  slug?: string;
  parentCategory?: string | Category | null;
  createdBy?: string | any;
  createdAt?: Date;
  updatedAt?: Date;
} 