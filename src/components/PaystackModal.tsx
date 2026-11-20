import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatNGN } from '../utils/formatters';
import { ShieldCheck, Building2, Copy, Check, MessageCircle, X } from 'lucide-react';

const BANK_NAME = 'Moniepoint';
const ACCOUNT_NAME = "D’ROZY BEAUTY HAIR";
const ACCOUNT_NUMBER = '3008125701';
const BUSINESS_WHATSAPP = '2347061728749';

export const PaystackModal: React.FC = () => {
  const { paystackModalConfig, closePaystack } = useApp();
  const [copied, setCopied] = useState(false);

  if (!paystackModalConfig) return null;

  const reference = `DRZ-${paystackModalConfig.purpose === 'save_to_buy_deposit' ? 'STB' : 'ORD'}-${Date.now().toString().slice(-8)}`;
  const message = [
    'Hello D’ROZY BEAUTY HAIR, I have made a bank transfer.',
    `Payment type: ${paystackModalConfig.title}`,
    `Amount: ${formatNGN(paystackModalConfig.amount)}`,
    `Reference: ${reference}`,
    `Name: ${paystackModalConfig.customerName}`,
    `Email: ${paystackModalConfig.customerEmail}`,
    'Please confirm my payment. I will attach my transfer receipt.'
  ].join('\n');
  const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`;

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(ACCOUNT_NUMBER);
      setCopied(true);
    } catch {
      const field = document.createElement('textarea');
      field.value = ACCOUNT_NUMBER;
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      document.body.removeChild(field);
      setCopied(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#16161A] border border-[#D4AF37]/40 rounded-2xl overflow-hidden shadow-2xl text-[#FAF7F2]">
        <div className="bg-[#1F1E24] px-5 py-4 border-b border-[#2C2933] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#FAF7F2]">Bank Transfer</h3>
              <p className="text-[11px] text-[#9E9AA6]">D’ROZY BEAUTY HAIR</p>
            </div>
          </div>
          <button onClick={closePaystack} aria-label="Close bank transfer details" className="p-2 text-[#9E9AA6] hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-center pb-4 border-b border-[#2C2933]">
            <p className="text-xs text-[#9E9AA6] uppercase tracking-wider">{paystackModalConfig.title}</p>
            <p className="text-3xl font-bold font-serif text-[#D4AF37] mt-1 tabular-nums">{formatNGN(paystackModalConfig.amount)}</p>
            <p className="text-[11px] text-[#9E9AA6] mt-1">Customer: {paystackModalConfig.customerName || paystackModalConfig.customerEmail}</p>
          </div>

          <div className="rounded-xl border border-[#D4AF37]/35 bg-[#0F0F12] p-4 space-y-3">
            <div>
              <p className="text-[10px] text-[#9E9AA6] uppercase tracking-wider">Bank</p>
              <p className="text-sm font-semibold">{BANK_NAME}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#9E9AA6] uppercase tracking-wider">Account Name</p>
              <p className="text-sm font-semibold">{ACCOUNT_NAME}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#9E9AA6] uppercase tracking-wider">Account Number</p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-2xl font-mono font-bold tracking-wider text-[#D4AF37]">{ACCOUNT_NUMBER}</p>
                <button type="button" onClick={copyAccountNumber} className="shrink-0 flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/40 px-3 py-2 text-xs text-[#D4AF37]">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 p-3 text-xs text-[#E8D9AE] leading-relaxed">
            Transfer the exact amount shown above. Use the reference below as your payment narration where your banking app allows it.
            <p className="font-mono font-semibold text-[#D4AF37] mt-2 select-all">{reference}</p>
          </div>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-[#07130F] bg-[#25D366] hover:bg-[#32e477] transition-all flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span>Send Transfer Receipt on WhatsApp</span>
          </a>

          <p className="flex items-start gap-2 text-[11px] text-[#9E9AA6] leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            Your order or Save to Buy plan is not marked as paid by this screen. D’ROZY must confirm the transfer before payment is recorded and a Save to Buy plan is activated.
          </p>
        </div>
      </div>
    </div>
  );
};
