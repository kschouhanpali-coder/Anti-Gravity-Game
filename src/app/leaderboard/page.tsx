'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { UserService, UserRow } from '@/services/userService';

export default function Leaderboard() {
  const [players, setPlayers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await UserService.getLeaderboard(100);
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching leaderboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankBadge = (idx: number) => {
    if (idx === 0) return 'text-yellow-400 drop-shadow-[0_0_5px_#facc15]';
    if (idx === 1) return 'text-gray-300 drop-shadow-[0_0_5px_#d1d5db]';
    if (idx === 2) return 'text-amber-600 drop-shadow-[0_0_5px_#d97706]';
    if (idx < 10) return 'text-brand-neon-purple';
    return 'text-gray-500';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050510] relative">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-brand-neon-purple/5 blur-[150px] rounded-full"></div>
      </div>
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8 z-10 max-w-5xl w-full mx-auto relative">
        <div className="flex flex-col items-center mb-12">
          <div className="mb-4 bg-brand-neon-purple/10 border border-brand-neon-purple/30 px-4 py-1 rounded-full">
            <span className="font-press-start text-[8px] text-brand-neon-purple">DATABASE V2.4.0</span>
          </div>
          <h1 className="font-press-start text-3xl md:text-5xl text-center text-white neon-text tracking-tighter">GLOBAL RANKINGS</h1>
        </div>
        
        <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
          <table className="w-full text-left font-inter border-collapse">
            <thead className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-press-start border-b border-white/5">
              <tr>
                <th className="p-6 w-24 text-center">RANK</th>
                <th className="p-6">PLAYER</th>
                <th className="p-6 text-right">HIGH SCORE</th>
                <th className="p-6 text-right hidden md:table-cell">RUNS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-2 border-brand-neon-purple border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-press-start text-[10px] text-gray-500 animate-pulse">DECRYPTING...</span>
                    </div>
                  </td>
                </tr>
              ) : players.map((player, idx) => (
                <tr key={player.uid} className="hover:bg-white/5 transition-all group">
                  <td className={`p-6 font-press-start text-center text-sm ${getRankBadge(idx)}`}>
                    #{idx + 1}
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-brand-neon-purple/30 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-900 border border-white/10 overflow-hidden relative z-10">
                          {player.avatar ? <img src={player.avatar} alt="avatar" className="w-full h-full object-cover" /> : null}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-brand-accent transition-colors truncate max-w-[150px] md:max-w-[250px]">
                          {player.username}
                        </span>
                        <span className="text-[10px] text-gray-500 font-press-start mt-1">ID: {player.uid.slice(0, 8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-right font-press-start text-brand-neon-purple text-base md:text-xl drop-shadow-[0_0_10px_rgba(178,75,243,0.3)]">
                    {(player.highScore ?? 0).toLocaleString()}
                  </td>
                  <td className="p-6 text-right text-gray-400 hidden md:table-cell font-press-start text-xs">
                    {player.totalRuns}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <p className="mt-8 text-center font-press-start text-[8px] text-gray-600">END OF TRANSMISSION</p>
      </main>
    </div>
  );
}
