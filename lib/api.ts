import axios from 'axios';
import { getToken, clearAuth } from './storage';
import type { User, Report, Category, Pagination, Comment } from './types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3004';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const isAuthRequest = err.config?.url?.includes('/auth/login') || err.config?.url?.includes('/auth/register');
    if (err.response?.status === 401 && !isAuthRequest) {
      await clearAuth();
    }
    return Promise.reject(err);
  }
);

export function imageUrl(path?: string) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ListResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', data),
  me: () => api.get<ApiResponse<User>>('/auth/me'),
};

export const reportsAPI = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<ListResponse<Report>>('/reports', { params }),
  getOne: (id: number | string) =>
    api.get<ApiResponse<Report>>(`/reports/${id}`),
  create: (data: FormData) =>
    api.post('/reports', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateStatus: (id: number | string, data: { status: string; admin_note?: string }) =>
    api.patch(`/reports/${id}/status`, data),
  remove: (id: number | string) => api.delete(`/reports/${id}`),
};

export const categoriesAPI = {
  getAll: () => api.get<ApiResponse<Category[]>>('/categories'),
};

export const commentsAPI = {
  create: (data: { report_id: number; content: string }) =>
    api.post<ApiResponse<Comment>>('/comments', data),
  remove: (id: number) => api.delete(`/comments/${id}`),
};

export const aiAPI = {
  chat: (messages: { role: string; content: string }[]) =>
    api.post<ApiResponse<{ message: string; form_data?: Record<string, unknown> }>>('/ai/chat', { messages }),
  categorize: (data: { title: string; description: string }) =>
    api.post<ApiResponse<{ category_id: number; category_name: string; reason: string }>>('/ai/categorize', data),
};
