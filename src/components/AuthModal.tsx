import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, User, Phone, Loader2, ShieldCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, signIn, signUp } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!authModalOpen) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'signin') await signIn(email, password);
      else await signUp(name, email, password, phone);
    } catch (err: any) {
      const messages: Record<string, string> = {
        'auth/invalid-credential': 'Incorrect email or password.',
        'auth/email-already-in-use': 'An account already exists with this email. Please sign in.',
        'auth/weak-password': 'Please use a password with at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/network-request-failed': 'Network error. Check your internet connection and try again.',
      };
      setError(messages[err?.code] || err?.message || 'Unable to authenticate. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setAuthModalOpen(false)}>
      <section role="dialog" aria-modal="true" aria-labelledby="auth-title" className="relative w-full max-w-md rounded-2xl border border-[#D4AF37]/35 bg-[#141417] p-6 sm:p-8 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={() => setAuthModalOpen(false)} aria-label="Close" className="absolute right-4 top-4 rounded-lg p-2 text-[#9E9AA6] hover:text-white"><X className="h-5 w-5" /></button>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10"><ShieldCheck className="h-5 w-5 text-[#D4AF37]" /></div>
          <div>
            <h2 id="auth-title" className="font-serif text-2xl font-bold text-[#FAF7F2]">{mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}</h2>
            <p className="text-xs text-[#9E9AA6]">D’ROZY BEAUTY HAIR</p>
          </div>
        </div>
        <div className="mb-5 grid grid-cols-2 rounded-xl border border-[#2C2933] bg-[#0B0B0C] p-1">
          <button type="button" onClick={() => {setMode('signin');setError('');}} className={`rounded-lg py-2 text-sm ${mode === 'signin' ? 'bg-[#D4AF37] font-semibold text-black' : 'text-[#9E9AA6]'}`}>Sign In</button>
          <button type="button" onClick={() => {setMode('signup');setError('');}} className={`rounded-lg py-2 text-sm ${mode === 'signup' ? 'bg-[#D4AF37] font-semibold text-black' : 'text-[#9E9AA6]'}`}>Create Account</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode === 'signup' && <>
            <label className="block text-xs text-[#C9C5CD]">Full name</label>
            <div className="flex items-center gap-2 rounded-xl border border-[#2C2933] bg-[#0B0B0C] px-3"><User className="h-4 w-4 text-[#D4AF37]" /><input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" className="w-full bg-transparent py-3 text-sm text-white outline-none" /></div>
            <label className="block text-xs text-[#C9C5CD]">Phone number</label>
            <div className="flex items-center gap-2 rounded-xl border border-[#2C2933] bg-[#0B0B0C] px-3"><Phone className="h-4 w-4 text-[#D4AF37]" /><input required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+234..." className="w-full bg-transparent py-3 text-sm text-white outline-none" /></div>
          </>}
          <label className="block text-xs text-[#C9C5CD]">Email address</label>
          <div className="flex items-center gap-2 rounded-xl border border-[#2C2933] bg-[#0B0B0C] px-3"><Mail className="h-4 w-4 text-[#D4AF37]" /><input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-transparent py-3 text-sm text-white outline-none" /></div>
          <label className="block text-xs text-[#C9C5CD]">Password</label>
          <div className="flex items-center gap-2 rounded-xl border border-[#2C2933] bg-[#0B0B0C] px-3"><Lock className="h-4 w-4 text-[#D4AF37]" /><input required type="password" minLength={6} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" className="w-full bg-transparent py-3 text-sm text-white outline-none" /></div>
          {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</p>}
          <button disabled={busy} type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F3D77B] to-[#B88B18] py-3.5 font-bold text-[#111] disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? 'Please wait...' : mode === 'signin' ? 'Sign In Securely' : 'Create Account'}
          </button>
        </form>
        <p className="mt-4 text-center text-[11px] leading-relaxed text-[#8E8994]">Administrator access is granted only to the authorised D’ROZY admin email after successful Firebase sign-in.</p>
      </section>
    </div>
  );
};
