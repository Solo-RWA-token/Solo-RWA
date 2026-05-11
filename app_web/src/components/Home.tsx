import React from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowLeft, Cpu } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { SpecTile } from "./Shared";
import { VEHICLES } from "../constants";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden px-6 lg:px-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/60 to-transparent z-10"></div>
          <img
            className="w-full h-full object-cover grayscale brightness-50 contrast-125 scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3ZjB7ns7m3yfzz0Av495gpOEKBLCihnG6qIvmCn2yacn19UsI0obUwVWK18axJTCXjIpKWWl_GOl3myRTJkgQmL4aazG_tZVP-eN4baOH30GXWHmwKpdllPKnE7Pt0z5G7tV9WseVcL7EU1q2hU3LJyuoIe9OOKHcDOsScKY_AWtfgc1aYmFg-vWml3hbGcuKUWGaY-jaHp2bHRdBKyqSSxB2RmtMeJUV7oQTeWHuQU98i_k5LbByYbY8J0KkDf41wgCgEllctZ4"
            alt="Futuristic supercar"
            referrerPolicy="no-referrer"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 max-w-4xl"
        >
          <span className="font-headline text-primary text-sm font-bold tracking-[0.4em] block mb-4 uppercase">
            SYSTEM READY // ALPHA PHASE
          </span>
          <h1 className="font-headline text-6xl md:text-9xl font-black tracking-tighter text-on-surface leading-[0.85] editorial-text uppercase">
            DRIVE THE
            <br />
            <span className="text-primary italic">UNSEEN</span>
          </h1>
          <div className="mt-12 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <button
              onClick={() => navigate('/catalog')}
              className="px-10 py-4 bg-gradient-to-br from-primary to-primary-dim text-surface font-headline font-bold tracking-widest rounded-md hover:scale-105 transition-transform duration-300 uppercase"
            >
              INITIALIZE INTERFACE
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-[1px] bg-outline-variant/30"></div>
              <span className="text-on-surface-variant font-sans text-xs tracking-[0.2em] uppercase">
                Scroll to deploy data
              </span>
            </div>
          </div>
        </motion.div>

        <div className="absolute right-0 bottom-24 hidden lg:flex flex-col gap-1 items-end pointer-events-none">
          <SpecTile label="0-60 MPH BASELINE" value="1.9" unit="S" accent />
          <SpecTile label="PEAK OUTPUT" value="820" unit="KW" />
        </div>
      </section>

      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="font-headline text-4xl font-bold tracking-tight text-on-surface uppercase">
                THE NEXUS FLEET
              </h2>
              <p className="text-on-surface-variant mt-2 max-w-md font-sans">
                Precision-engineered entities for high-velocity transit and
                architectural dominance.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-high transition-colors group">
                <ArrowLeft
                  className="text-outline group-hover:text-primary"
                  size={20}
                />
              </button>
              <button className="w-12 h-12 rounded-full border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-high transition-colors group">
                <ArrowRight
                  className="text-outline group-hover:text-primary"
                  size={20}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {VEHICLES.slice(0, 3).map((vehicle) => (
              <motion.div
                key={vehicle.id}
                whileHover={{ y: -10 }}
                className="group relative bg-surface-container-high rounded-xl overflow-hidden hover:bg-surface-container-highest transition-colors duration-500"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    className={`w-full h-full object-cover grayscale hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100 
                      ${vehicle.id === "solo" ? "object-[45%_50%]" : "object-center"} 
                    `}
                    src={vehicle.image}
                    alt={vehicle.name}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-headline text-2xl font-black text-on-surface uppercase">
                        {vehicle.name}
                      </h3>
                      <span className="text-primary font-sans text-[10px] tracking-widest uppercase">
                        {vehicle.class}
                      </span>
                    </div>
                    <span className="text-tertiary font-headline font-bold text-xl">
                      ${(vehicle.price / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex gap-6 mt-6 py-4 border-t border-outline-variant/10">
                    <div>
                      <span className="block text-[10px] text-on-surface-variant font-sans tracking-widest uppercase">
                        RANGE
                      </span>
                      <span className="font-headline font-bold text-on-surface">
                        {vehicle.range}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-on-surface-variant font-sans tracking-widest uppercase">
                        TOP SPEED
                      </span>
                      <span className="font-headline font-bold text-on-surface">
                        {vehicle.topSpeed}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/catalog')}
                    className="w-full mt-6 py-3 bg-surface text-primary border border-primary/20 font-headline font-bold text-sm tracking-widest hover:bg-primary hover:text-surface transition-all rounded-md uppercase"
                  >
                    VIEW SCHEMATICS
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-1">
          <div className="lg:col-span-8 bg-surface-container-low p-12 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-headline text-primary text-xs tracking-[0.4em] mb-4 uppercase">
                CORE ARCHITECTURE
              </h4>
              <h2 className="font-headline text-4xl font-bold mb-6 max-w-lg uppercase">
                NEXUS QUARTZ POWERCELLS
              </h2>
              <p className="text-on-surface-variant font-sans text-sm leading-relaxed max-w-md">
                Our proprietary energy matrix delivers a 400% increase in
                discharge stability over traditional lithium arrays.
              </p>
              <div className="mt-12 flex gap-12">
                <div>
                  <span className="text-3xl font-headline font-black text-on-surface">
                    98.2%
                  </span>
                  <span className="block text-[10px] text-on-surface-variant font-sans uppercase tracking-widest">
                    EFFICIENCY
                  </span>
                </div>
                <div>
                  <span className="text-3xl font-headline font-black text-on-surface">
                    1.2M
                  </span>
                  <span className="block text-[10px] text-on-surface-variant font-sans uppercase tracking-widest">
                    CYCLE LIFE
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10">
              <span className="text-[20rem] font-headline font-black leading-none select-none">
                98
              </span>
            </div>
          </div>
          <div className="lg:col-span-4 bg-surface-container-high p-12 flex flex-col justify-between">
            <div>
              <Cpu className="text-primary mb-6" size={48} />
              <h3 className="font-headline text-2xl font-bold mb-4 uppercase">
                ADAPTIVE CHASSIS
              </h3>
              <p className="text-on-surface-variant text-sm font-sans">
                Real-time molecular lattice adjustment based on terrain
                telemetry.
              </p>
            </div>
            <a
              className="inline-flex items-center gap-2 font-headline text-primary text-xs font-bold tracking-widest uppercase hover:gap-4 transition-all"
              href="#"
            >
              TECHNICAL WHITE PAPER <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
