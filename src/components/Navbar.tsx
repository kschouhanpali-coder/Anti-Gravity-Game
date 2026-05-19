import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const { user } = useAuthStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="flex justify-between items-center px-8 py-6 border-b border-white/5 bg-[#050510]/80 backdrop-blur-xl sticky top-0 z-50">
      <Link href="/" className="font-press-start text-white text-xl hover:text-brand-accent transition-all duration-300 tracking-tighter">
        Anti Gravity
      </Link>
      
      <div className="flex gap-8 items-center">
        <Link href="/leaderboard" className="font-press-start text-[10px] text-gray-500 hover:text-white transition-colors tracking-widest hidden sm:block">
          Leaderboard
        </Link>
        {user ? (
          <>
            <Link href="/dashboard" className="font-press-start text-[10px] text-gray-500 hover:text-white transition-colors tracking-widest hidden sm:block">
              Dashboard
            </Link>
            <Link href="/game" className="font-press-start text-[10px] bg-white text-black px-6 py-3 rounded-lg hover:bg-brand-neon-purple hover:text-white transition-all shadow-xl">
              PLAY NOW
            </Link>
            <button onClick={handleLogout} className="font-press-start text-[8px] text-red-500/50 hover:text-red-500 transition-colors uppercase">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="font-press-start text-[10px] text-gray-500 hover:text-white transition-colors tracking-widest">
              Login
            </Link>
            <Link href="/auth/register" className="font-press-start text-[10px] border border-white/10 px-6 py-3 rounded-lg hover:bg-white/5 transition-all text-white">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
