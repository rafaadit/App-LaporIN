export type UserRole = 'user' | 'admin' | 'super_admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface Report {
  id: number;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'resolved';
  category_id: number;
  category_name: string;
  user_id: number;
  user_name: string;
  thumbnail?: string;
  admin_note?: string;
  created_at: string;
  images?: { id: number; image_url: string }[];
  comments?: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  user_name: string;
  user_id: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface ChatFormData {
  title?: string;
  description?: string;
  location?: string;
  category_id?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
