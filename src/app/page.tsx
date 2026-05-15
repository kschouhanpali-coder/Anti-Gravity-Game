'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { UserService, UserRow } from '@/services/userService';

export default function Home() {
  const [leaderboard, setLeaderboard] = useState<UserRow[]>([]);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const data = await UserService.getLeaderboard(5);
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard', error);
      }
    };
    fetchTopPlayers();
  }, []);

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden bg-[#050510]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-neon-purple/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-accent/10 blur-[120px] rounded-full"></div>
      </div>
      
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 relative">
        <div className="mb-4 bg-brand-neon-purple/10 border border-brand-neon-purple/30 px-4 py-1 rounded-full">
          <span className="font-press-start text-[10px] text-brand-neon-purple animate-pulse">SYSTEM ONLINE</span>
        </div>
        
        <h1 className="font-press-start text-5xl md:text-8xl text-center mb-8 neon-text tracking-tighter leading-[0.9]">
          ANTI<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon-purple to-brand-accent">GRAVITY</span>
        </h1>
        
        <p className="font-inter text-lg md:text-xl text-gray-400 max-w-2xl text-center mb-12 leading-relaxed">
          Invert physics. Defy the void. Navigate through a high-velocity celestial obstacle course where up is down and survival is a choice.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 mb-20">
          <Link href="/game" className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-neon-purple to-brand-accent rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative font-press-start text-sm bg-black text-white px-10 py-5 rounded-lg hover:text-brand-accent transition-colors">
              PLAY NOW
            </div>
          </Link>
          
          <Link href="/leaderboard" className="font-press-start text-xs text-gray-500 border border-white/10 px-10 py-5 rounded-lg hover:bg-white/5 hover:text-white transition-all flex items-center justify-center">
            LEADERBOARD
          </Link>
        </div>
        
        <div className="w-full max-w-4xl bg-black/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-bg px-6 py-1 border border-white/10 rounded-full">
             <h2 className="font-press-start text-[10px] text-brand-accent">ELITE JUMPERS</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {leaderboard.length > 0 ? leaderboard.map((player, idx) => (
              <div key={player.uid} className="flex flex-col items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-brand-neon-purple/50 transition-all group">
                <div className="relative mb-3">
                  <div className="absolute -inset-1 bg-brand-neon-purple rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity"></div>
                  <div className="w-16 h-16 rounded-full bg-gray-900 border-2 border-white/10 overflow-hidden relative z-10">
                    {player.avatar ? <img src={player.avatar} alt="avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">👾</div>}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-brand-neon-purple text-white w-6 h-6 rounded-full flex items-center justify-center font-press-start text-[8px] z-20 border-2 border-black">
                    {idx + 1}
                  </div>
                </div>
                <span className="font-inter font-bold text-sm text-gray-200 truncate w-full text-center">{player.username}</span>
                <span className="font-press-start text-[10px] text-brand-neon-purple mt-2">{player.highScore ?? 0}</span>
              </div>
            )) : (
              <div className="col-span-5 text-center font-press-start text-[10px] text-gray-600 py-8 animate-pulse">SCANNING DATABASE...</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
