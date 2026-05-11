
import React from 'react';
import { Network, QrCode, Verified } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 pt-12 pb-24">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary blur-[120px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] rounded-full bg-surface-container-highest blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        <div className="w-full flex flex-col items-start md:items-center mb-12">
          <span className="font-sans text-tertiary text-sm tracking-[0.4em] uppercase mb-4 block font-bold">Operation Secured</span>
          <h1 className="font-headline text-6xl md:text-9xl font-black text-primary leading-none tracking-tighter uppercase text-center md:text-center">
            MISSION<br /><span className="text-on-surface">COMPLETE</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
          <div className="md:col-span-8 h-80 bg-surface-container-low relative overflow-hidden group border border-outline-variant/10">
            <img
              className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ24EWBrCgcL3nlYcfVVbPtHhF4tg5eAppYtxDje45v-bLSSNKVh-XCA6WsEmI8PDGeTOXCfPJZ7pTMrAmHGr2uYi-8rFsiUatx92FtJu0MV_Ah5xOdND-u41Trpos3xIH2EqHLxZWA2j1K7tT5QrEDFMNr15t0ocixJT2ORBfqugrIOO8VEBPImARQ_rdnnzqHbXvLqJPGEyIL2VOoeY1jWoWQOFsFceS4p_hzLWZpwiMvHK_Y5S7KUvrgwl065y04VgLQoArMWc"
              alt="Futuristic spacecraft interior"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
            <div className="absolute bottom-8 left-8">
              <div className="flex items-center gap-3 mb-2">
                <Verified className="text-primary" size={20} fill="currentColor" />
                <span className="font-sans text-xs tracking-widest text-primary uppercase font-bold">Order Authenticated</span>
              </div>
              <p className="font-headline text-3xl font-bold uppercase">SOLX-NEXUS VII</p>
              <p className="font-sans text-outline text-sm uppercase tracking-tight">Intercept Class Tactical Vessel</p>
            </div>
          </div>

          <div className="md:col-span-4 bg-surface-container-high p-8 flex flex-col justify-between relative overflow-hidden border border-outline-variant/10">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <QrCode size={96} />
            </div>
            <div>
              <p className="font-sans text-xs text-outline uppercase tracking-widest mb-1 font-bold">Asset ID</p>
              <p className="font-headline text-2xl font-bold text-primary">#NX-8829-DELTA</p>
            </div>
            <div className="mt-auto">
              <p className="font-sans text-xs text-outline uppercase tracking-widest mb-1 font-bold">Verification Hash</p>
              <p className="font-mono text-[10px] break-all text-on-surface-variant">0x7F4B2...EE9210</p>
            </div>
          </div>

          <div className="md:col-span-4 bg-surface-container-low p-8 border border-outline-variant/10">
            <p className="font-sans text-xs text-outline uppercase tracking-widest mb-6 font-bold">Dispatch Details</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant text-sm uppercase tracking-tight">Status</span>
                <span className="text-tertiary font-bold text-sm uppercase">Priority One</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant text-sm uppercase tracking-tight">ETA</span>
                <span className="text-on-surface font-bold text-sm">02:14:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant text-sm uppercase tracking-tight">Sector</span>
                <span className="text-on-surface font-bold text-sm uppercase tracking-tight">Outer Rim B-12</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 bg-primary text-surface p-1 flex items-center justify-center">
            <div className="bg-surface w-full h-full p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center border border-primary/20">
                  <Network className="text-primary" size={32} />
                </div>
                <div>
                  <h4 className="font-headline text-xl font-bold uppercase text-on-surface">Fleet Integration Underway</h4>
                  <p className="text-on-surface-variant text-sm font-sans">Vessel is currently synchronizing with your Nexus core.</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/orders')}
                className="w-full md:w-auto kinetic-gradient px-8 py-4 rounded-md text-surface font-sans text-sm font-bold uppercase tracking-widest text-center hover:scale-105 transition-transform duration-200 active:scale-95"
              >
                View Fleet History
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 w-full flex flex-col md:flex-row items-center justify-between gap-8 border-t border-outline-variant/15 pt-8">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-sans text-[10px] text-outline uppercase tracking-tighter font-bold">Authorized By</p>
              <p className="font-headline text-sm font-bold text-primary">NEXUS COMMAND</p>
            </div>
            <div className="h-8 w-[1px] bg-outline-variant/30"></div>
            <div>
              <p className="font-sans text-[10px] text-outline uppercase tracking-tighter font-bold">Confirmation Code</p>
              <p className="font-headline text-sm font-bold text-on-surface">SLX-990-221</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="text-primary font-sans text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-8 font-bold">Download manifest</button>
            <button className="text-on-surface-variant font-sans text-xs uppercase tracking-widest hover:text-on-surface font-bold">Support portal</button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-1 bg-surface-container-highest">
        <div className="h-full bg-primary w-2/3 shadow-[0_0_20px_rgba(129,236,255,0.8)]"></div>
      </div>
    </main>
  );
};
