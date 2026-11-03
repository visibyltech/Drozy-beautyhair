import React from 'react';
import { useApp } from '../context/AppContext';
import { HeroBanner } from './HeroBanner';
import { ProductCard } from './ProductCard';
import { ProductCategory } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Award, Star, MessageCircle } from 'lucide-react';
import { WHATSAPP_CONTACT, WHATSAPP_LINK } from '../data/mockData';

const CATEGORIES: { name: ProductCategory; desc: string; icon: string }[] = [
  { name: 'Bone Straight', desc: 'Vietnamese Super Double Drawn', icon: '✨' },
  { name: 'Curly Wigs', desc: 'Hydrated Raw Cambodian Curls', icon: '🌀' },
  { name: 'Body Wave', desc: 'Lustrous Hollywood S-Waves', icon: '🌊' },
  { name: 'Lace Frontals', desc: '0.04mm Melted Invisible HD', icon: '💎' },
  { name: 'Hair Bundles', desc: 'Raw Weft Deals & Closures', icon: '👑' },
  { name: 'Accessories & Care', desc: 'Aura Rose Elixirs & Brushes', icon: '🌸' },
];

export const Storefront: React.FC = () => {
  const { products, setCurrentView, setSelectedCategory, setSaveToBuyTargetProduct, setIsSaveToBuyModalOpen } =
    useApp();

  const bestSellers = products.filter((p) => p.isBestSeller);
  const newArrivals = products.filter((p) => p.isNewArrival);

  const handleCategoryClick = (category: ProductCategory) => {
    setSelectedCategory(category);
    setCurrentView('shop');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#FAF7F2]">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Shop By Category Grid */}
      <section className="py-16 border-b border-[#2C2933]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                Curated Collections
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7F2] mt-1">
                Shop By Hair Category
              </h2>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setCurrentView('shop');
              }}
              className="text-xs font-semibold text-[#D4AF37] hover:text-[#F3E0A3] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="group p-5 rounded-2xl bg-[#141417] border border-[#2C2933] hover:border-[#D4AF37]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer text-center flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#1C1B20] border border-[#2C2933] group-hover:border-[#D4AF37] flex items-center justify-center text-xl transition-all">
                  {cat.icon}
                </div>
                <h3 className="font-serif text-sm font-bold text-[#FAF7F2] group-hover:text-[#D4AF37] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#9E9AA6] line-clamp-1 font-light">
                  {cat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Masterpieces / Best Sellers */}
      <section className="py-16 border-b border-[#2C2933]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-semibold text-[#E8A598] uppercase tracking-wider">
                Most Desired
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7F2] mt-1">
                Best Selling Luxury Units
              </h2>
            </div>
            <button
              onClick={() => setCurrentView('shop')}
              className="text-xs font-semibold text-[#D4AF37] hover:text-[#F3E0A3] flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Complete Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Save to Buy Promotional Spotlight Banner */}
      <section className="py-16 bg-gradient-to-r from-[#18171D] via-[#221C22] to-[#18171D] border-b border-[#2C2933] relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Flagship Benefit · Save to Buy</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF7F2] leading-tight">
                Don’t Wait for a Full Payday.{' '}
                <span className="text-gold-gradient block sm:inline">
                  Lock In Your Hair with Installment Savings.
                </span>
              </h2>
              <p className="text-sm text-[#9E9AA6] max-w-2xl leading-relaxed">
                Choose any wig or bundle set. Pay a small initial deposit (20%–50%) via Paystack.
                We reserve your unit in our Lagos vault while you save daily, weekly, or monthly.
                100% interest-free!
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setCurrentView('savetobuy_hub')}
                  className="py-3 px-6 rounded-xl font-bold text-xs text-[#0B0B0C] bg-[#D4AF37] hover:bg-[#F3E0A3] transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-[#0B0B0C]" />
                  <span>Explore Save to Buy Plans</span>
                </button>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-5 rounded-xl font-medium text-xs text-[#FAF7F2] hover:text-emerald-400 bg-[#16161A] border border-[#2C2933] transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Ask a Question on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-3xl bg-[#141417] border border-[#D4AF37]/30 text-center space-y-3 shadow-xl">
              <span className="text-xs uppercase text-[#9E9AA6] font-semibold">Example Plan</span>
              <div className="text-2xl font-bold font-serif text-[#D4AF37]">
                ₦52,500 <span className="text-xs text-[#FAF7F2] font-normal font-sans">/ 2 weeks</span>
              </div>
              <p className="text-xs text-[#9E9AA6]">
                For a 26" Super Double Drawn Bone Straight unit worth ₦420,000.
              </p>
              <div className="pt-2 border-t border-[#2C2933] text-[11px] text-emerald-400 font-medium">
                0% Interest · 100% Guaranteed Hair Hold
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. New Arrivals Showcase */}
      <section className="py-16 border-b border-[#2C2933]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                Fresh From The Atelier
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7F2] mt-1">
                New Arrivals
              </h2>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setCurrentView('shop');
              }}
              className="text-xs font-semibold text-[#D4AF37] hover:underline"
            >
              See All Items
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials & Social Proof */}
      <section className="py-16 bg-[#0E0E11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-[#E8A598] uppercase tracking-wider">
              Client Experiences
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#FAF7F2] mt-1">
              Loved by Discerning Women Across Nigeria
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#141417] border border-[#2C2933] space-y-3">
              <div className="flex items-center text-[#D4AF37] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#FAF7F2] italic leading-relaxed">
                "The bone straight wig I got is literally like liquid silk. I used the Save to Buy plan
                over 2 months, made bi-weekly payments, and it arrived styled to perfection in Lekki!"
              </p>
              <div className="text-xs font-bold text-[#D4AF37]">Amina Bello, Abuja</div>
            </div>

            <div className="p-6 rounded-3xl bg-[#141417] border border-[#2C2933] space-y-3">
              <div className="flex items-center text-[#D4AF37] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#FAF7F2] italic leading-relaxed">
                "The HD lace melts into my scalp so invisibly even my husband thought my hair grew out
                overnight. Customer support on WhatsApp answered all my questions within minutes."
              </p>
              <div className="text-xs font-bold text-[#D4AF37]">Ngozi Eze, Port Harcourt</div>
            </div>

            <div className="p-6 rounded-3xl bg-[#141417] border border-[#2C2933] space-y-3">
              <div className="flex items-center text-[#D4AF37] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#FAF7F2] italic leading-relaxed">
                "Aura Rose serum is a holy grail! Kept my Cambodian deep waves soft, hydrated, and bouncy
                for weeks without stiffness. D'ROZY is truly the home of luxury hair."
              </p>
              <div className="text-xs font-bold text-[#D4AF37]">Folashade Adeleke, Lagos</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
