import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Zap, ArrowRight, User, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login = ({ onLoginSuccess }: LoginProps) => {
  const { mockLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmulatedLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email.trim() || !displayName.trim()) {
      setError('Please enter both email and name.');
      setLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    mockLogin(email.trim(), displayName.trim());
    onLoginSuccess();
    setLoading(false);
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    mockLogin('demo@solxnexus.io', 'Demo Operator');
    onLoginSuccess();
    setLoading(false);
  };

  return (
    <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-outline-variant/10"
      >
        <div className="hidden lg:flex lg:col-span-7 relative bg-surface-container-lowest overflow-hidden items-end p-12">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtLICf9XpF8va4VNCaQdWXNPzghtQd9tEOew7qzmvqD9-CnVXb9fAS0Oy9jZdycrQBkRAoRj_6_cbc7zBLe2XMinF59f74PYq-QmXk55EsBRtDGezTp9WyOatti5XIYQRRuo1eO5GKWX6b5dW07xF1fYWeFUbi6z_BCF_5-LGJucGkRpSb_u7fsat570yaSOpnN7wdQ4udWMbLHmhungPQAsEqB9TxFdFBVeTaOxzDc7lNj-LaUASAEMrmYWtHkguYkctd_bZNlr0"
            alt="SOLX Visual"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          <div className="relative z-10 w-full">
            <h1 className="font-headline text-7xl font-black text-on-surface leading-[0.9] tracking-tighter mb-4 max-w-sm uppercase">
              Evolve <br /> <span className="text-primary italic">Motion</span>
            </h1>
            <p className="font-sans text-on-surface-variant max-w-xs text-[10px] uppercase tracking-[0.2em]">
              Access the premier digital marketplace for high-performance mobility.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 bg-surface-container-low p-8 lg:p-16 flex flex-col justify-center border-l border-outline-variant/15">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-tertiary"></div>
              <h2 className="font-headline text-3xl font-black tracking-tight text-on-surface uppercase">Operator Login</h2>
            </div>
            <p className="font-sans text-on-surface-variant text-xs uppercase tracking-widest">Welcome back. Authenticate to proceed.</p>
          </div>

          <form onSubmit={handleEmulatedLogin} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-4 pl-12 pr-4 bg-surface-container-high border border-outline-variant/15 rounded-xl text-on-surface placeholder:text-outline text-xs uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
              <input
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full py-4 pl-12 pr-4 bg-surface-container-high border border-outline-variant/15 rounded-xl text-on-surface placeholder:text-outline text-xs uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-on-primary border border-primary rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 font-sans text-xs uppercase tracking-widest font-bold"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-outline-variant/20"></div>
            <span className="text-[10px] uppercase tracking-widest text-outline">or</span>
            <div className="flex-1 h-px bg-outline-variant/20"></div>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleQuickLogin}
              disabled={loading}
              className="w-full py-4 bg-surface-container-high border border-outline-variant/15 rounded-xl hover:bg-surface-variant transition-all flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-50"
            >
              <Zap size={16} className="text-tertiary" />
              <span className="font-sans text-xs uppercase tracking-widest text-on-surface font-bold">
                Quick Demo Login
              </span>
            </button>

            {error && (
              <div className="p-4 bg-error-container/10 border border-error-container/20 text-error text-xs font-sans uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <div className="pt-8 space-y-4">
              <div className="flex items-center gap-3 text-on-surface-variant">
                <ShieldCheck size={16} className="text-tertiary" />
                <span className="text-[10px] uppercase tracking-widest">Quantum-grade encryption active</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant">
                <Zap size={16} className="text-tertiary" />
                <span className="text-[10px] uppercase tracking-widest">Instant fleet synchronization</span>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                By authenticating, you agree to the <br />
                <button className="text-primary hover:brightness-110 transition-all font-bold">SOLX NEXUS PROTOCOLS</button>
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full mt-4 flex items-center justify-center gap-2 text-outline hover:text-primary transition-colors"
            >
              <span className="text-[10px] uppercase tracking-widest font-bold">Return to Base</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
