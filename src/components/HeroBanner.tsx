import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import mannequinStraight from '../assets/images/mannequin_body_wave_wig_1793693688371.jpg';
import mannequinCurly from '../assets/images/mannequin_curly_wig_1793693687407.jpg';
import mannequinDeepWave from '../assets/images/mannequin_deep_wave_wig_1793693688836.jpg';
import mannequinBob from '../assets/images/mannequin_bob_wig_1793693688506.jpg';

const HERO_IMAGES = [mannequinStraight, mannequinCurly, mannequinDeepWave, mannequinBob];

export const HeroBanner: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <section className="relative isolate overflow-hidden bg-[#0B0B0C] border-b border-[#2C2933] min-h-[230px] sm:min-h-[260px] lg:min-h-[285px] flex items-center">
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        {HERO_IMAGES.map((src, index) => (
          <img key={src} src={src} alt="" className={'hero-slideshow-image hero-slide-' + (index + 1)} />
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#080809]/95 via-[#0B0B0C]/75 to-[#0B0B0C]/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0B0B0C]/55 via-transparent to-[#0B0B0C]/20" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-5 sm:py-7">
        <div className="max-w-2xl space-y-3">
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] text-[#D4AF37] uppercase">D’ROZY BEAUTY HAIR</span>
          <h1 className="font-serif text-[1.65rem] sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#FAF7F2] leading-[1.08]">
            Home of Luxury Hair.
            <span className="text-gold-gradient italic block sm:inline sm:ml-2 font-normal">Beauty in Every Strand.</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#D0CBD0] max-w-lg leading-relaxed">
            Shop premium wigs, bundles and hair essentials. Flexible Save to Buy plans available.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <button onClick={() => setCurrentView('shop')} className="py-2.5 px-4 rounded-lg font-semibold text-xs text-[#0B0B0C] bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#AA8018] flex items-center gap-2 cursor-pointer">
              Shop Collection <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setCurrentView('savetobuy_hub')} className="py-2.5 px-3.5 rounded-lg font-medium text-xs text-[#FAF7F2] bg-[#16161A]/90 border border-[#D4AF37]/50 flex items-center gap-2 cursor-pointer">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Save to Buy
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
