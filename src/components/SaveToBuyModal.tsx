import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatNGN, calculateInstallments } from '../utils/formatters';
import { PaymentFrequency } from '../types';
import {
  X,
  Sparkles,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const SaveToBuyModal: React.FC = () => {
  const {
    isSaveToBuyModalOpen,
    setIsSaveToBuyModalOpen,
    saveToBuyTargetProduct,
    createSaveToBuyPlan,
    openPaystack,
    user,
    setCurrentView,
  } = useApp();

  // If no product is set, default to first item
  const product = saveToBuyTargetProduct;

  // Selected specs
  const [selectedLength, setSelectedLength] = useState<string>(
    product?.availableLengths[0] || '22"'
  );
  const [selectedDensity, setSelectedDensity] = useState<string>(
    product?.availableDensities[0] || '180%'
  );

  // Configuration options
  const [depositPercent, setDepositPercent] = useState<number>(25); // 20%, 25%, 35%, 50%
  const [durationMonths, setDurationMonths] = useState<number>(2); // 1, 2, 3, 4
  const [frequency, setFrequency] = useState<PaymentFrequency>('biweekly');

  if (!isSaveToBuyModalOpen || !product) return null;

  const totalPrice = product.basePrice;
  const depositAmount = Math.round((totalPrice * depositPercent) / 100);
  const { balance, totalInstallments, installmentAmount } = calculateInstallments(
    totalPrice,
    depositAmount,
    durationMonths,
    frequency
  );

  // Generate preview dates
  const now = new Date();
  const projectedDates: { num: number; dateStr: string; amount: number }[] = [];
  for (let i = 1; i <= Math.min(5, totalInstallments); i++) {
    const d = new Date(now);
    if (frequency === 'daily') d.setDate(d.getDate() + i);
    else if (frequency === 'weekly') d.setDate(d.getDate() + i * 7);
    else if (frequency === 'biweekly') d.setDate(d.getDate() + i * 14);
    else d.setMonth(d.getMonth() + i);

    projectedDates.push({
      num: i,
      dateStr: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      amount: installmentAmount,
    });
  }

  const handleProceedToDeposit = () => {
    openPaystack({
      amount: depositAmount,
      title: `Save to Buy Initial Deposit (${depositPercent}%)`,
      subtitle: product.name,
      purpose: 'save_to_buy_deposit',
      customerEmail: user.email,
      customerName: user.name,
      onSuccess: (paymentRef, method) => {
        createSaveToBuyPlan(
          product,
          {
            length: selectedLength,
            density: selectedDensity,
            lace: product.laceTypes[0] || 'HD Lace',
            color: product.colors[0] || 'Natural Black',
          },
          totalPrice,
          depositAmount,
          durationMonths,
          frequency,
          paymentRef,
          method
        );
        setIsSaveToBuyModalOpen(false);
        setCurrentView('customer_dashboard');
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#141417] border border-[#D4AF37]/40 rounded-3xl overflow-hidden shadow-2xl my-auto text-[#FAF7F2] animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setIsSaveToBuyModalOpen(false)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#1F1E24]/80 text-[#9E9AA6] hover:text-[#FAF7F2] border border-[#2C2933] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E1C24] via-[#282129] to-[#1E1C24] p-6 sm:p-8 border-b border-[#2C2933]">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase mb-1">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>D’ROZY Save to Buy · 0% Interest Installment Plan</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7F2]">
            Reserve Your Crown. Save at Your Pace.
          </h2>
          <p className="text-xs sm:text-sm text-[#9E9AA6] mt-1 max-w-xl">
            Secure this exact human hair unit at today’s price. Your product is styled and reserved
            in our VIP vault while you save.
          </p>
        </div>

        {/* Body Configurator */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Target Product Summary */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0F0F12] border border-[#2C2933]">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-16 h-16 rounded-xl object-cover border border-[#2C2933]"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-[#D4AF37] uppercase font-semibold">
                {product.category} · {product.origin}
              </span>
              <h4 className="text-sm font-semibold text-[#FAF7F2] truncate">{product.name}</h4>
              <div className="text-xs text-[#9E9AA6] mt-0.5">
                Total Hair Value:{' '}
                <strong className="text-[#FAF7F2] tabular-nums">{formatNGN(totalPrice)}</strong>
              </div>
            </div>
          </div>

          {/* Configurator Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Control 1: Initial Deposit % */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#FAF7F2]">Initial Deposit</span>
                <span className="text-[#D4AF37] font-serif text-sm tabular-nums">
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
                        ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-md'
                        : 'bg-[#1C1B20] text-[#FAF7F2] border border-[#2C2933] hover:border-[#D4AF37]/50'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#9E9AA6]">
                Locks in your hair piece instantly upon verified payment.
              </p>
            </div>

            {/* Control 2: Duration */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#FAF7F2]">Plan Duration</span>
                <span className="text-[#E8A598] font-serif text-sm">
                  {durationMonths} {durationMonths === 1 ? 'Month' : 'Months'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDurationMonths(m)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      durationMonths === m
                        ? 'bg-[#E8A598] text-[#0B0B0C] shadow-md'
                        : 'bg-[#1C1B20] text-[#FAF7F2] border border-[#2C2933] hover:border-[#E8A598]/50'
                    }`}
                  >
                    {m} {m === 1 ? 'Mo' : 'Mos'}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#9E9AA6]">You can pay off early at any time with 0 penalties.</p>
            </div>

            {/* Control 3: Frequency */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#FAF7F2]">Payment Frequency</span>
                <span className="text-[#D4AF37] capitalize">{frequency} Installments</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    { id: 'daily', label: 'Daily' },
                    { id: 'weekly', label: 'Weekly' },
                    { id: 'biweekly', label: 'Bi-Weekly' },
                    { id: 'monthly', label: 'Monthly' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFrequency(item.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      frequency === item.id
                        ? 'bg-[#2A2832] text-[#D4AF37] border border-[#D4AF37]'
                        : 'bg-[#1C1B20] text-[#9E9AA6] border border-[#2C2933]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-Time Calculation Matrix */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1C1B22] to-[#141418] border border-[#D4AF37]/30 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-[11px] text-[#9E9AA6] uppercase">Total Price</span>
                <div className="text-base font-bold font-serif text-[#FAF7F2] tabular-nums mt-0.5">
                  {formatNGN(totalPrice)}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-[#9E9AA6] uppercase">Deposit Today</span>
                <div className="text-base font-bold font-serif text-[#D4AF37] tabular-nums mt-0.5">
                  {formatNGN(depositAmount)}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-[#9E9AA6] uppercase">Remaining Balance</span>
                <div className="text-base font-bold font-serif text-[#FAF7F2] tabular-nums mt-0.5">
                  {formatNGN(balance)}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-[#E8A598] uppercase font-semibold">
                  Each Installment
                </span>
                <div className="text-base font-bold font-serif text-[#E8A598] tabular-nums mt-0.5">
                  {formatNGN(installmentAmount)}
                </div>
              </div>
            </div>

            {/* Projected Timeline Preview */}
            <div className="pt-4 border-t border-[#2C2933]">
              <span className="text-xs font-semibold text-[#FAF7F2] block mb-2">
                Projected Payment Schedule:
              </span>
              <div className="space-y-1.5 text-xs text-[#9E9AA6]">
                <div className="flex items-center justify-between text-[#FAF7F2] font-semibold py-1 px-2.5 rounded-lg bg-[#2A2832]/60">
                  <span>Today (Deposit)</span>
                  <span className="text-[#D4AF37] tabular-nums">{formatNGN(depositAmount)}</span>
                </div>
                {projectedDates.map((item) => (
                  <div
                    key={item.num}
                    className="flex items-center justify-between py-1 px-2.5 rounded-lg hover:bg-[#1A191E]"
                  >
                    <span>
                      Installment #{item.num} ({item.dateStr})
                    </span>
                    <span className="text-[#FAF7F2] tabular-nums">{formatNGN(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Save to Buy Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#9E9AA6]">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Zero hidden interest or markup. Exact retail price.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Automated WhatsApp & Email reminders before due date.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Instant VIP dispatch once final payment is verified.</span>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleProceedToDeposit}
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-[#0B0B0C] bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#AA8018] hover:opacity-95 transition-all shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#0B0B0C]" />
              <span>Pay Deposit {formatNGN(depositAmount)} via Paystack & Activate Plan</span>
            </button>
            <p className="text-center text-[11px] text-[#9E9AA6] mt-2">
              Payment will be verified in real time on the Paystack gateway.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
