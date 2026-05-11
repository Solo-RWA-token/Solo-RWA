
import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Landmark, Lock, ShieldCheck } from 'lucide-react';
import { Vehicle } from '../constants';

export const Checkout = ({ cart, onComplete }: { cart: Vehicle[], onComplete: () => void }) => {
  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="pt-12 pb-32 px-6 max-w-7xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="font-headline text-4xl font-black tracking-tighter text-primary uppercase">Secure Checkout</h2>
          <p className="text-on-surface-variant font-medium tracking-tight uppercase text-xs">TRANSACTION ID: SOLX-9921-TX</p>
        </div>
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
          <div className="flex items-center gap-3 bg-surface-container-high px-4 py-2 rounded-xl border-l-4 border-primary">
            <span className="font-headline font-bold text-primary">01</span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Shipping</span>
          </div>
          <div className="h-px w-8 bg-outline-variant opacity-30"></div>
          <div className="flex items-center gap-3 px-4 py-2 opacity-40">
            <span className="font-headline font-bold text-on-surface">02</span>
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface">Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-tertiary"></div>
              <h3 className="font-headline text-2xl font-bold tracking-tight uppercase">Operational Entity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-outline">Legal Name</label>
                <input 
                  className="w-full bg-surface-container-high border-0 border-b-2 border-outline-variant focus:border-primary focus:bg-surface-bright focus:ring-0 transition-all px-0 py-3 font-medium text-on-surface placeholder:text-on-surface-variant/30" 
                  placeholder="COMMANDER J. DOE" 
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-outline">Network ID (Email)</label>
                <input 
                  className="w-full bg-surface-container-high border-0 border-b-2 border-outline-variant focus:border-primary focus:bg-surface-bright focus:ring-0 transition-all px-0 py-3 font-medium text-on-surface placeholder:text-on-surface-variant/30" 
                  placeholder="OPERATOR@SOLX.COM" 
                  type="email"
                />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-tertiary"></div>
              <h3 className="font-headline text-2xl font-bold tracking-tight uppercase">Deployment Coordinates</h3>
            </div>
            <div className="space-y-10">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-outline">Primary Deployment Address</label>
                <input 
                  className="w-full bg-surface-container-high border-0 border-b-2 border-outline-variant focus:border-primary focus:bg-surface-bright focus:ring-0 transition-all px-0 py-3 font-medium text-on-surface placeholder:text-on-surface-variant/30" 
                  placeholder="101 VECTOR NEBULA DRIVE" 
                  type="text"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-outline">Sector (City)</label>
                  <input className="w-full bg-surface-container-high border-0 border-b-2 border-outline-variant focus:border-primary focus:bg-surface-bright focus:ring-0 transition-all px-0 py-3 font-medium text-on-surface placeholder:text-on-surface-variant/30" placeholder="NEO-TOKYO" type="text"/>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-outline">Zone (Zip)</label>
                  <input className="w-full bg-surface-container-high border-0 border-b-2 border-outline-variant focus:border-primary focus:bg-surface-bright focus:ring-0 transition-all px-0 py-3 font-medium text-on-surface placeholder:text-on-surface-variant/30" placeholder="8820-X" type="text"/>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-outline">Protocol (Region)</label>
                  <select className="w-full bg-surface-container-high border-0 border-b-2 border-outline-variant focus:border-primary focus:bg-surface-bright focus:ring-0 transition-all px-0 py-3 font-medium text-on-surface appearance-none">
                    <option>UNITED FEDERATION</option>
                    <option>EURO-ZONE</option>
                    <option>PACIFIC-CORE</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-tertiary"></div>
              <h3 className="font-headline text-2xl font-bold tracking-tight uppercase">Authorization Protocol</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <label className="relative group cursor-pointer">
                <input checked className="sr-only peer" name="payment" type="radio"/>
                <div className="p-6 bg-surface-container-high rounded-xl border-l-4 border-outline-variant peer-checked:border-primary transition-all group-hover:bg-surface-bright">
                  <div className="flex justify-between items-start mb-4">
                    <CreditCard className="text-primary" size={24} />
                    <div className="w-4 h-4 rounded-full border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-surface rounded-full"></div>
                    </div>
                  </div>
                  <div className="font-headline font-bold text-lg text-on-surface uppercase">CRYPTO-CREDIT</div>
                  <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Standard Ledger Protocol</div>
                </div>
              </label>
              <label className="relative group cursor-pointer">
                <input className="sr-only peer" name="payment" type="radio"/>
                <div className="p-6 bg-surface-container-low rounded-xl border-l-4 border-outline-variant peer-checked:border-primary transition-all group-hover:bg-surface-bright">
                  <div className="flex justify-between items-start mb-4">
                    <Landmark className="text-outline" size={24} />
                    <div className="w-4 h-4 rounded-full border-2 border-outline-variant"></div>
                  </div>
                  <div className="font-headline font-bold text-lg text-on-surface uppercase">DIRECT QUANTUM WIRE</div>
                  <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Bank-to-Bank Verification</div>
                </div>
              </label>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 sticky top-24">
          <div className="bg-surface-container-low rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/10">
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="font-headline text-xl font-bold uppercase tracking-tight">Manifest Summary</h3>
                <span className="text-[10px] font-black bg-tertiary text-surface px-2 py-0.5 rounded">PRIORITY</span>
              </div>
              
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-6 items-center">
                  <div className="w-20 h-20 bg-surface-container-high rounded-xl flex-shrink-0 relative overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale brightness-75" referrerPolicy="no-referrer" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-headline font-bold text-on-surface uppercase leading-tight text-sm">{item.name}</h4>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">NEXUS EDITION • MATTE OBSIDIAN</p>
                    <div className="text-primary font-headline font-bold">${item.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}

              <div className="space-y-4 pt-6 border-t border-outline-variant/10">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant uppercase tracking-widest text-[10px] font-bold">Subtotal</span>
                  <span className="font-bold text-on-surface">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant uppercase tracking-widest text-[10px] font-bold">Deployment (Shipping)</span>
                  <span className="font-bold text-tertiary">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant uppercase tracking-widest text-[10px] font-bold">Global Tax Protocol</span>
                  <span className="font-bold text-on-surface">${tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-outline border-dashed">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black uppercase tracking-widest text-on-surface">Total Commitment</span>
                  <span className="text-4xl font-headline font-black text-primary">${total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={onComplete}
                className="w-full bg-gradient-to-br from-primary to-primary-dim text-surface font-headline font-black py-5 rounded-xl uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Finalize Transaction
              </button>
              <div className="flex items-center justify-center gap-3 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                <Lock size={12} />
                End-to-End Quantum Encryption Active
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
