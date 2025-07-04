'use client';


import { supabase } from '@/lib/supabaseClient';
import {  useEffect, useState } from 'react';


export default function AuthButtons() {
  const [user, setUser] = useState<null | { email?: string }>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

async function handleLogin() {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
}

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
   <div className="flex items-center gap-4">
  {user ? (
    <>
      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
        👋 Hi, {user.email}
      </span>
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-sm font-semibold rounded-md bg-red-600 hover:bg-red-700 text-white shadow transition-colors"
      >
        Logout
      </button>
    </>
  ) : (
    <button
      onClick={handleLogin}
      className="px-4 py-2 text-sm font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow transition-colors"
    >
      Login
    </button>
  )}
</div>

  );
}
