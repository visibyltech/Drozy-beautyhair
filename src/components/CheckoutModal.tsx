import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatNGN } from '../utils/formatters';
import { CustomerAddress } from '../types';
import {
  X,
  ShieldCheck,
  Truck,
  MapPin,
  Lock,
  ArrowRight,
  Sparkles,
  CreditCard,
  Building,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NIGERIAN_STATES = [
  'Lagos State',
  'Abuja (FCT)',
  'Rivers State (Port Harcourt)',
  'Oyo State (Ibadan)',
  'Ogun State',
  'Enugu State',
  'Delta State',
  'Anambra State',
  'Kano State',
  'Edo State (Benin)',
  'Akwa Ibom State',
  'Cross River State (Calabar)',
  'Kaduna State',
  'Imo State',
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, cartTotal, user, placeOrder, openPaystack, setCurrentView } = useApp();

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [recipientName, setRecipientName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.addresses[0]?.address || 'Plot 14, Admiralty Way');
  const [city, setCity] = useState(user.addresses[0]?.city || 'Lagos');
  const [state, setState] = useState(user.addresses[0]?.state || 'Lagos State');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const isFreeShipping = cartTotal >= 300000 || deliveryType === 'pickup';
  const shippingFee = isFreeShipping ? 0 : 5000;
  const grandTotal = cartTotal + shippingFee;

  const handlePaystackPayment = () => {
    const addressObj: CustomerAddress = {
      id: `addr-${Date.now()}`,
      title: 'Checkout Delivery Address',
      recipientName,
      phone,
      address,
      city,
      state,
      isDefault: false,
    };

    openPaystack({
      amount: grandTotal,
      title: 'D’ROZY Online Order Payment',
      subtitle: `${cart.length} Luxury Hair Items`,
      purpose: 'full_order_payment',
      customerEmail: email,
      customerName: recipientName,
      onSuccess: (paymentRef) => {
        placeOrder(deliveryType, addressObj, paymentRef, 'paystack_full', notes);
        onClose();
        setCurrentView('customer_dashboard');
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#141417] border border-[#2C2933] rounded-3xl overflow-hidden shadow-2xl my-auto text-[#FAF7F2]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#1F1E24]/80 text-[#9E9AA6] hover:text-[#FAF7F2] border border-[#2C2933]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Delivery & Customer Info */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                Secure Checkout
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#FAF7F2] mt-0.5">
                Delivery & Contact Details
              </h2>
            </div>

            {/* Delivery vs Boutique Pickup Selector */}
            <div className="grid grid-cols-2 gap-3 p-1 bg-[#0F0F12] rounded-2xl border border-[#2C2933]">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  deliveryType === 'delivery'
                    ? 'bg-[#2A2832] text-[#D4AF37] shadow-sm'
                    : 'text-[#9E9AA6] hover:text-[#FAF7F2]'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Doorstep Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  deliveryType === 'pickup'
                    ? 'bg-[#2A2832] text-[#D4AF37] shadow-sm'
                    : 'text-[#9E9AA6] hover:text-[#FAF7F2]'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Lekki Boutique Pickup</span>
              </button>
            </div>

            {deliveryType === 'pickup' ? (
              <div className="p-4 rounded-2xl bg-[#1A191E] border border-[#D4AF37]/30 text-xs space-y-2">
                <span className="text-[#D4AF37] font-semibold flex items-center gap-1.5">
                  <Building className="w-4 h-4" />
                  D’ROZY Luxury Flagship Showroom
                </span>
                <p className="text-[#9E9AA6] leading-relaxed">
                  Admiralty Way, Lekki Phase 1, Lagos, Nigeria.
                  <br />
                  Ready within 24 hours of styling. Our concierge will notify you on WhatsApp.
                </p>
              </div>
            ) : null}

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#9E9AA6] uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-[#0F0F12] border border-[#2C2933] focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-[#FAF7F2] focus:outline-none"
                    placeholder="Recipient's Name"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#9E9AA6] uppercase mb-1">
                    Phone (WhatsApp preferred)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0F0F12] border border-[#2C2933] focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-[#FAF7F2] font-mono focus:outline-none"
                    placeholder="+234 800 000 0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#9E9AA6] uppercase mb-1">
                  Email Address (Receipt & Paystack verification)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0F0F12] border border-[#2C2933] focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-[#FAF7F2] focus:outline-none"
                  placeholder="your.email@domain.com"
                />
              </div>

              {deliveryType === 'delivery' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#9E9AA6] uppercase mb-1">
                        State
                      </label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-[#0F0F12] border border-[#2C2933] focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-xs text-[#FAF7F2] focus:outline-none"
                      >
                        {NIGERIAN_STATES.map((st) => (
                          <option key={st} value={st} className="bg-[#141417]">
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#9E9AA6] uppercase mb-1">
                        City / Area
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#0F0F12] border border-[#2C2933] focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-[#FAF7F2] focus:outline-none"
                        placeholder="e.g. Lekki, Ikeja, Garki, Port Harcourt"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#9E9AA6] uppercase mb-1">
                      Street Address & Landmark
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#0F0F12] border border-[#2C2933] focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-[#FAF7F2] focus:outline-none"
                      placeholder="e.g. House 12, Close 4, Admiralty Way, near IMAX"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-[#9E9AA6] uppercase mb-1">
                  Order Styling Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#0F0F12] border border-[#2C2933] focus:border-[#D4AF37] rounded-xl px-3.5 py-2 text-xs text-[#FAF7F2] focus:outline-none resize-none"
                  placeholder="Special instructions for custom cap size, lace tinting, or delivery..."
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Paystack Action */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#18171C] border-t lg:border-t-0 lg:border-l border-[#2C2933] flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#FAF7F2]">Order Summary</h3>

              {/* Items List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover border border-[#2C2933]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#FAF7F2] truncate">
                        {item.product.name}
                      </div>
                      <div className="text-[11px] text-[#9E9AA6]">
                        {item.selectedLength} · Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="font-mono text-[#D4AF37] tabular-nums font-semibold">
                      {formatNGN(item.unitPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Calculation */}
              <div className="pt-4 border-t border-[#2C2933] space-y-2 text-xs">
                <div className="flex justify-between text-[#9E9AA6]">
                  <span>Items Subtotal</span>
                  <span className="text-[#FAF7F2] font-mono tabular-nums">{formatNGN(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-[#9E9AA6]">
                  <span>Delivery ({deliveryType === 'delivery' ? state : 'Boutique Pickup'})</span>
                  <span className={isFreeShipping ? 'text-emerald-400 font-semibold' : 'text-[#FAF7F2] font-mono'}>
                    {isFreeShipping ? 'FREE' : formatNGN(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-[#FAF7F2] pt-3 border-t border-[#2C2933]">
                  <span>Total Due</span>
                  <span className="text-[#D4AF37] font-serif text-xl tabular-nums">
                    {formatNGN(grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Paystack CTA */}
            <div className="pt-6 space-y-3">
              <button
                type="button"
                onClick={handlePaystackPayment}
                className="w-full py-4 px-4 rounded-xl font-bold text-sm text-[#0B0B0C] bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#AA8018] hover:opacity-95 transition-all shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#0B0B0C]" />
                <span>Pay {formatNGN(grandTotal)} with Paystack</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#9E9AA6]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cards, Bank Transfer, USSD · Backend Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
