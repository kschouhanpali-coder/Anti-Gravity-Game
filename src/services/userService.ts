import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';

export type UserRow = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export const UserService = {
  /**
   * Fetch a user profile by UID
   */
  async getProfile(uid: string): Promise<UserRow | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('uid', uid)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return data;
  },

  /**
   * Create or update a user profile
   */
  async upsertProfile(profile: UserInsert): Promise<UserRow | null> {
    const { data, error } = await supabase
      .from('users')
      .upsert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update specific fields for a user profile
   */
  async updateProfile(uid: string, updates: UserUpdate): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('uid', uid);

    if (error) throw error;
  },

  /**
   * Get the global leaderboard
   */
  async getLeaderboard(limit: number = 100): Promise<UserRow[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('highScore', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
};
