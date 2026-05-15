'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Dashboard() {
  const { user, profile, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-press-start bg-brand-bg text-white">LOADING...</div>;
  }

  if (!user || !profile) {
    return null; // will redirect
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050510] relative">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-brand-neon-purple/5 blur-[120px] rounded-full"></div>
      </div>
      <Navbar />
      
      <main className="flex-1 p-6 md:p-12 z-10 max-w-5xl w-full mx-auto relative">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-neon-purple to-brand-accent rounded-full blur opacity-70 group-hover:opacity-100 transition duration-500"></div>
            <div className="w-32 h-32 rounded-full bg-gray-900 border-2 border-white/10 p-1 relative z-10 overflow-hidden">
              <img src={profile.avatar || ''} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
               <span className="font-press-start text-[8px] text-gray-500">DASHBOARD</span>
            </div>
            <h1 className="font-press-start text-4xl md:text-5xl text-white mb-2 neon-text tracking-tighter">{profile.username}</h1>
            <div className="flex gap-4">
              <span className="font-inter text-gray-500 text-sm">SECURED ACCESS</span>
              <span className="text-brand-neon-purple font-press-start text-[8px] mt-1">● ONLINE</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-black/40 border border-white/5 p-8 rounded-2xl backdrop-blur-xl relative overflow-hidden group hover:border-brand-accent/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-press-start">TOP</div>
            <h3 className="font-press-start text-[10px] text-gray-500 mb-6 tracking-widest">HIGH SCORE</h3>
            <p className="font-press-start text-5xl text-brand-accent drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">{(profile.highScore ?? 0).toLocaleString()}</p>
            <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-brand-accent w-[70%] animate-pulse"></div>
            </div>
          </div>
          
          <div className="bg-black/40 border border-white/5 p-8 rounded-2xl backdrop-blur-xl relative overflow-hidden group hover:border-brand-neon-purple/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-press-start">RUN</div>
            <h3 className="font-press-start text-[10px] text-gray-500 mb-6 tracking-widest">TOTAL RUNS</h3>
            <p className="font-press-start text-5xl text-brand-neon-purple drop-shadow-[0_0_15px_rgba(178,75,243,0.3)]">{(profile.totalRuns ?? 0).toLocaleString()}</p>
            <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-brand-neon-purple w-[40%] animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <Link href="/game" className="group relative w-full max-w-md">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-neon-purple to-brand-accent rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative font-press-start text-xl bg-black text-white px-12 py-8 rounded-xl flex items-center justify-center gap-4 group-hover:text-brand-accent transition-colors">
              LAUNCH MISSION
              <span className="animate-bounce">→</span>
            </div>
          </Link>
          <p className="font-press-start text-[8px] text-gray-600 tracking-widest">READY FOR DEPLOYMENT</p>
        </div>
      </main>
    </div>
  );
}
