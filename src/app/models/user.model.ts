export interface User {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}
