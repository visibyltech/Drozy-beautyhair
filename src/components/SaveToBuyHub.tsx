import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatNGN, calculateInstallments } from '../utils/formatters';
import { PaymentFrequency, Product } from '../types';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  CreditCard,
  MessageCircle,
  Award,
} from 'lucide-react';

export const SaveToBuyHub: React.FC = () => {
  const {
    products,
    saveToBuyPlans,
    setSaveToBuyTargetProduct,
    setIsSaveToBuyModalOpen,
    setCurrentView,
    setSelectedPlanForDetail,
  } = useApp();

  // Active calculator state
  const eligibleProducts = products.filter((p) => p.isSaveToBuyEligible);
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    eligibleProducts[0] || products[0]
  );
  const [depositPercent, setDepositPercent] = useState<number>(25);
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [frequency, setFrequency] = useState<PaymentFrequency>('biweekly');

  const totalPrice = selectedProduct ? selectedProduct.basePrice : 380000;
  const depositAmount = Math.round((totalPrice * depositPercent) / 100);
  const { balance, totalInstallments, installmentAmount } = calculateInstallments(
    totalPrice,
    depositAmount,
    durationMonths,
    frequency
  );

  const activePlans = saveToBuyPlans.filter((p) => p.status === 'active');

  const handleLaunchPlan = () => {
    setSaveToBuyTargetProduct(selectedProduct);
    setIsSaveToBuyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#FAF7F2] pb-24">
      {/* Editorial Header */}
      <div className="relative py-16 lg:py-20 border-b border-[#2C2933] overflow-hidden bg-gradient-to-b from-[#141417] via-[#0B0B0C] to-[#0B0B0C]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37] mb-4 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>0% Interest · 100% Secured Luxury</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF7F2] max-w-4xl mx-auto leading-tight">
            The Smart Way to Own <span className="text-gold-gradient">Luxury Human Hair</span>.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#9E9AA6] max-w-2xl mx-auto font-light leading-relaxed">
            Don’t break your budget or take high-interest loans. Lock in raw virgin hair at current
            prices, save on a flexible schedule, and have your crown dispatched the day you finish.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* Active Customer Plans Alert Strip (if any) */}
        {activePlans.length > 0 && (
          <div className="p-6 rounded-3xl bg-[#141417] border border-[#D4AF37]/40 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#E8A598] uppercase font-bold tracking-wider">
                  You Have Active Plans
                </span>
                <h3 className="text-lg font-bold text-[#FAF7F2] font-serif mt-0.5">
                  Plan #{activePlans[0].planNumber} · {activePlans[0].product.name}
                </h3>
                <div className="text-xs text-[#9E9AA6] mt-1 flex items-center gap-3">
                  <span>
                    Saved:{' '}
                    <strong className="text-[#D4AF37] tabular-nums">
                      {formatNGN(activePlans[0].amountSaved)}
                    </strong>{' '}
                    /{formatNGN(activePlans[0].totalProductPrice)}
                  </span>
                  <span>·</span>
                  <span>
                    Next Due:{' '}
                    <strong className="text-[#FAF7F2]">{activePlans[0].nextDueDate}</strong>
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPlanForDetail(activePlans[0]);
                  setCurrentView('customer_dashboard');
                }}
                className="py-2.5 px-5 rounded-xl font-semibold text-xs text-[#0B0B0C] bg-[#D4AF37] hover:bg-[#F3E0A3] transition-colors whitespace-nowrap cursor-pointer shadow-md"
              >
                Manage & Make Payment
              </button>
            </div>
          </div>
        )}

        {/* 3 Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#141417] border border-[#2C2933] relative group hover:border-[#D4AF37]/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-serif font-bold text-lg mb-6">
              01
            </div>
            <h3 className="font-serif text-xl font-bold text-[#FAF7F2] mb-2">
              Select Your Dream Hair
            </h3>
            <p className="text-xs sm:text-sm text-[#9E9AA6] leading-relaxed">
              Browse our Vietnamese bone straight, raw bouncy curls, or HD frontals. Choose your length,
              density, and custom styling.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#141417] border border-[#2C2933] relative group hover:border-[#E8A598]/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#E8A598]/10 border border-[#E8A598]/30 flex items-center justify-center text-[#E8A598] font-serif font-bold text-lg mb-6">
              02
            </div>
            <h3 className="font-serif text-xl font-bold text-[#FAF7F2] mb-2">
              Customize Your Plan
            </h3>
            <p className="text-xs sm:text-sm text-[#9E9AA6] leading-relaxed">
              Pay an initial deposit (20% to 50%) via Paystack to lock the item in our vault. Pick daily,
              weekly, or monthly automated installments.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#141417] border border-[#2C2933] relative group hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-serif font-bold text-lg mb-6">
              03
            </div>
            <h3 className="font-serif text-xl font-bold text-[#FAF7F2] mb-2">
              Automated VIP Dispatch
            </h3>
            <p className="text-xs sm:text-sm text-[#9E9AA6] leading-relaxed">
              Receive timely WhatsApp & Email alerts. Once your final installment is paid, our master
              stylist does the final styling and ships to your doorstep.
            </p>
          </div>
        </div>

        {/* Live Interactive Plan Simulator */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#16151B] to-[#111114] border border-[#D4AF37]/40 shadow-2xl">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Interactive Simulator
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7F2] mt-1">
              Calculate Your Installments
            </h2>
            <p className="text-xs sm:text-sm text-[#9E9AA6] mt-1">
              Select any piece from our luxury inventory below to view your personalized payment plan:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Product Selection & Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#FAF7F2] uppercase mb-2">
                  Choose Hair Unit
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {eligibleProducts.slice(0, 4).map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => setSelectedProduct(prod)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        selectedProduct.id === prod.id
                          ? 'bg-[#24222B] border-[#D4AF37] shadow-md'
                          : 'bg-[#18171C] border-[#2C2933] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-[#FAF7F2] truncate">{prod.name}</div>
                        <div className="text-[11px] text-[#D4AF37] tabular-nums font-serif">
                          {formatNGN(prod.basePrice)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deposit Slider & Buttons */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#FAF7F2]">Initial Deposit Required</span>
                  <span className="text-[#D4AF37] font-serif text-sm">
                    {depositPercent}% ({formatNGN(depositAmount)})
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[20, 25, 35, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDepositPercent(pct)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        depositPercent === pct
                          ? 'bg-[#D4AF37] text-[#0B0B0C]'
                          : 'bg-[#1C1B20] text-[#FAF7F2] border border-[#2C2933]'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration and Frequency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#FAF7F2] mb-1.5">
                    Plan Duration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setDurationMonths(m)}
                        className={`py-2 px-2 rounded-xl text-xs font-medium cursor-pointer ${
                          durationMonths === m
                            ? 'bg-[#E8A598] text-[#0B0B0C] font-semibold'
                            : 'bg-[#1C1B20] text-[#FAF7F2] border border-[#2C2933]'
                        }`}
                      >
                        {m} {m === 1 ? 'Month' : 'Months'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#FAF7F2] mb-1.5">
                    Frequency
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['weekly', 'biweekly', 'monthly'] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFrequency(f)}
                        className={`py-2 px-1 rounded-xl text-xs font-medium capitalize cursor-pointer ${
                          frequency === f
                            ? 'bg-[#2A2832] text-[#D4AF37] border border-[#D4AF37] font-semibold'
                            : 'bg-[#1C1B20] text-[#9E9AA6] border border-[#2C2933]'
                        }`}
                      >
                        {f === 'biweekly' ? 'Bi-Wk' : f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Plan Card & Action */}
            <div className="lg:col-span-5 bg-[#0F0F12] p-6 rounded-2xl border border-[#2C2933] space-y-6">
              <div className="text-center pb-4 border-b border-[#2C2933]">
                <span className="text-[11px] text-[#9E9AA6] uppercase font-semibold">
                  Calculated Installment
                </span>
                <div className="text-3xl font-bold font-serif text-[#D4AF37] tabular-nums mt-1">
                  {formatNGN(installmentAmount)}
                  <span className="text-xs text-[#9E9AA6] font-normal font-sans">
                    {' '}
                    / {frequency}
                  </span>
                </div>
                <p className="text-xs text-[#9E9AA6] mt-1">
                  Across {totalInstallments} scheduled installments
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-[#9E9AA6]">
                  <span>Product Full Price:</span>
                  <span className="text-[#FAF7F2] font-semibold tabular-nums">
                    {formatNGN(totalPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#9E9AA6]">
                  <span>Initial Deposit Today:</span>
                  <span className="text-[#D4AF37] font-semibold tabular-nums">
                    {formatNGN(depositAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#9E9AA6]">
                  <span>Remaining to Pay:</span>
                  <span className="text-[#FAF7F2] font-semibold tabular-nums">
                    {formatNGN(balance)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#9E9AA6]">
                  <span>Interest & Financing Fees:</span>
                  <span className="text-emerald-400 font-bold">₦0 (0% FREE)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLaunchPlan}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-[#0B0B0C] bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#AA8018] hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#0B0B0C]" />
                <span>Start This Plan Now</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#9E9AA6]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified by Paystack · Hair reserved in Lagos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save to Buy FAQs */}
        <div className="border-t border-[#2C2933] pt-12">
          <h3 className="font-serif text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-5 rounded-2xl bg-[#141417] border border-[#2C2933]">
              <h4 className="text-sm font-bold text-[#FAF7F2] mb-1.5">
                Can I complete payments earlier than scheduled?
              </h4>
              <p className="text-xs text-[#9E9AA6] leading-relaxed">
                Yes! You can make additional lump sums or pay off the remaining balance in full at any
                time with zero penalty or fee. Your order is dispatched immediately upon completion.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141417] border border-[#2C2933]">
              <h4 className="text-sm font-bold text-[#FAF7F2] mb-1.5">
                How do payment reminders work?
              </h4>
              <p className="text-xs text-[#9E9AA6] leading-relaxed">
                We send gentle automated WhatsApp and Email notifications 3 days before an installment is
                due, on the due date, and if an installment is overdue, with a direct 1-click Paystack
                link.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141417] border border-[#2C2933]">
              <h4 className="text-sm font-bold text-[#FAF7F2] mb-1.5">
                Is my hair reserved while I am paying?
              </h4>
              <p className="text-xs text-[#9E9AA6] leading-relaxed">
                Absolutely. The moment your initial deposit is verified, the hair bundle or wig unit is
                tagged, customized, and held securely in our Lagos boutique vault.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141417] border border-[#2C2933]">
              <h4 className="text-sm font-bold text-[#FAF7F2] mb-1.5">
                Are there interest charges or hidden extra fees?
              </h4>
              <p className="text-xs text-[#9E9AA6] leading-relaxed">
                None whatsoever. Save to Buy is 100% interest-free. You pay the exact same retail price
                as a customer paying upfront today.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
