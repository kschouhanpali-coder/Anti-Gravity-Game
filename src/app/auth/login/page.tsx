'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
      // Note: with Supabase OAuth, redirection handles the flow.
      // After redirect, AuthProvider will fetch/create the profile.
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050510] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-brand-neon-purple/5 blur-[120px] rounded-full"></div>
      </div>
      
      <div className="w-full max-w-md bg-black/40 border border-white/5 p-10 rounded-2xl backdrop-blur-xl z-10 relative shadow-2xl">
        <Link href="/" className="absolute top-6 left-6 text-[10px] font-press-start text-gray-500 hover:text-brand-neon-purple transition-colors flex items-center gap-2 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK
        </Link>
        
        <div className="flex flex-col items-center mb-10 mt-6">
          <h1 className="font-press-start text-3xl text-center text-white neon-text tracking-tighter">LOGIN</h1>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8 text-xs font-press-start leading-relaxed text-center animate-shake">
            {error.toUpperCase()}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
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
            />
          </div>
          
          <button type="submit" className="w-full font-press-start text-xs bg-white text-black py-5 rounded-xl hover:bg-brand-neon-purple hover:text-white transition-all duration-300 shadow-xl mt-4">
            LOGIN
          </button>
        </form>
        
        <div className="mt-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/5"></div>
          <span className="font-press-start text-[8px] text-gray-600">OR</span>
          <div className="flex-1 h-px bg-white/5"></div>
        </div>
        
        <button onClick={handleGoogleLogin} className="w-full mt-8 font-inter font-medium bg-white/5 border border-white/10 text-white py-4 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </button>
        
        <p className="mt-10 text-center font-press-start text-[9px] text-gray-500 leading-relaxed">
          New jumper? <Link href="/auth/register" className="text-brand-accent hover:underline ml-1">Register here</Link>
        </p>
      </div>
    </div>
  );
}
