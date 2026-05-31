import { create } from 'zustand';
import api from './api';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  companyId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<User>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

async function fetchUser(token: string): Promise<User | null> {
  try {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    const { data } = await api.get('/auth/me');
    const user: User = {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      companyId: data.companyId,
    };
    return user;
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common.Authorization;
    return null;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: true,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.accessToken);
    const user = await fetchUser(data.accessToken);
    if (!user) throw new Error('Failed to load user profile');
    set({ user, token: data.accessToken, loading: false });
    return user;
  },

  register: async (email, password, firstName, lastName) => {
    const { data } = await api.post('/auth/register', { email, password, firstName, lastName });
    localStorage.setItem('token', data.accessToken);
    const user = await fetchUser(data.accessToken);
    if (!user) throw new Error('Failed to load user profile');
    set({ user, token: data.accessToken, loading: false });
    return user;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common.Authorization;
    set({ user: null, token: null, loading: false });
  },

  loadUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ loading: false });
        return;
      }
      const user = await fetchUser(token);
      if (user) {
        set({ user, token, loading: false });
      } else {
        set({ loading: false });
      }
    } catch {
      set({ loading: false });
    }
  },
}));
