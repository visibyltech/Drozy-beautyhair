import React from 'react';
import { useApp } from '../context/AppContext';
import { formatNGN } from '../utils/formatters';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQty,
    cartTotal,
    setCurrentView,
  } = useApp();

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 300000;
  const isFreeShipping = cartTotal >= freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((cartTotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartDrawerOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#141417] border-l border-[#2C2933] shadow-2xl flex flex-col text-[#FAF7F2]">
          {/* Header */}
          <div className="p-6 border-b border-[#2C2933] flex items-center justify-between bg-[#16161A]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-serif text-lg font-bold">Shopping Bag</h3>
              <span className="text-xs text-[#9E9AA6]">({cart.length} items)</span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-lg text-[#9E9AA6] hover:text-[#FAF7F2] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          <div className="px-6 py-3 bg-[#0F0F12] border-b border-[#2C2933] text-xs">
            {isFreeShipping ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Congratulations! You’ve unlocked FREE Nationwide VIP Delivery.
              </span>
            ) : (
              <div>
                <span className="text-[#9E9AA6]">
                  Add <strong className="text-[#D4AF37]">{formatNGN(freeShippingThreshold - cartTotal)}</strong> more for Free Nationwide VIP Delivery!
                </span>
                <div className="w-full bg-[#2C2933] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#D4AF37] to-[#E8A598] h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#2C2933] mx-auto" />
                <h4 className="font-serif text-base font-semibold text-[#FAF7F2]">Your bag is empty</h4>
                <p className="text-xs text-[#9E9AA6]">Explore our 100% human hair collection.</p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentView('shop');
                  }}
                  className="mt-2 py-2 px-4 rounded-xl text-xs font-semibold text-[#0B0B0C] bg-[#D4AF37]"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-4 p-3 rounded-2xl bg-[#18171C] border border-[#2C2933]/70"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover border border-[#2C2933]"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#FAF7F2] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-[#9E9AA6] hover:text-red-400 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-[#9E9AA6] mt-0.5 space-x-1">
                        <span>{item.selectedLength}</span>
                        <span>·</span>
                        <span>{item.selectedDensity}</span>
                        <span>·</span>
                        <span className="truncate">{item.selectedLace}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#2C2933]">
                      <div className="flex items-center border border-[#2C2933] rounded-lg bg-[#0F0F12]">
                        <button
                          onClick={() => updateCartQty(item.cartItemId, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#9E9AA6] hover:text-[#FAF7F2]"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-mono font-bold text-[#FAF7F2]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.cartItemId, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#9E9AA6] hover:text-[#FAF7F2]"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-xs font-bold font-serif text-[#D4AF37] tabular-nums">
                        {formatNGN(item.unitPrice * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#2C2933] bg-[#16161A] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#9E9AA6]">
                  <span>Subtotal</span>
                  <span className="text-[#FAF7F2] font-semibold tabular-nums">
                    {formatNGN(cartTotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#9E9AA6]">
                  <span>Delivery Estimate</span>
                  <span className={isFreeShipping ? 'text-emerald-400 font-semibold' : 'text-[#FAF7F2]'}>
                    {isFreeShipping ? 'FREE' : formatNGN(5000)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-[#FAF7F2] pt-2 border-t border-[#2C2933]">
                  <span>Estimated Total</span>
                  <span className="text-[#D4AF37] font-serif text-lg tabular-nums">
                    {formatNGN(cartTotal + (isFreeShipping ? 0 : 5000))}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-[#0B0B0C] bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#AA8018] hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#0B0B0C]" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#9E9AA6]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Paystack Payments · 100% Genuine Human Hair</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
