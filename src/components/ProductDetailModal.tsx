import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatNGN } from '../utils/formatters';
import { WHATSAPP_CONTACT } from '../data/mockData';
import {
  X,
  Sparkles,
  ShoppingBag,
  Heart,
  Check,
  ShieldCheck,
  Building2,
  Truck,
  MessageCircle,
  Scissors,
  Star,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartDrawerOpen,
    setSaveToBuyTargetProduct,
    setIsSaveToBuyModalOpen,
    openPaystack,
    user,
    placeOrder,
  } = useApp();

  // Active selections
  const [selectedImg, setSelectedImg] = useState<string>(product.images[0]);
  const [selectedLength, setSelectedLength] = useState<string>(product.availableLengths[0] || '20"');
  const [selectedDensity, setSelectedDensity] = useState<string>(product.availableDensities[0] || '180%');
  const [selectedLace, setSelectedLace] = useState<string>(product.laceTypes[0] || '13x6 HD Melted Lace');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Natural Black');
  const [quantity, setQuantity] = useState(1);

  // Dynamic price calculation based on length & density
  const lengthIndex = product.availableLengths.indexOf(selectedLength);
  const lengthExtra = lengthIndex > 0 ? lengthIndex * 35000 : 0;
  const densityExtra = selectedDensity.includes('250%') || selectedDensity.includes('Extra') ? 40000 : 0;
  const currentPrice = product.basePrice + lengthExtra + densityExtra;

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedLength, selectedDensity, selectedLace, selectedColor, quantity, currentPrice);
    onClose();
    setIsCartDrawerOpen(true);
  };

  const handleStartSaveToBuy = () => {
    setSaveToBuyTargetProduct({
      ...product,
      basePrice: currentPrice,
    });
    onClose();
    setIsSaveToBuyModalOpen(true);
  };

  const handleBuyNow = () => {
    openPaystack({
      amount: currentPrice * quantity,
      title: `Direct Purchase: ${product.name}`,
      purpose: 'full_order_payment',
      customerEmail: user.email,
      customerName: user.name,
      onSuccess: (reference) => {
        // Place order directly
        const cartItem = {
          cartItemId: `buy-now-${Date.now()}`,
          product,
          selectedLength,
          selectedDensity,
          selectedLace,
          selectedColor,
          quantity,
          unitPrice: currentPrice,
        };
        // Add to cart temporarily to place order
        addToCart(product, selectedLength, selectedDensity, selectedLace, selectedColor, quantity, currentPrice);
        placeOrder('delivery', user.addresses[0], reference, 'paystack_full', 'Instant Buy Now order');
        onClose();
      },
    });
  };

  const whatsappInquiryUrl = `https://wa.me/2347061728749?text=${encodeURIComponent(
    `Hello D’ROZY BEAUTY HAIR, I would like to inquire about ${product.name} (${selectedLength}, ${selectedDensity}).`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#141417] border border-[#2C2933] rounded-3xl overflow-hidden shadow-2xl my-auto text-[#FAF7F2]">
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#1F1E24]/80 text-[#9E9AA6] hover:text-[#FAF7F2] border border-[#2C2933] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6 p-6 sm:p-8 bg-[#0F0F12] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#2C2933]">
            <div className="space-y-4">
              {/* Primary Image Display */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#1A191E] border border-[#2C2933]/60 shadow-lg">
                <img
                  src={selectedImg}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all ${
                    isFavorited
                      ? 'bg-[#E8A598] text-[#0B0B0C]'
                      : 'bg-[#0B0B0C]/60 text-[#FAF7F2] hover:text-[#E8A598]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImg === img ? 'border-[#D4AF37] scale-105' : 'border-[#2C2933] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Guarantees Banner */}
            <div className="mt-6 pt-6 border-t border-[#2C2933] grid grid-cols-3 gap-3 text-center">
              <div className="p-2 rounded-xl bg-[#16161A] border border-[#2C2933]/40">
                <Scissors className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                <span className="text-[10px] text-[#FAF7F2] font-semibold block">Pre-Plucked</span>
                <span className="text-[9px] text-[#9E9AA6]">Ready to wear</span>
              </div>
              <div className="p-2 rounded-xl bg-[#16161A] border border-[#2C2933]/40">
                <Truck className="w-4 h-4 text-[#E8A598] mx-auto mb-1" />
                <span className="text-[10px] text-[#FAF7F2] font-semibold block">Fast Delivery</span>
                <span className="text-[9px] text-[#9E9AA6]">Lagos & Nationwide</span>
              </div>
              <div className="p-2 rounded-xl bg-[#16161A] border border-[#2C2933]/40">
                <Building2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] text-[#FAF7F2] font-semibold block">Bank Transfer</span>
                <span className="text-[9px] text-[#9E9AA6]">Secure Checkout</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-6 p-4 sm:p-8 flex flex-col justify-start space-y-4 sm:space-y-6">
            <div className="space-y-4 sm:space-y-5">
              {/* Header Info */}
              <div>
                <div className="flex items-center gap-2 text-xs text-[#9E9AA6] uppercase tracking-wider mb-1">
                  <span>{product.category}</span>
                  <span>·</span>
                  <span className="text-[#D4AF37]">{product.origin}</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7F2]">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-[#FAF7F2] font-semibold">{product.rating}</span>
                  <span className="text-xs text-[#9E9AA6]">({product.reviewCount} verified reviews)</span>
                </div>
              </div>

            {/* Purchase actions appear directly below the product name. */}
            <div className="space-y-2 pt-0 border-t-0">
              {/* Save to Buy Primary CTA if eligible */}
              {product.isSaveToBuyEligible && (
                <button
                  type="button"
                  onClick={handleStartSaveToBuy}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-[#0B0B0C] bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#AA8018] hover:opacity-95 transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#0B0B0C]" />
                  <span>Start Save to Buy Installment Plan</span>
                </button>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-xl font-semibold text-xs text-[#FAF7F2] bg-[#1F1E24] hover:bg-[#2A2932] border border-[#2C2933] hover:border-[#D4AF37]/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <span>Add to Bag</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-3 px-4 rounded-xl font-semibold text-xs text-[#0B0B0C] bg-[#E8A598] hover:bg-[#F3BEB3] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Pay Now in Full</span>
                </button>
              </div>



              {/* Price Row */}
              <div className="p-4 rounded-2xl bg-[#18171C] border border-[#2C2933] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#9E9AA6] uppercase font-medium">Selected Price</span>
                  <div className="text-2xl font-bold font-serif text-gold-gradient tabular-nums">
                    {formatNGN(currentPrice)}
                  </div>
                </div>

                {product.isSaveToBuyEligible && (
                  <div className="text-right">
                    <span className="text-[11px] text-[#E8A598] font-semibold flex items-center gap-1 justify-end">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      Save to Buy Plan
                    </span>
                    <div className="text-sm font-semibold text-[#D4AF37]">
                      from {formatNGN(Math.round(currentPrice * 0.25))} deposit
                    </div>
                  </div>
                )}
              </div>

              {/* Length Selector */}
              {product.availableLengths.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-[#FAF7F2] mb-2">
                    <span>Select Length</span>
                    <span className="text-[#D4AF37] font-semibold">{selectedLength}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.availableLengths.map((length) => (
                      <button
                        key={length}
                        onClick={() => setSelectedLength(length)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          selectedLength === length
                            ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-md shadow-[#D4AF37]/20 scale-105'
                            : 'bg-[#1C1B20] text-[#FAF7F2] border border-[#2C2933] hover:border-[#D4AF37]/50'
                        }`}
                      >
                        {length}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Density Selector */}
              {product.availableDensities.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-[#FAF7F2] mb-2">
                    <span>Hair Density & Fullness</span>
                    <span className="text-[#E8A598] font-semibold">{selectedDensity}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.availableDensities.map((density) => (
                      <button
                        key={density}
                        onClick={() => setSelectedDensity(density)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          selectedDensity === density
                            ? 'bg-[#E8A598] text-[#0B0B0C] shadow-md font-semibold'
                            : 'bg-[#1C1B20] text-[#FAF7F2] border border-[#2C2933] hover:border-[#E8A598]/50'
                        }`}
                      >
                        {density}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lace Type */}
              {product.laceTypes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-[#FAF7F2] mb-2">
                    <span>Lace Material</span>
                    <span className="text-[#9E9AA6]">{selectedLace}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.laceTypes.map((lace) => (
                      <button
                        key={lace}
                        onClick={() => setSelectedLace(lace)}
                        className={`py-1.5 px-3 rounded-xl text-xs transition-all cursor-pointer ${
                          selectedLace === lace
                            ? 'bg-[#2A2832] text-[#D4AF37] border border-[#D4AF37]'
                            : 'bg-[#1C1B20] text-[#9E9AA6] border border-[#2C2933]'
                        }`}
                      >
                        {lace}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-medium text-[#FAF7F2]">Quantity</span>
                <div className="flex items-center border border-[#2C2933] rounded-xl bg-[#18171C]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-sm text-[#9E9AA6] hover:text-[#FAF7F2]"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-[#FAF7F2] font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 text-sm text-[#9E9AA6] hover:text-[#FAF7F2]"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="pt-2 text-xs text-[#9E9AA6] leading-relaxed">
                {product.description}
              </div>
            </div>

              {/* WhatsApp direct chat */}
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Stylist on WhatsApp ({WHATSAPP_CONTACT})</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
