import React from 'react';
import { ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';

const PILLARS = [
  {
    title: 'Hypoallergenic Plating',
    desc: 'Metals sourced meticulously. Gold components plating matches full 18K solid layering criteria to protect delicate client collar lines.',
    icon: ShieldCheck
  },
  {
    title: 'Pebble Grain Finishes',
    desc: 'Both full grain calf hides and bio-organic plant-derived vegan alternates certified and tested across global abrasion stress parameters.',
    icon: Award
  },
  {
    title: 'Feminine Silhouettes',
    desc: 'Aesthetics customized precisely matching the modern lifestyles of ladies aged 16 to 40, facilitating smooth corporate-to-social attire blends.',
    icon: Heart
  }
];

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans text-left">
      
      {/* 1. Header Hero section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-20">
        <div className="md:col-span-6 space-y-4">
          <span className="text-rose-455 text-xs font-semibold uppercase tracking-[0.2em] inline-flex items-center gap-1 leading-none">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Torvi Chronicle</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-sans font-light text-zinc-905 dark:text-white leading-tight">
            Crafting Grace <br />
            <span className="font-serif italic text-rose-400">For Modern Symmetries</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-550 dark:text-zinc-350 leading-relaxed font-sans pt-2">
            Established on the foundations of timeless class, Torvi Fashion was born to satisfy a precise objective: supplying gorgeous, custom-detailed wallets, premium handbags, and lightweight accessories calibrated to fit professional and casual outfits alike. Designed with soft blush pink palettes and pristine materials, we marry delicate features with structural resilience.
          </p>
        </div>

        <div className="md:col-span-6">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-808 bg-zinc-50 dark:bg-zinc-950 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
              alt="Torvi Fashion Retail Showroom"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* 2. Core Pillars visual lists */}
      <div className="space-y-12">
        <div className="text-center space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl font-light text-zinc-905 dark:text-white">Our Material <span className="font-serif italic text-rose-455">Philosophy</span></h2>
          <p className="text-xs text-zinc-404">
            Aesthetic pairings that set standards. Every material choice undergoes strict stress thresholds before assembly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((pillar, i) => {
            const PillarIcon = pillar.icon;
            return (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl space-y-4 shadow-xs"
              >
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-955/20 flex items-center justify-center text-rose-455">
                  <PillarIcon className="w-5 h-5 shrink-0" />
                </div>
                <div className="space-y-1.5 text-left">
                  <h3 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wide">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
