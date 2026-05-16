'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';

// Dynamically import GameEngine to avoid SSR issues with canvas
const GameEngine = dynamic(() => import('@/components/game/GameEngine'), {
  ssr: false,
  loading: () => <div className="flex-1 flex items-center justify-center font-press-start text-white">INITIALIZING ENGINE...</div>
});

export default function GamePage() {
  const { user, profile, loading, profileLoading, fetchProfile, createProfile } = useAuthStore();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Auto-create profile if user is authenticated but has no profile row yet
  useEffect(() => {
    if (!loading && user && !profile && !profileLoading) {
      const autoCreateProfile = async () => {
        try {
          // Try fetching once more in case it was a timing issue
          await fetchProfile(user.id);
          // If still null, create a new profile row
          const { profile: refreshed } = useAuthStore.getState();
          if (!refreshed) {
            await createProfile({
              uid: user.id,
              username: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Player',
              avatar: user.user_metadata?.avatar_url || null,
              highScore: 0,
              totalRuns: 0,
            });
          }
        } catch (err) {
          console.error('Failed to auto-create profile:', err);
        }
      };
      autoCreateProfile();
    }
  }, [loading, user, profile, profileLoading, fetchProfile, createProfile]);

  // Show loading while auth or profile is resolving
  if (loading || !user || profileLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-neon-purple border-t-transparent rounded-full animate-spin" />
        <p className="font-press-start text-[10px] text-gray-400 animate-pulse">
          {loading ? 'AUTHENTICATING...' : 'LOADING PROFILE...'}
        </p>
      </div>
    );
  }

  // Profile failed to load / create — give user an escape hatch
  if (!profile) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center gap-6 font-press-start">
        <p className="text-red-400 text-xs">PROFILE SYNC FAILED</p>
        <button
          onClick={() => window.location.reload()}
          className="text-[10px] text-white border border-white/20 px-6 py-3 rounded-lg hover:bg-white/10 transition"
        >
          RETRY
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black overflow-hidden relative">
      <Navbar />
      <GameEngine userProfile={profile} />
    </div>
  );
}
