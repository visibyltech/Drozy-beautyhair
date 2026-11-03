import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatNGN, generatePaystackRef } from '../utils/formatters';
import { ShieldCheck, CreditCard, Building2, Smartphone, Lock, CheckCircle2, Loader2, X } from 'lucide-react';

export const PaystackModal: React.FC = () => {
  const { paystackModalConfig, closePaystack } = useApp();
  const [activeTab, setActiveTab] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [cardNumber, setCardNumber] = useState('5399 8321 9012 4432');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('821');

  if (!paystackModalConfig) return null;

  const handlePay = () => {
    setIsProcessing(true);

    // Simulate Paystack secure backend authorization and webhook confirmation
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const ref = generatePaystackRef(
        paystackModalConfig.purpose === 'save_to_buy_deposit'
          ? 'PAY_DRZ_DEP'
          : paystackModalConfig.purpose === 'save_to_buy_installment'
          ? 'PAY_DRZ_INS'
          : 'PAY_DRZ_ORD'
      );

      const method =
        activeTab === 'card'
          ? 'Paystack Card'
          : activeTab === 'transfer'
          ? 'Paystack Transfer'
          : 'Paystack USSD';

      setTimeout(() => {
        setIsSuccess(false);
        paystackModalConfig.onSuccess(ref, method);
        closePaystack();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#16161A] border border-[#2C2933] rounded-2xl overflow-hidden shadow-2xl text-[#FAF7F2]">
        {/* Paystack Header */}
        <div className="bg-[#1F1E24] px-6 py-4 border-b border-[#2C2933] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs tracking-wider">
              P
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">
                  Paystack Checkout
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[11px] text-[#9E9AA6]">D’ROZY BEAUTY HAIR (Lagos, NG)</p>
            </div>
          </div>
          <button
            onClick={closePaystack}
            disabled={isProcessing}
            className="p-1 text-[#9E9AA6] hover:text-[#FAF7F2] transition-colors rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF7F2] font-serif">Payment Verified!</h3>
              <p className="text-xs text-[#9E9AA6] mt-2 max-w-xs">
                Transaction authorized securely. Updating your records in real-time...
              </p>
            </div>
          ) : (
            <>
              {/* Payment Summary */}
              <div className="text-center pb-5 border-b border-[#2C2933]">
                <span className="text-xs text-[#9E9AA6] uppercase tracking-wider font-medium">
                  {paystackModalConfig.title}
                </span>
                <div className="text-3xl font-bold font-serif text-[#D4AF37] mt-1 tabular-nums">
                  {formatNGN(paystackModalConfig.amount)}
                </div>
                <p className="text-xs text-[#9E9AA6] mt-1">
                  Payer: {paystackModalConfig.customerEmail}
                </p>
              </div>

              {/* Payment Method Tabs */}
              <div className="grid grid-cols-3 gap-2 my-5 p-1 bg-[#0F0F12] rounded-xl border border-[#2C2933]">
                <button
                  type="button"
                  onClick={() => setActiveTab('card')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'card'
                      ? 'bg-[#2A2832] text-[#D4AF37] shadow-sm'
                      : 'text-[#9E9AA6] hover:text-[#FAF7F2]'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('transfer')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'transfer'
                      ? 'bg-[#2A2832] text-[#D4AF37] shadow-sm'
                      : 'text-[#9E9AA6] hover:text-[#FAF7F2]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Transfer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ussd')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'ussd'
                      ? 'bg-[#2A2832] text-[#D4AF37] shadow-sm'
                      : 'text-[#9E9AA6] hover:text-[#FAF7F2]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>USSD</span>
                </button>
              </div>

              {/* Tab Form */}
              {activeTab === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#9E9AA6] uppercase mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-[#0F0F12] border border-[#2C2933] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-sm text-[#FAF7F2] font-mono tracking-wider focus:outline-none"
                        placeholder="5399 0000 0000 0000"
                      />
                      <div className="absolute right-3 top-2.5 flex items-center gap-1">
                        <span className="text-[10px] bg-[#2C2933] px-1.5 py-0.5 rounded text-[#D4AF37]">
                          Mastercard
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#9E9AA6] uppercase mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-[#0F0F12] border border-[#2C2933] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-sm text-[#FAF7F2] font-mono focus:outline-none text-center"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#9E9AA6] uppercase mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-[#0F0F12] border border-[#2C2933] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-sm text-[#FAF7F2] font-mono focus:outline-none text-center"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'transfer' && (
                <div className="p-4 bg-[#0F0F12] rounded-xl border border-[#2C2933] text-center space-y-2">
                  <p className="text-xs text-[#9E9AA6]">
                    Transfer exactly <strong className="text-[#D4AF37]">{formatNGN(paystackModalConfig.amount)}</strong> to the dynamic account below:
                  </p>
                  <div className="p-3 bg-[#1A191E] rounded-lg border border-[#2C2933]">
                    <div className="text-[11px] text-[#9E9AA6] uppercase">Bank Name</div>
                    <div className="text-sm font-semibold text-[#FAF7F2]">Titan Trust / Wema Bank</div>
                    <div className="text-[11px] text-[#9E9AA6] uppercase mt-2">Account Number</div>
                    <div className="text-lg font-mono font-bold text-[#D4AF37] tracking-wider">
                      9934 182 710
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-1">Expires in 29:45 mins</div>
                  </div>
                </div>
              )}

              {activeTab === 'ussd' && (
                <div className="p-4 bg-[#0F0F12] rounded-xl border border-[#2C2933] text-center space-y-3">
                  <p className="text-xs text-[#9E9AA6]">Select your Nigerian bank to generate USSD code:</p>
                  <div className="p-3 bg-[#1A191E] rounded-lg font-mono text-sm text-[#D4AF37] font-semibold">
                    *737*000*8192# (GTBank)
                  </div>
                  <p className="text-[11px] text-[#9E9AA6]">Dial on your registered SIM card to complete payment.</p>
                </div>
              )}

              {/* Pay Action Button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="mt-6 w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-[#0B0B0C] bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#AA8018] hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#0B0B0C]" />
                    <span>Verifying with Paystack...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#0B0B0C]" />
                    <span>Pay {formatNGN(paystackModalConfig.amount)}</span>
                  </>
                )}
              </button>

              {/* Security Badge */}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#9E9AA6]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-bit SSL Encrypted · PCI-DSS Level 1 Certified</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
