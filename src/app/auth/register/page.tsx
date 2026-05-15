'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { createProfile } = useAuthStore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`
          }
        }
      });
      
      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('Failed to create user');
      
      await createProfile({
        uid: data.user.id,
        username,
        avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`,
        highScore: 0,
        totalRuns: 0
      });
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050510] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-brand-accent/5 blur-[120px] rounded-full"></div>
      </div>
      
      <div className="w-full max-w-md bg-black/40 border border-white/5 p-10 rounded-2xl backdrop-blur-xl z-10 relative shadow-2xl">
        <Link href="/" className="absolute top-6 left-6 text-[10px] font-press-start text-gray-500 hover:text-brand-neon-purple transition-colors flex items-center gap-2 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK
        </Link>
        
        <div className="flex flex-col items-center mb-10 mt-6">
          <h1 className="font-press-start text-3xl text-center text-white neon-text tracking-tighter">REGISTER</h1>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8 text-xs font-press-start leading-relaxed text-center animate-shake">
            {error.toUpperCase()}
          </div>
        )}
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block font-press-start text-[9px] text-gray-500 mb-3 tracking-widest">USERNAME</label>
            <input 
              type="text" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-inter focus:outline-none focus:border-brand-neon-purple/50 transition-all placeholder:text-gray-700"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={20}
            />
          </div>
          <div>
            <label className="block font-press-start text-[9px] text-gray-500 mb-3 tracking-widest">EMAIL</label>
            <input 
              type="email" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-inter focus:outline-none focus:border-brand-neon-purple/50 transition-all placeholder:text-gray-700"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-press-start text-[9px] text-gray-500 mb-3 tracking-widest">PASSWORD</label>
            <input 
              type="password" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-inter focus:outline-none focus:border-brand-neon-purple/50 transition-all placeholder:text-gray-700"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full font-press-start text-xs bg-white text-black py-5 rounded-xl hover:bg-brand-neon-purple hover:text-white transition-all duration-300 shadow-xl mt-4 disabled:opacity-50"
          >
            {loading ? 'PROCESSING...' : 'JOIN NOW'}
          </button>
        </form>
        
        <p className="mt-10 text-center font-press-start text-[9px] text-gray-500 leading-relaxed">
          Already a jumper? <Link href="/auth/login" className="text-brand-accent hover:underline ml-1">Login here</Link>
        </p>
      </div>
    </div>
  );
}
