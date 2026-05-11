
import React from 'react';
import { motion } from 'motion/react';
import { Trash2, Verified, Eye } from 'lucide-react';
import { Vehicle } from '../constants';

export const Hangar = ({ cart, onRemove, onCheckout, onViewDetails }: { cart: Vehicle[], onRemove: (id: string) => void, onCheckout: () => void, onViewDetails: (v: Vehicle) => void }) => {
  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * 0.042;
  const total = subtotal + tax;

  return (
    <div className="pt-12 pb-32 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-12">
        <h2 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter text-primary uppercase leading-none">
          Your <br/> Hangar
        </h2>
        <div className="w-12 h-1 bg-tertiary mt-4"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        <div className="lg:col-span-8 space-y-12">
          {cart.length === 0 ? (
            <div className="text-on-surface-variant font-headline text-xl uppercase tracking-widest">Hangar is empty. Deploy assets from catalog.</div>
          ) : (
            cart.map((item, idx) => (
              <motion.div 
                key={`${item.id}-${idx}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group relative flex flex-col md:flex-row gap-8 bg-surface-container-low p-1 transition-all hover:bg-surface-container"
              >
                <div className="w-full md:w-64 h-48 bg-surface-container-highest overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-surface px-2 py-1 text-[10px] font-sans uppercase tracking-widest border border-outline-variant/20">
                    UNIT {String(idx + 1).padStart(2, '0')}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between py-4 pr-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-headline text-2xl font-bold uppercase tracking-tight text-on-surface">{item.name}</h3>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-outline hover:text-error transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <p className="text-on-surface-variant text-sm mt-1 uppercase tracking-widest font-sans">Configuration: Stealth-X</p>
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div>
                        <span className="block text-[10px] text-outline uppercase tracking-tighter mb-1 font-bold">Color</span>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-primary border border-white/10"></div>
                          <span className="text-xs font-medium uppercase">Cyber Cyan</span>
                        </div>
                      </div>
                      <div>
                        <span className="block text-[10px] text-outline uppercase tracking-tighter mb-1 font-bold">Wheels</span>
                        <span className="text-xs font-medium uppercase">22" Aero-Forged</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-outline uppercase tracking-tighter mb-1 font-bold">Interior</span>
                        <span className="text-xs font-medium uppercase">Carbon Fiber</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 md:mt-0 flex justify-between items-end">
                    <button 
                      onClick={() => onViewDetails(item)}
                      className="flex items-center gap-2 text-primary hover:text-primary-dim transition-colors"
                    >
                      <Eye size={16} />
                      <span className="text-xs uppercase tracking-widest font-bold">View Details</span>
                    </button>
                    <span className="font-headline text-xl font-bold text-primary">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-surface-container-high p-8 sticky top-24 border border-outline-variant/10">
            <h3 className="font-headline text-lg font-bold uppercase tracking-widest border-b border-outline-variant/10 pb-4 mb-6">Manifest Summary</h3>
            <div className="space-y-4 font-sans">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant uppercase tracking-wider">Subtotal</span>
                <span className="text-on-surface">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant uppercase tracking-wider">Acquisition Tax (4.2%)</span>
                <span className="text-on-surface">${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant uppercase tracking-wider">Delivery Logistics</span>
                <span className="text-tertiary font-bold">INCLUDED</span>
              </div>
              <div className="pt-6 mt-6 border-t border-outline-variant/10 flex justify-between items-baseline">
                <span className="font-headline font-bold text-xl uppercase tracking-tighter">Total Credit</span>
                <span className="font-headline font-bold text-3xl text-primary">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="mt-10 space-y-4">
              <button 
                onClick={onCheckout}
                disabled={cart.length === 0}
                className="w-full bg-gradient-to-br from-primary to-primary-dim text-surface font-headline font-bold py-5 rounded-md uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                Proceed to Checkout
              </button>
              <button className="w-full bg-surface-variant text-primary font-sans font-bold py-4 rounded-md uppercase tracking-widest border border-primary/20 hover:bg-surface-container-highest transition-all text-xs">
                Apply Promo Code
              </button>
            </div>
            <div className="mt-8 p-4 bg-surface-container-lowest/50 rounded flex gap-4">
              <Verified className="text-tertiary" size={20} />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface">Nexus Guarantee</p>
                <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">Secure transaction with blockchain verification and Tier 1 delivery protection.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
