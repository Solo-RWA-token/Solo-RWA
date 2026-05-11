
import React from 'react';
import { motion } from 'motion/react';
import { User, ShieldCheck, Fingerprint, Key, Sliders, Activity, Leaf, BatteryCharging, Verified, IdCard, MapPin, Award } from 'lucide-react';

export const Profile = () => {
  return (
    <div className="pt-12 pb-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section className="lg:col-span-8 space-y-8">
        <div className="bg-surface-container-low rounded-xl p-8 relative overflow-hidden group">
          <div className="absolute -right-16 -top-16 w-64 h-64 kinetic-gradient opacity-10 blur-[80px]"></div>
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
            <div className="relative">
              <div className="w-32 h-32 rounded-full kinetic-gradient p-1">
                <img 
                  className="w-full h-full object-cover rounded-full border-4 border-surface" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0SPPJdZE-OByOtwZkneljHxMm9aVG_M27ti5MtxGmS0sw5Hy_JB2-YUbXSpW-LnGIAHSx0M0e-3zotzTXaQgiy9OlrUeaFAWCQ2wS1TeoRbUtO5-VAT5vBNjuyqfkx1USoz4KocoJNAJjX_F6AomI5SdSLJjqSxuWlr8au94dAWp8NR_IevRoZ6TtE77rUrgO4wmkFG8GRQSC17gnLWb2qJJw4tPgVKnXHT58pYlKzejNQV6fkHAw7V9_uB9PechrPeaQ6mTFHZE"
                  alt="User Avatar"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-tertiary text-surface text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter border-2 border-surface">
                Active
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="font-headline text-4xl font-bold tracking-tight text-primary uppercase">NEXUS OPERATOR</h2>
                <Verified className="text-tertiary" size={20} fill="currentColor" />
              </div>
              <div className="flex flex-wrap gap-4 text-on-surface-variant font-medium text-xs uppercase tracking-tight">
                <span className="flex items-center gap-1"><IdCard size={14} /> SOLX-ID: 8829</span>
                <span className="flex items-center gap-1 text-tertiary/80"><Award size={14} /> Tier 1 Verified</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> NEOM Sector 7</span>
              </div>
              <p className="text-on-surface-variant max-w-md text-sm font-light font-sans">
                Synthesizing performance and sustainability within the SOLX digital ecosystem. 
                Active operator since cycle 2024.03.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-container-high p-6 rounded-xl border-l-4 border-primary">
            <div className="flex justify-between items-start mb-4">
              <Activity className="text-primary-dim" size={20} />
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Distance Traveled</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-3xl font-black text-on-surface">14,882</span>
              <span className="font-sans text-xs text-primary uppercase tracking-widest font-bold">km</span>
            </div>
          </div>
          <div className="bg-surface-container-high p-6 rounded-xl border-l-4 border-tertiary">
            <div className="flex justify-between items-start mb-4">
              <Leaf className="text-tertiary" size={20} />
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">CO2 Saved</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-3xl font-black text-on-surface">3.2</span>
              <span className="font-sans text-xs text-tertiary uppercase tracking-widest font-bold">tons</span>
            </div>
          </div>
          <div className="bg-surface-container-high p-6 rounded-xl border-l-4 border-outline">
            <div className="flex justify-between items-start mb-4">
              <BatteryCharging className="text-outline" size={20} />
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Efficiency</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-3xl font-black text-on-surface">98.4</span>
              <span className="font-sans text-xs text-outline uppercase tracking-widest font-bold">%</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10">
          <div className="p-6 border-b border-outline-variant/15 flex justify-between items-center">
            <h3 className="font-headline text-lg font-bold text-on-surface tracking-wide uppercase">Core Node Configuration</h3>
            <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Edit Configuration</button>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Primary Interface</label>
              <p className="font-medium text-on-surface">nexus.operator_8829@solx.digital</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Network Proxy</label>
              <p className="font-medium text-on-surface">AES-256 Tunnel Activated</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Billing Cycle</label>
              <p className="font-medium text-on-surface">Annual (Next: Oct 2025)</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Regional Access</label>
              <p className="font-medium text-on-surface">Global - Tier 1 Unlimited</p>
            </div>
          </div>
        </div>
      </section>

      <aside className="lg:col-span-4 space-y-8">
        <div className="bg-surface-container-high rounded-xl p-6 space-y-6 border border-outline-variant/10">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="text-primary" size={20} />
            <h3 className="font-headline text-sm font-bold uppercase tracking-widest">Security Protocols</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <Fingerprint className="text-tertiary" size={18} />
                <span className="text-sm font-bold uppercase tracking-tight">Biometric Unlock</span>
              </div>
              <div className="w-10 h-5 bg-tertiary/20 rounded-full relative flex items-center px-1">
                <div className="w-3 h-3 bg-tertiary rounded-full ml-auto"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <Key className="text-primary" size={18} />
                <span className="text-sm font-bold uppercase tracking-tight">Two-Factor Auth</span>
              </div>
              <div className="w-10 h-5 bg-primary/20 rounded-full relative flex items-center px-1">
                <div className="w-3 h-3 bg-primary rounded-full ml-auto"></div>
              </div>
            </div>
            <button className="w-full py-3 rounded-md font-bold text-xs uppercase tracking-widest text-on-surface bg-surface-container-highest border border-outline-variant/20 hover:bg-surface-bright transition-all">
              Reset Master Protocol
            </button>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
          <div className="flex items-center gap-2 mb-6">
            <Sliders className="text-primary-dim" size={20} />
            <h3 className="font-headline text-sm font-bold uppercase tracking-widest">System Preferences</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-tight">Kinetic Theme</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter font-bold">Enable dynamic UI motion</p>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full flex items-center justify-end px-1">
                <div className="w-4 h-4 bg-surface rounded-full shadow-lg"></div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Neural Voice Profile</label>
              <select className="w-full bg-surface-container-highest border-none text-sm rounded-md focus:ring-1 focus:ring-primary py-3 px-4 text-on-surface">
                <option>Atlas (Masculine, Clinical)</option>
                <option>Lyra (Feminine, Synthetic)</option>
                <option>Vector (Neutral, High-Speed)</option>
              </select>
            </div>
            <div className="pt-4 space-y-4">
              <button className="w-full kinetic-gradient py-4 rounded-md text-surface font-bold text-xs uppercase tracking-[0.2em] shadow-[0_4px_15px_rgba(0,227,253,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                Save System State
              </button>
              <button className="w-full text-error text-[10px] font-bold uppercase tracking-widest py-2">
                Deactivate Core Account
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
