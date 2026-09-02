"use client";

import { FormEvent, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LockKeyhole, ArrowRight, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    if (!supabase) {
      setError('Captain sign-in is not configured yet. Add the Supabase environment variables to continue.');
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.replace(searchParams.get('next') || '/admin');
    router.refresh();
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-diagonal-subtle">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-2xl p-7 sm:p-9">
        <div className="w-12 h-12 rounded-xl bg-pl-blue text-amber-300 flex items-center justify-center mb-5">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[.2em] text-pl-blue">Captain access</p>
        <h1 className="font-display text-4xl uppercase italic mt-2">Sign in to manage</h1>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">Only authenticated team captains can access squad, fixture, score, and draw controls.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block text-xs font-bold text-gray-700">Email
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-pl-blue" autoComplete="email" />
          </label>
          <label className="block text-xs font-bold text-gray-700">Password
            <span className="relative block mt-1.5">
              <LockKeyhole className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-3 text-sm outline-none focus:border-pl-blue" autoComplete="current-password" />
            </span>
          </label>
          {error && <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-700">{error}</p>}
          <button disabled={loading} className="w-full rounded-lg bg-pl-blue py-3 text-white font-bold uppercase tracking-wider text-xs hover:bg-pl-blue-accent disabled:opacity-60 transition flex items-center justify-center gap-2">
            {loading ? 'Checking credentials...' : 'Enter captain portal'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-[70vh] bg-diagonal-subtle" />}>
      <LoginForm />
    </Suspense>
  );
}