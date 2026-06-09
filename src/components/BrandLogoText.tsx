import React from 'react';
import { useApp } from '../context/AppContext';

interface BrandLogoTextProps {
  className?: string;
  isFooter?: boolean;
}

export default function BrandLogoText({ className = '', isFooter = false }: BrandLogoTextProps) {
  const { logoPreset } = useApp();

  // Pick font family and classes based on logoPreset
  let torviStyle = '';
  let fashionStyle = '';
  let subStyle = '';
  let paddingLeftVal = '18%';

  switch (logoPreset) {
    case 'heritage': // Playfair Display (Louis Vuitton & Chanel vibe)
      torviStyle = 'font-serif font-extrabold tracking-[0.16em]';
      fashionStyle = 'font-sans font-medium tracking-[0.45em] uppercase text-neutral-900 dark:text-neutral-900';
      subStyle = 'font-sans font-semibold tracking-[0.34em] uppercase text-[#D4AF37]';
      paddingLeftVal = '20%';
      break;

    case 'minimalist': // Modern Neo-Grotesque Sans (Prada & Balenciaga vibe)
      torviStyle = 'font-sans font-black tracking-[0.08em] uppercase';
      fashionStyle = 'font-sans font-bold tracking-[0.32em] uppercase text-neutral-950 dark:text-neutral-950';
      subStyle = 'font-sans font-extrabold tracking-[0.22em] uppercase text-[#D4AF37]';
      paddingLeftVal = '14%';
      break;

    case 'avantgarde': // Elegant Roman Serif (Cinzel / Celine & Bvlgari Vibe)
      torviStyle = 'font-cinzel font-semibold tracking-[0.26em] uppercase';
      fashionStyle = 'font-sans font-light tracking-[0.52em] uppercase text-neutral-800 dark:text-neutral-800';
      subStyle = 'font-sans font-medium tracking-[0.4em] uppercase text-[#D4AF37]';
      paddingLeftVal = '24%';
      break;

    case 'editorial': // Strong Bodoni / Vogue high-contrast editorial
      torviStyle = 'font-bodoni font-extrabold tracking-[0.1em] uppercase';
      fashionStyle = 'font-bodoni font-bold tracking-[0.38em] uppercase text-neutral-950 dark:text-neutral-950';
      subStyle = 'font-sans font-bold tracking-[0.28em] uppercase text-[#D4AF37]';
      paddingLeftVal = '18%';
      break;

    case 'london': // Delicate Elegant Serif (Cormorant Garamond / Burberry vibe)
      torviStyle = 'font-cormorant font-normal tracking-[0.22em] uppercase';
      fashionStyle = 'font-cormorant font-light tracking-[0.48em] uppercase text-neutral-800 dark:text-neutral-800';
      subStyle = 'font-sans font-semibold tracking-[0.36em] uppercase text-[#D4AF37]';
      paddingLeftVal = '22%';
      break;

    case 'neonoir': // Radical Monospace Modern tech-glam (Acne Studios & Off-White vibe)
      torviStyle = 'font-mono font-bold tracking-[0.14em] uppercase';
      fashionStyle = 'font-mono font-medium tracking-[0.36em] uppercase text-neutral-900 dark:text-neutral-900';
      subStyle = 'font-mono font-bold tracking-[0.26em] uppercase text-[#D4AF37]';
      paddingLeftVal = '16%';
      break;

    default:
      torviStyle = 'font-serif font-bold tracking-[0.12em]';
      fashionStyle = 'font-sans font-medium tracking-[0.3em] text-neutral-900 dark:text-neutral-900';
      subStyle = 'font-sans font-semibold tracking-[0.25em] text-[#D4AF37]';
      paddingLeftVal = '22%';
  }

  // Common black-on-white text styling. Text color is strictly set to deep black for absolute luxury layout.
  if (isFooter) {
    return (
      <div 
        id="footer-brand-logo-text"
        className={`flex flex-col select-none bg-transparent border-none outline-none shadow-none items-start text-left ${className}`} 
        style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}
      >
        <span className={`${torviStyle} text-[26px] sm:text-[32px] md:text-[34px] text-black leading-none`}>
          TORVI
        </span>
        <span 
          className={`${fashionStyle} text-[10px] sm:text-[12px] md:text-[13px] leading-none mt-2 select-none`}
          style={{ paddingLeft: paddingLeftVal }}
        >
          FASHION
        </span>
      </div>
    );
  }

  // Header and common navbar sizes
  return (
    <div 
      id="header-brand-logo-text"
      className={`flex flex-col select-none bg-transparent border-none outline-none shadow-none items-start text-left ${className}`} 
      style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}
    >
      <span className={`${torviStyle} text-[22px] sm:text-[28px] md:text-[34px] text-black leading-none`}>
        TORVI
      </span>
      <span 
        className={`${fashionStyle} text-[8.5px] sm:text-[11px] md:text-[13px] leading-none mt-2 select-none`}
        style={{ paddingLeft: paddingLeftVal }}
      >
        FASHION
      </span>
    </div>
  );
}
