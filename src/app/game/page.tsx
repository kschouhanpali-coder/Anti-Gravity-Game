'use client';

import { useEffect, useState } from 'react';
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
  const { user, profile, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user || !profile) {
    return <div className="min-h-screen bg-brand-bg flex items-center justify-center font-press-start text-white">LOADING...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black overflow-hidden relative">
      <Navbar />
      <GameEngine userProfile={profile} />
    </div>
  );
}
