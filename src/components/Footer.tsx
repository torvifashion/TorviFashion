import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Instagram, Facebook } from 'lucide-react';
import BrandLogoText from './BrandLogoText';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Footer() {
  const { setPage, trackOrder, setCategoryFilter } = useApp();
  const [trackInput, setTrackInput] = useState('');

  const handleFooterCategoryClick = (categoryName: string) => {
    if (setCategoryFilter) setCategoryFilter(categoryName);
    setPage('Shop');
  };

  return (
    <footer className="bg-white dark:bg-brand-dark-bg text-black dark:text-zinc-400 font-sans border-t border-brand-border dark:border-brand-dark-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand Col */}
          <div className="space-y-5">
            <BrandLogoText isFooter={true} />
            <p className="text-zinc-550 dark:text-zinc-400 text-xs leading-relaxed tracking-wide pt-1">
              Crafting premium handbags, minimalist jewelry, and high-fashion accessories for the contemporary confident woman. Discover timeless accents designed to redefine luxury.
            </p>
            <div className="flex items-center space-x-1 text-xs text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Est. 2026 • Premium Quality Only</span>
            </div>
          </div>

          {/* Catalog Col */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest text-[#D4AF37] dark:text-zinc-200 uppercase mb-4">
              Shop Collections
            </h4>
            <ul className="space-y-2 text-xs text-black dark:text-zinc-400">
              <li>
                <button
                  id="footer-link-handbags"
                  onClick={() => handleFooterCategoryClick('Handbags')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Premium Handbags
                </button>
              </li>
              <li>
                <button
                  id="footer-link-shoulder"
                  onClick={() => handleFooterCategoryClick('Shoulder Bags')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Shoulder Bags
                </button>
              </li>
              <li>
                <button
                  id="footer-link-tote"
                  onClick={() => handleFooterCategoryClick('Tote Bags')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Tote Bags
                </button>
              </li>
              <li>
                <button
                  id="footer-link-crossbody"
                  onClick={() => handleFooterCategoryClick('Crossbody Bags')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Crossbody Bags
                </button>
              </li>
              <li>
                <button
                  id="footer-link-cosmetic"
                  onClick={() => handleFooterCategoryClick('Cosmetic Bags')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Cosmetic Bags
                </button>
              </li>
              <li>
                <button
                  id="footer-link-jewelry"
                  onClick={() => handleFooterCategoryClick('Jewelry Accessories')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Jewelry Accessories
                </button>
              </li>
              <li>
                <button
                  id="footer-link-fashion"
                  onClick={() => handleFooterCategoryClick('Fashion Accessories')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Fashion Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Social Col (FOLLOW US) */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-widest text-black dark:text-zinc-200 uppercase">
              FOLLOW US
            </h4>
            <p className="text-zinc-550 dark:text-zinc-400 text-xs leading-relaxed tracking-wide">
              Stay connected with our curated design lookbooks, exclusive drops, and fine luxury style inspiration of TORVI FASHION.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="#"
                id="footer-social-instagram"
                className="w-[50px] h-[50px] rounded-full border border-[#EAEAEA] flex items-center justify-center text-[#000000] hover:text-[#D4AF37] hover:border-[#D4AF37] hover:scale-110 active:scale-95 transition-all duration-300 ease-in-out bg-white shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6 transition-colors duration-300" />
              </a>
              <a
                href="#"
                id="footer-social-facebook"
                className="w-[50px] h-[50px] rounded-full border border-[#EAEAEA] flex items-center justify-center text-[#000000] hover:text-[#D4AF37] hover:border-[#D4AF37] hover:scale-110 active:scale-95 transition-all duration-300 ease-in-out bg-white shadow-sm"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6 transition-colors duration-300" />
              </a>
              <a
                href="#"
                id="footer-social-tiktok"
                className="w-[50px] h-[50px] rounded-full border border-[#EAEAEA] flex items-center justify-center text-[#000000] hover:text-[#D4AF37] hover:border-[#D4AF37] hover:scale-110 active:scale-95 transition-all duration-300 ease-in-out bg-white shadow-sm"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-6 h-6 transition-colors duration-300" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright details */}
        <div className="border-t border-brand-border dark:border-brand-dark-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© 2026 Torvi Fashion. All Rights Reserved. Created as a Premium Full-Stack Platform.</p>
        </div>
      </div>
    </footer>
  );
}
