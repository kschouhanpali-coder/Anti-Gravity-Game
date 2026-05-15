'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, fetchProfile } = useAuthStore();

  useEffect(() => {
    // Initial fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ?? null;
      setUser(user);
      if (user) {
        fetchProfile(user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        setUser(user);
        if (user) {
          await fetchProfile(user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser, fetchProfile]);

  return <>{children}</>;
}
