import React from 'react';
import { useApp } from '../context/AppContext';
import { WHATSAPP_LINK } from '../data/mockData';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Award, MessageCircle } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="relative overflow-hidden bg-[#0B0B0C] border-b border-[#2C2933]">
      {/* Background Decorative Gold Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-[#E8A598]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Editorial Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
              <span className="w-6 h-px bg-[#D4AF37]" />
              <span>D’ROZY BEAUTY HAIR · EXCLUSIVE COLLECTION</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#FAF7F2] leading-[1.15]" style={{ textWrap: 'balance' }}>
              Home of Luxury Hair.{' '}
              <span className="text-gold-gradient italic block sm:inline font-normal">
                Indulge in 100% Raw Virgin Perfection.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#9E9AA6] max-w-xl font-light leading-relaxed">
              Super double-drawn Vietnamese bone straight, melted Swiss HD frontals, and ethereal curls.
              Own your dream hair today with our revolutionary <strong className="text-[#E8A598] font-medium">Save to Buy</strong> flexible installment plan.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setCurrentView('shop')}
                className="py-3.5 px-7 rounded-xl font-semibold text-sm text-[#0B0B0C] bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#AA8018] hover:opacity-95 transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2.5 cursor-pointer whitespace-nowrap"
              >
                <span>Explore The Catalog</span>
                <ArrowRight className="w-4 h-4 text-[#0B0B0C]" />
              </button>

              <button
                onClick={() => setCurrentView('savetobuy_hub')}
                className="py-3.5 px-6 rounded-xl font-medium text-sm text-[#FAF7F2] bg-[#16161A] hover:bg-[#201F26] border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Save to Buy Plans</span>
              </button>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-4 rounded-xl text-sm text-[#FAF7F2] hover:text-emerald-400 border border-[#2C2933] hover:border-emerald-500/50 bg-[#16161A]/60 transition-all flex items-center gap-2"
                title="Consult Hair Stylist on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Hair Consultation</span>
              </a>
            </div>

            {/* 3 Pillars of Luxury Rigor */}
            <div className="pt-6 border-t border-[#2C2933] grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FAF7F2]">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <span>100% Human Hair</span>
                </div>
                <p className="text-[11px] text-[#9E9AA6] mt-0.5">Cuticle aligned, zero tangles</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FAF7F2]">
                  <Clock className="w-4 h-4 text-[#E8A598]" />
                  <span>Save to Buy</span>
                </div>
                <p className="text-[11px] text-[#9E9AA6] mt-0.5">Flexible weekly & monthly plans</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FAF7F2]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Paystack Secured</span>
                </div>
                <p className="text-[11px] text-[#9E9AA6] mt-0.5">Verified Nigerian transactions</p>
              </div>
            </div>
          </div>

          {/* Right Column: High-End Hair Portrait Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl bg-[#141417]">
              {/* Image */}
              <img
                src="/src/assets/images/luxury_bone_straight_hair_1793692289793.jpg"
                alt="Vietnamese Bone Straight Luxury Hair"
                className="w-full aspect-[4/5] object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Bottom Scrim with Signature Hair Details */}
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] tracking-widest text-[#E8A598] uppercase font-semibold">
                      Featured Masterpiece
                    </span>
                    <h3 className="text-base font-bold text-[#FAF7F2] font-serif">
                      Super Double Drawn Bone Straight
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#9E9AA6]">Save to Buy from</span>
                    <div className="text-sm font-bold text-[#D4AF37]">₦52,500/bi-wk</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Luxury Tag */}
            <div className="absolute -bottom-4 -left-4 sm:left-4 bg-[#141417]/95 border border-[#D4AF37]/40 rounded-xl p-3 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#FAF7F2]">VIP Pre-Plucked Hairlines</div>
                <div className="text-[11px] text-[#9E9AA6]">0.04mm Invisible Melted Lace</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
