import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Zap,
  Battery,
  Volume2,
  ShieldCheck,
  Cpu,
  Bolt,
  Activity,
  Eye,
} from "lucide-react";
import { VEHICLES, Vehicle } from "../constants";

export const Catalog = ({
  onAddToCart,
  onViewDetails,
}: {
  onAddToCart: (v: Vehicle) => void;
  onViewDetails: (v: Vehicle) => void;
}) => {
  const [filter, setFilter] = useState("ALL");

  const filteredVehicles =
    filter === "ALL" ? VEHICLES : VEHICLES.filter((v) => v.category === filter);

  return (
    <div className="pt-12 pb-24 px-6 max-w-7xl mx-auto">
      <section className="mb-16 relative">
        <div className="flex flex-col md:flex-row items-end gap-6 mb-12">
          <h2 className="font-headline text-6xl md:text-8xl font-black tracking-tighter text-primary uppercase leading-none kinetic-text">
            NEXUS
            <br />
            CATALOG
          </h2>
          <div className="h-px bg-outline-variant/30 flex-grow mb-4 hidden md:block"></div>
          <p className="max-w-xs text-on-surface-variant font-medium text-sm leading-relaxed mb-4 uppercase tracking-tight">
            HIGH-VELOCITY PERFORMANCE MODELS ENGINEERED FOR CLINICAL PRECISION
            AND UNMATCHED ELECTRIC DOMINANCE.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 overflow-x-auto no-scrollbar pb-4">
          {["ALL", "SEDAN", "SUV", "PERFORMANCE", "LIMITED"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-md font-headline font-bold text-sm tracking-wide transition-all active:scale-95 border-b-2 ${filter === cat ? "bg-primary text-surface border-primary" : "bg-surface-container-high text-on-surface hover:bg-surface-bright border-transparent hover:border-primary/50"}`}
            >
              {cat === "ALL" ? "ALL VEHICLES" : cat + "S"}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVehicles.map((vehicle) => (
          <motion.div
            key={vehicle.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative flex flex-col bg-surface-container-low overflow-hidden border border-outline-variant/10"
          >
            <div className="relative h-96 w-full overflow-hidden">
              {/* SOLO uses a custom object position because the source image subject is not centered. */}
              <img
                className={`object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0 ${vehicle.id === "solo" ? "object-[40%_50%]" : "object-center"}`}
                src={vehicle.image}
                alt={vehicle.name}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>

              {vehicle.specs?.acceleration && (
                <div className="absolute top-6 right-0 glass-panel py-4 pl-6 pr-2 flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="font-headline text-3xl font-black text-primary leading-none">
                      {vehicle.specs.acceleration}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                      0-60 MPH
                    </span>
                  </div>
                  <div className="h-10 w-px bg-primary/20"></div>
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-tertiary text-[10px] font-black tracking-widest uppercase mb-1 block">
                    {vehicle.class}
                  </span>
                  <h3 className="font-headline text-3xl font-bold text-on-surface tracking-tight uppercase">
                    {vehicle.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-on-surface-variant text-[10px] block uppercase font-bold">
                    FROM
                  </span>
                  <span className="font-headline text-xl font-bold text-primary">
                    ${vehicle.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-outline-variant/15 pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                    RANGE
                  </span>
                  <span className="text-sm font-bold text-on-surface">
                    {vehicle.range}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                    TOP SPEED
                  </span>
                  <span className="text-sm font-bold text-on-surface">
                    {vehicle.topSpeed}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                    {vehicle.specs?.cargo
                      ? "CARGO"
                      : vehicle.specs?.chargeTime
                        ? "CHARGE"
                        : "DRIVE"}
                  </span>
                  <span className="text-sm font-bold text-on-surface">
                    {vehicle.specs?.cargo || vehicle.specs?.chargeTime || "AWD"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onViewDetails(vehicle)}
                  className="flex-1 bg-surface-container-high text-primary py-3 font-headline font-bold text-sm uppercase tracking-widest rounded-md hover:bg-surface-container-highest active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-primary/20"
                >
                  <Eye size={16} />
                  VIEW
                </button>
                <button
                  onClick={() => onAddToCart(vehicle)}
                  className="flex-1 bg-gradient-to-r from-primary to-primary-dim text-surface py-3 font-headline font-black text-sm uppercase tracking-widest rounded-md hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured Spec Section */}
      <section className="mt-24 grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[400px]">
        <div className="md:col-span-2 md:row-span-2 bg-surface-container-low rounded-xl p-8 flex flex-col justify-end relative overflow-hidden group">
          <img
            className="absolute inset-0 object-cover w-full h-full opacity-30 group-hover:scale-105 transition-transform duration-1000 grayscale"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAfmXqL8O-Lavhtq8CnXI6DjlfKYQ5Kz9CsGX_It6zfyK9xED_GwvkjdHu_xaohXBMe_1roWsgVXTcneDRyYXyj44U9LFdWdOiZMBUDvMTGTA0QT8rp0gapx93XDO6rKw5qtkR9vmEEo1d0hm3tAhtzXm5mF9FjkOeFp_SPaW1xMXxLYQGpJB29BTwwj9IeGzixWWFf9oSEAjYQKb9ugRVlrlRxjmNZvBZ5thcZ1zepIitmNj4__JbY10RY-uRyQQMeLiWX1mrY7I"
            alt="Tech Detail"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10">
            <span className="text-tertiary font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">
              NEXT-GEN POWER
            </span>
            <h4 className="font-headline text-4xl font-bold text-on-surface uppercase leading-none mb-4">
              PLATINUM CORE DRIVE
            </h4>
            <p className="text-on-surface-variant text-sm max-w-sm font-sans">
              The heart of every SOLX vehicle is the Platinum Core induction
              motor, delivering instantaneous torque and unmatched thermal
              efficiency.
            </p>
          </div>
        </div>
        <div className="md:col-span-2 bg-surface-container-high rounded-xl p-6 flex flex-col justify-between border-l-4 border-primary">
          <div className="flex justify-between items-start">
            <Activity className="text-primary" size={32} />
            <span className="font-headline text-4xl font-black text-on-surface uppercase">
              1,020 HP
            </span>
          </div>
          <div className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">
            PEAK SYSTEM OUTPUT
          </div>
        </div>
        <div className="md:col-span-1 bg-surface-container-high rounded-xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <Bolt className="text-tertiary" size={24} />
            <span className="font-headline text-2xl font-black text-on-surface uppercase">
              15m
            </span>
          </div>
          <div className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">
            300MI CHARGE
          </div>
        </div>
        <div className="md:col-span-1 bg-surface-container-high rounded-xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <ShieldCheck className="text-primary" size={24} />
            <span className="font-headline text-2xl font-black text-on-surface uppercase">
              5-STAR
            </span>
          </div>
          <div className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">
            SAFETY RATING
          </div>
        </div>
      </section>
    </div>
  );
};
