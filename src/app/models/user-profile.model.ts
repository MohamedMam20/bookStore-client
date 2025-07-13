export interface UserProfile {
  _id:       string;
  firstName: string;
  lastName?: string;
  email:     string;
  role:      'user' | 'admin';
}

