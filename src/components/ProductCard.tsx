import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatNGN } from '../utils/formatters';
import { Heart, Sparkles, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSaveToBuyTargetProduct,
    setIsSaveToBuyModalOpen,
  } = useApp();

  const isFavorited = isInWishlist(product.id);

  // Approximate 3-month Save to Buy monthly installment (assuming 25% deposit)
  const depositEst = Math.round(product.basePrice * 0.25);
  const monthlyEst = Math.round((product.basePrice - depositEst) / 3);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultLength = product.availableLengths[0] || '18"';
    const defaultDensity = product.availableDensities[0] || '180%';
    const defaultLace = product.laceTypes[0] || 'Standard';
    const defaultColor = product.colors[0] || 'Natural';
    addToCart(product, defaultLength, defaultDensity, defaultLace, defaultColor, 1);
  };

  const handleStartSaveToBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaveToBuyTargetProduct(product);
    setIsSaveToBuyModalOpen(true);
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group relative bg-[#141417] border border-[#2C2933] hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D4AF37]/5 flex flex-col cursor-pointer"
    >
      {/* Product Image Area - 4:5 on mobile for elegant mannequin portrait, 1:1 on desktop */}
      <div className="relative aspect-[4/5] sm:aspect-[1/1] w-full overflow-hidden bg-[#1A191E]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Subtle Top Tags */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 items-start z-10">
          {product.isBestSeller && (
            <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded bg-[#D4AF37] text-[#0B0B0C] shadow-sm">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded bg-[#E8A598] text-[#0B0B0C] shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorited
              ? 'bg-[#E8A598] text-[#0B0B0C]'
              : 'bg-[#0B0B0C]/70 text-[#FAF7F2] hover:text-[#E8A598]'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Desktop Quick Action Overlay on Hover */}
        <div className="hidden sm:flex absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center gap-2 z-10">
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-[#D4AF37] text-[#0B0B0C] hover:bg-[#F3E0A3] transition-colors flex items-center justify-center gap-1.5 shadow-lg whitespace-nowrap cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="p-2 rounded-lg bg-[#141417]/90 text-[#FAF7F2] hover:text-[#D4AF37] border border-[#2C2933] transition-colors"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Origin Text Separator */}
          <div className="text-[9px] sm:text-[11px] text-[#9E9AA6] flex items-center gap-1.5 mb-1 uppercase tracking-wider truncate">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.origin}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-xs sm:text-base font-semibold text-[#FAF7F2] group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Subtitle (hidden on very small viewports if tight, visible from sm) */}
          <p className="hidden sm:block text-xs text-[#9E9AA6] line-clamp-1 mt-1 font-light">
            {product.subtitle}
          </p>
        </div>

        {/* Pricing & Save to Buy Info */}
        <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-[#2C2933]/60 flex flex-col sm:flex-row sm:items-end justify-between gap-1">
          <div>
            <div className="text-[9px] sm:text-[11px] text-[#9E9AA6]">Price</div>
            <div className="text-xs sm:text-base font-bold font-serif text-[#FAF7F2] tabular-nums text-gold-gradient">
              {formatNGN(product.basePrice)}
            </div>
          </div>

          {product.isSaveToBuyEligible ? (
            <button
              onClick={handleStartSaveToBuy}
              className="text-left sm:text-right group/stb hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center gap-1 text-[8px] sm:text-[10px] font-semibold text-[#E8A598]">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37]" />
                <span>Save to Buy</span>
              </div>
              <div className="text-[10px] sm:text-xs font-semibold text-[#D4AF37] tabular-nums">
                {formatNGN(monthlyEst)}
                <span className="text-[8px] sm:text-[10px] text-[#9E9AA6] font-normal">/mo</span>
              </div>
            </button>
          ) : (
            <span className="text-[9px] sm:text-[11px] text-[#9E9AA6] italic">Care Product</span>
          )}
        </div>

        {/* Mobile-Only Direct Quick Add Button */}
        <div className="sm:hidden mt-2 pt-2 border-t border-[#2C2933]/40 flex items-center gap-1.5">
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-1.5 px-2 rounded-lg text-[10px] font-semibold bg-[#D4AF37] text-[#0B0B0C] flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-transform"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </div>
  );
};
