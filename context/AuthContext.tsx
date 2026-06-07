import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';
import { clearAuth, getStoredUser, getToken, setStoredUser, setToken } from '@/lib/storage';
import type { User } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const stored = await getStoredUser<User>();
        if (stored) setUser(stored);
      } catch (e) {
        console.error('Failed to restore session:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await authAPI.login({ email, password });
    if (!data?.data?.token || !data?.data?.user) {
      throw new Error('Response server tidak valid');
    }
    await setToken(data.data.token);
    await setStoredUser(data.data.user);
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const register = useCallback(async (payload: { name: string; email: string; password: string; phone?: string }) => {
    const { data } = await authAPI.register(payload);
    if (!data?.data?.token || !data?.data?.user) {
      throw new Error('Response server tidak valid');
    }
    await setToken(data.data.token);
    await setStoredUser(data.data.user);
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const logout = useCallback(async () => {
    await clearAuth();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
