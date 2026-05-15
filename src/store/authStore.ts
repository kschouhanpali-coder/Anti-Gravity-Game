import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { UserService, UserRow, UserInsert } from '@/services/userService';

interface AuthState {
  user: User | null;
  profile: UserRow | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  fetchProfile: (uid: string) => Promise<void>;
  createProfile: (profile: UserInsert) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  fetchProfile: async (uid: string) => {
    try {
      const data = await UserService.getProfile(uid);
      set({ profile: data });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      set({ profile: null });
    }
  },
  createProfile: async (profile: UserInsert) => {
    try {
      const data = await UserService.upsertProfile(profile);
      if (data) set({ profile: data });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },
}));
