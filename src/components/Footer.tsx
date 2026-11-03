import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OFFICIAL_LOGO_URL, WHATSAPP_CONTACT, WHATSAPP_LINK } from '../data/mockData';
import { MessageCircle, ShieldCheck, Heart, Sparkles, Send, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategory } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 2000);
  };

  return (
    <footer className="bg-[#0B0B0C] border-t border-[#2C2933] text-[#FAF7F2]">
      {/* Upper VIP Hair Guarantee Ribbon */}
      <div className="border-b border-[#2C2933]/60 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="p-4 rounded-2xl bg-[#141417] border border-[#2C2933]/50">
            <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider block mb-1">
              100% Human Hair Guarantee
            </span>
            <p className="text-xs text-[#9E9AA6]">
              Ethically sourced raw virgin strands. Cuticle aligned, zero chemical processing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#141417] border border-[#2C2933]/50">
            <span className="text-xs font-semibold text-[#E8A598] uppercase tracking-wider block mb-1">
              Save to Buy Advantage
            </span>
            <p className="text-xs text-[#9E9AA6]">
              0% Interest flexible installments. Lock in your hair piece while you save at your pace.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#141417] border border-[#2C2933]/50">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
              Paystack Verified
            </span>
            <p className="text-xs text-[#9E9AA6]">
              Bank-grade security. Cards, instant bank transfers, and USSD supported.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#141417] border border-[#2C2933]/50">
            <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider block mb-1">
              Direct Stylist Hotline
            </span>
            <p className="text-xs text-[#9E9AA6]">
              Instant WhatsApp video consultation and hair advice on {WHATSAPP_CONTACT}.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={OFFICIAL_LOGO_URL}
              alt="D’ROZY BEAUTY HAIR"
              className="w-14 h-14 rounded-full object-cover border border-[#D4AF37]/50 shadow-xl"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="font-serif text-2xl font-bold text-gold-gradient tracking-wide block">
                D’ROZY
              </span>
              <span className="text-[10px] tracking-[0.3em] text-[#E8A598] uppercase font-semibold block -mt-1">
                HOME OF LUXURY HAIR
              </span>
            </div>
          </div>

          <p className="text-xs text-[#9E9AA6] leading-relaxed max-w-sm font-light">
            Nigeria’s premier house of 100% raw virgin human hair, luxury wigs, Vietnamese bone
            straight, HD lace frontals, and flexible Save to Buy installment plans.
          </p>

          <div className="pt-2">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: {WHATSAPP_CONTACT}</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-serif text-sm font-bold text-[#FAF7F2] uppercase tracking-wider">
            Collections
          </h4>
          <ul className="space-y-2 text-xs text-[#9E9AA6]">
            <li>
              <button
                onClick={() => {
                  setSelectedCategory('Bone Straight');
                  setCurrentView('shop');
                }}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Bone Straight
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setSelectedCategory('Curly Wigs');
                  setCurrentView('shop');
                }}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Raw Deep Curls
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setSelectedCategory('Body Wave');
                  setCurrentView('shop');
                }}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Body Wave Wigs
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setSelectedCategory('Lace Frontals');
                  setCurrentView('shop');
                }}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Melted HD Frontals
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setSelectedCategory('Accessories & Care');
                  setCurrentView('shop');
                }}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Hair Oils & Brushes
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-serif text-sm font-bold text-[#FAF7F2] uppercase tracking-wider">
            Customer Care
          </h4>
          <ul className="space-y-2 text-xs text-[#9E9AA6]">
            <li>
              <button
                onClick={() => setCurrentView('savetobuy_hub')}
                className="hover:text-[#D4AF37] transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>Save to Buy Plans</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView('customer_dashboard')}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Track My Order
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView('customer_dashboard')}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Client Portal
              </button>
            </li>
            <li>
              <span className="text-[#FAF7F2]">Showroom:</span> Lekki Phase 1, Lagos
            </li>
          </ul>
        </div>

        {/* Newsletter & VIP Club */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-serif text-sm font-bold text-[#FAF7F2] uppercase tracking-wider">
            VIP Hair Club
          </h4>
          <p className="text-xs text-[#9E9AA6]">
            Receive private invites to new raw donor batches and Save to Buy promotions.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="flex items-center bg-[#141417] border border-[#2C2933] focus-within:border-[#D4AF37] rounded-xl overflow-hidden p-1">
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-xs text-[#FAF7F2] focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-[#D4AF37] text-[#0B0B0C] hover:bg-[#F3E0A3] transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            {isSubscribed && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Welcome to D’ROZY VIP Hair Club!
              </span>
            )}
          </form>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#2C2933]/60 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[#9E9AA6] gap-4">
        <div>
          © {new Date().getFullYear()} D’ROZY BEAUTY HAIR. All Rights Reserved. Home of Luxury Hair.
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-[#FAF7F2] cursor-pointer">Terms & Conditions</span>
          <span>·</span>
          <span className="hover:text-[#FAF7F2] cursor-pointer">Privacy Policy</span>
          <span>·</span>
          <span className="hover:text-[#FAF7F2] cursor-pointer">Save to Buy Policy</span>
        </div>
      </div>
    </footer>
  );
};
