import { create } from 'zustand';
import { authAPI, profilesAPI } from '../lib/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }
    
    try {
      const response = await authAPI.getMe();
      set({
        user: response.data.data.user,
        profile: response.data.data.profile,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem('token');
      set({ isLoading: false, isAuthenticated: false });
    }
  },
  
  login: async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { token, ...userData } = response.data.data;
    localStorage.setItem('token', token);
    
    // Fetch full user data
    const meResponse = await authAPI.getMe();
    set({
      user: meResponse.data.data.user,
      profile: meResponse.data.data.profile,
      isAuthenticated: true,
    });
    
    return response.data;
  },
  
  register: async (email, password) => {
    const response = await authAPI.register({ email, password });
    const { token, ...userData } = response.data.data;
    localStorage.setItem('token', token);
    
    set({
      user: { _id: userData._id, email: userData.email },
      profile: null,
      isAuthenticated: true,
    });
    
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
    });
  },
  
  updateProfile: async (data) => {
    const response = await profilesAPI.update(data);
    set({ profile: response.data.data });
    return response.data;
  },
  
  createProfile: async (data) => {
    const response = await profilesAPI.create(data);
    set({ profile: response.data.data });
    return response.data;
  },
  
  deleteAccount: async (password) => {
    await authAPI.deleteAccount({ password });
    localStorage.removeItem('token');
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
    });
  },
  
  setProfile: (profile) => {
    set({ profile });
  },
}));
