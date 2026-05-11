import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Radar, Zap } from 'lucide-react';
import { Vehicle } from '../constants';

interface VehicleDetailsProps {
  vehicle: Vehicle;
  onAddToCart: (vehicle: Vehicle) => void;
  isInCart?: boolean;
}

export const VehicleDetails = ({ vehicle, onAddToCart, isInCart }: VehicleDetailsProps) => {
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [selectedColorId, setSelectedColorId] = useState(vehicle.colorVariants?.[0]?.id ?? '');
  useEffect(() => {
    setSelectedColorId(vehicle.colorVariants?.[0]?.id ?? '');
  }, [vehicle.id, vehicle.colorVariants]);
  const selectedColor = useMemo(
    () => vehicle.colorVariants?.find((v) => v.id === selectedColorId) ?? vehicle.colorVariants?.[0],
    [selectedColorId, vehicle.colorVariants]
  );
  const heroImage = selectedColor?.image ?? vehicle.image;
  const gallery = selectedColor?.images && selectedColor.images.length > 0
    ? selectedColor.images
    : vehicle.images && vehicle.images.length > 0
      ? vehicle.images
      : [vehicle.image, vehicle.image, vehicle.image];
  const detailGallery = vehicle.detailImages && vehicle.detailImages.length > 0 ? vehicle.detailImages : [];
  const scrollGallery = (direction: 'left' | 'right') => {
    const container = galleryScrollRef.current;
    if (!container) return;
    const track = container.firstElementChild as HTMLElement | null;
    const firstCard = track?.firstElementChild as HTMLElement | null;
    const gap = track ? parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0') : 0;
    const cardWidth = firstCard?.getBoundingClientRect().width ?? Math.round(container.clientWidth * 0.8);
    const amount = Math.round(cardWidth + gap);
    container.scrollBy({ left: direction === 'right' ? amount : -amount, behavior: 'smooth' });
  };
  
  // Calculate lease price estimate (~0.8% of price per month)
  const leasePrice = Math.round(vehicle.price * 0.008);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] md:h-[751px] overflow-hidden flex flex-col justify-end">
        <img 
          alt={vehicle.name} 
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-75" 
          src={heroImage}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
        
        <div className="relative z-20 px-6 pb-16 lg:px-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2"
          >
            <span className="text-tertiary text-[10px] font-black tracking-[0.3em] uppercase">{vehicle.class}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-headline text-6xl md:text-[10rem] font-black tracking-tighter text-primary uppercase leading-[0.85] mb-4 select-none"
          >
            {vehicle.name}
          </motion.h1>

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div className="max-w-xl">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-on-surface-variant text-lg font-medium leading-relaxed mb-6"
              >
                Experience the pinnacle of kinetic engineering. The {vehicle.name} redefines high-velocity electric motion with a clinical focus on aerodynamic precision.
              </motion.p>
              <div className="flex gap-4 flex-wrap">
                <span className="px-4 py-1 bg-surface-container-high border border-outline-variant/15 text-primary text-xs font-bold tracking-widest uppercase rounded-full">2024 Kinetic Edition</span>
                <span className="px-4 py-1 bg-tertiary-container text-on-tertiary-container text-xs font-bold tracking-widest uppercase rounded-full">{vehicle.category}</span>
              </div>
            </div>

            <div className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar w-full md:w-auto">
              <SpecTile value={vehicle.range.replace(' MI', '')} unit="mi" label="Range" sub="EPA Est." />
              <SpecTile value={vehicle.specs?.acceleration?.replace('s', '') || '3.0'} unit="s" label="0-60 MPH" sub="Launch" />
              <SpecTile value={vehicle.topSpeed.replace(' MPH', '')} unit="mph" label="Top Speed" sub="Track Mode" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 lg:px-24 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Large Feature Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-8 bg-surface-container-low p-8 md:p-12 relative overflow-hidden group"
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-headline text-3xl md:text-4xl font-bold text-white mb-4">Autonomous Nerve System</h3>
                <p className="text-on-surface-variant max-w-md leading-relaxed">
                  Our proprietary neural processing unit handles 4.2 trillion operations per second, providing predictive spatial awareness and 360° surgical clarity in all weather conditions.
                </p>
              </div>
              <div className="mt-12 flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-primary font-headline text-2xl font-bold">12.2</span>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">Sensors</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-primary font-headline text-2xl font-bold">100%</span>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">Coverage</span>
                </div>
              </div>
            </div>
            <Radar className="absolute -right-8 -bottom-8 w-48 md:w-64 h-48 md:h-64 text-primary/5 select-none" />
          </motion.div>

          {/* Secondary Small Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4 bg-surface-container-high p-8 flex flex-col justify-center items-center text-center border-t-4 border-tertiary"
          >
            <Zap className="text-tertiary w-12 h-12 mb-6 fill-tertiary" />
            <h4 className="font-headline text-2xl font-bold text-white mb-2">Hyper-Charge Ready</h4>
            <p className="text-on-surface-variant text-sm mb-6">Recover 200 miles of range in 15 minutes at any SOLX Nexus terminal.</p>
            <button className="text-primary font-headline text-xs font-bold uppercase tracking-widest hover:underline decoration-primary/50 underline-offset-8 transition-all">Locate Nexus</button>
          </motion.div>

          {vehicle.colorVariants && vehicle.colorVariants.length > 0 && (
            <div className="md:col-span-12 -mb-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold mb-3">Color Selection</p>
              <div className="flex gap-3 flex-wrap">
                {vehicle.colorVariants.map((variant) => {
                  const active = selectedColor?.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedColorId(variant.id)}
                      className={`px-3 py-2 border rounded-md text-xs font-bold tracking-widest uppercase transition-colors ${
                        active ? 'border-primary text-primary bg-surface-container-high' : 'border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: variant.swatch }}></span>
                        {variant.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Gallery Row */}
          <div className="md:col-span-12">
            <div className="flex items-center justify-end gap-2 mb-3">
              <button
                onClick={() => scrollGallery('left')}
                className="px-3 h-9 border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:border-primary/40 transition-colors text-xs font-bold uppercase tracking-widest"
              >
                Prev
              </button>
              <button
                onClick={() => scrollGallery('right')}
                className="px-3 h-9 border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:border-primary/40 transition-colors text-xs font-bold uppercase tracking-widest"
              >
                Next
              </button>
            </div>
            <div ref={galleryScrollRef} className="overflow-x-auto no-scrollbar">
              <div className="flex gap-4 min-w-max">
              {gallery.map((img, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="w-[300px] md:w-[420px] aspect-[4/3] overflow-hidden bg-surface-container-low flex-shrink-0"
                >
                  <img 
                    alt={`${vehicle.name} Gallery ${i + 1}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0" 
                    src={img}
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {detailGallery.length > 0 && (
        <section className="px-6 lg:px-24 mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline text-2xl md:text-3xl font-bold uppercase text-on-surface">Detail Gallery</h3>
            <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Common Across Colors</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {detailGallery.map((img, i) => (
              <div key={i} className="aspect-[4/3] overflow-hidden bg-surface-container-low">
                <img
                  alt={`${vehicle.name} Detail ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  src={img}
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Specs Section */}
      <section className="px-6 lg:px-24 mt-32 mb-16">
        <h2 className="font-headline text-4xl md:text-5xl font-bold text-white mb-12 flex items-center gap-4">
          <span className="w-12 h-[2px] bg-primary"></span>
          Surgical Specifications
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-24 gap-y-8 md:gap-y-12">
          <div className="space-y-8 md:space-y-12">
            <SpecRow label="Drive System" value="Dual-Motor AWD" />
            <SpecRow label="Peak Power" value={vehicle.specs?.output || '670 HP Equivalent'} />
            <SpecRow label="Drag Coefficient" value="0.208 Cd" />
          </div>
          <div className="space-y-8 md:space-y-12">
            <SpecRow label="Range" value={vehicle.range} />
            <SpecRow label="Cargo Volume" value={vehicle.specs?.cargo || '28 cu ft'} />
            <SpecRow label="Charge Time" value={vehicle.specs?.chargeTime || '15 MIN (0-80%)'} />
          </div>
        </div>
      </section>

      {/* Purchase Section */}
      <section className="px-6 lg:px-24 py-12 bg-surface-container-low border-t border-outline-variant/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold leading-none mb-1">Total Configuration</span>
            <div className="flex items-baseline gap-2">
              <span className="text-white font-headline text-3xl md:text-4xl font-bold">${vehicle.price.toLocaleString()}</span>
              <span className="text-primary text-xs font-medium uppercase tracking-widest">Est. Lease ${leasePrice}/mo</span>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <motion.button 
              whileHover={{ backgroundColor: 'rgba(0, 42, 52, 1)' }}
              onClick={() => navigate(-1)}
              className="flex-1 md:flex-none px-8 h-12 flex items-center justify-center bg-surface-container-high text-primary border border-primary/20 transition-all duration-300 font-headline text-xs font-bold uppercase tracking-widest active:scale-95"
            >
              Back
            </motion.button>
            <motion.button 
              whileHover={{ boxShadow: '0 0 20px rgba(129, 236, 255, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAddToCart(vehicle)}
              disabled={isInCart}
              className="flex-1 md:flex-none px-10 h-12 flex items-center justify-center bg-gradient-to-r from-primary to-primary-dim text-background font-headline text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isInCart ? 'In Cart' : 'Add to Cart'}
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

function SpecTile({ value, unit, label, sub }: { value: string; unit: string; label: string; sub: string }) {
  return (
    <div className="min-w-[120px] md:min-w-[140px] bg-surface-container-high/60 backdrop-blur-xl p-4 md:p-6 relative overflow-hidden flex flex-col justify-between h-28 md:h-32 border-l-2 border-primary">
      <span className="font-headline text-3xl md:text-4xl font-bold text-white leading-none">
        {value}<span className="text-primary text-sm ml-1 uppercase">{unit}</span>
      </span>
      <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{label}</span>
      <span className="absolute -right-2 top-1/2 -rotate-90 text-[8px] uppercase tracking-[0.3em] text-outline-variant whitespace-nowrap opacity-50">{sub}</span>
    </div>
  );
}

interface SpecRowProps {
  label: string;
  value: string;
}

const SpecRow: React.FC<SpecRowProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between items-end pb-2 border-b border-outline-variant/10">
      <span className="text-on-surface-variant uppercase tracking-widest text-xs font-bold">{label}</span>
      <span className="text-white font-headline text-lg md:text-xl">{value}</span>
    </div>
  );
};
