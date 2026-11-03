import React from 'react';
import { useApp } from '../context/AppContext';
import { WHATSAPP_LINK } from '../data/mockData';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Award, MessageCircle } from 'lucide-react';
import mannequinStraight from '../assets/images/mannequin_body_wave_wig_1793693688371.jpg';
import mannequinCurly from '../assets/images/mannequin_curly_wig_1793693687407.jpg';
import mannequinDeepWave from '../assets/images/mannequin_deep_wave_wig_1793693688836.jpg';
import mannequinBob from '../assets/images/mannequin_bob_wig_1793693688506.jpg';

const HERO_IMAGES = [
  { src: mannequinStraight, alt: 'Luxury hair styled on a professional mannequin display' },
  { src: mannequinCurly, alt: 'Defined curly wig on a professional mannequin head' },
  { src: mannequinDeepWave, alt: 'Deep wave wig on a professional mannequin head' },
  { src: mannequinBob, alt: 'Luxury bob wig on a professional mannequin display' },
];

export const HeroBanner: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <section className="relative isolate overflow-hidden bg-[#0B0B0C] border-b border-[#2C2933] min-h-[390px] sm:min-h-[410px] lg:min-h-[430px] flex items-center">
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        {HERO_IMAGES.map((item, index) => (
          <img
            key={item.src}
            src={item.src}
            alt=""
            className={`hero-slideshow-image hero-slide-${index + 1}`}
          />
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#080809]/95 via-[#0B0B0C]/80 to-[#0B0B0C]/35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0B0B0C]/65 via-transparent to-[#0B0B0C]/25" />

      <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-9 sm:py-11 lg:py-12">
        <div className="max-w-3xl space-y-4 sm:space-y-5 text-left">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
            <span className="w-6 h-px bg-[#D4AF37]" />
            <span>D’ROZY BEAUTY HAIR · EXCLUSIVE COLLECTION</span>
          </div>

          <h1 className="font-serif text-[2rem] sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#FAF7F2] leading-[1.08] max-w-2xl">
            Home of Luxury Hair.
            <span className="text-gold-gradient italic block sm:inline sm:ml-2 font-normal">
              Raw Beauty. Timeless Perfection.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#D0CBD0] max-w-xl font-light leading-relaxed">
            Discover beautifully crafted wigs, bundles and hair essentials. Own your dream hair today with our flexible <strong className="text-[#E8A598] font-medium">Save to Buy</strong> plans.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => setCurrentView('shop')}
              className="py-3 px-5 sm:px-6 rounded-xl font-semibold text-xs sm:text-sm text-[#0B0B0C] bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#AA8018] hover:opacity-95 transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('savetobuy_hub')}
              className="py-3 px-4 sm:px-5 rounded-xl font-medium text-xs sm:text-sm text-[#FAF7F2] bg-[#16161A]/90 hover:bg-[#201F26] border border-[#D4AF37]/50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Save to Buy</span>
            </button>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3.5 rounded-xl text-xs sm:text-sm text-[#FAF7F2] hover:text-emerald-400 border border-white/20 bg-black/40 transition-all flex items-center gap-2"
              aria-label="Hair consultation on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="pt-3 border-t border-white/15 grid grid-cols-3 gap-3 max-w-xl">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span className="text-[10px] sm:text-xs text-[#F4F0EB]">Luxury Hair</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#E8A598] shrink-0" />
              <span className="text-[10px] sm:text-xs text-[#F4F0EB]">Flexible Plans</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[10px] sm:text-xs text-[#F4F0EB]">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 right-5 flex gap-1.5" aria-hidden="true">
        {HERO_IMAGES.map((item, index) => <span key={item.src} className={`h-1 rounded-full bg-[#D4AF37]/70 ${index === 0 ? 'w-5' : 'w-1.5'}`} />)}
      </div>
    </section>
  );
};
