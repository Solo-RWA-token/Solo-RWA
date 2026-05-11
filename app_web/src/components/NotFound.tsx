import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-[70vh] px-6 py-24 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-surface-container-low border border-outline-variant/15 p-10 md:p-14">
        <p className="text-tertiary font-sans text-[10px] tracking-[0.2em] uppercase font-bold mb-3">404 / Route Not Found</p>
        <h1 className="font-headline text-4xl md:text-6xl font-black tracking-tight text-primary uppercase mb-4">Page Not Found</h1>
        <p className="text-on-surface-variant text-sm md:text-base max-w-xl mb-10 uppercase tracking-tight">
          The URL is invalid or the requested vehicle does not exist.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/catalog')}
            className="px-6 py-3 bg-primary text-surface font-headline font-bold text-xs uppercase tracking-widest rounded-md"
          >
            Go to Catalog
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-surface-container-high text-primary border border-primary/25 font-headline font-bold text-xs uppercase tracking-widest rounded-md"
          >
            Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-surface-container-high text-on-surface border border-outline-variant/20 font-headline font-bold text-xs uppercase tracking-widest rounded-md"
          >
            Home
          </button>
        </div>
      </div>
    </section>
  );
};
