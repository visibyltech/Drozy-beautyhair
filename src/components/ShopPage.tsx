import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { ProductCategory } from '../types';
import { Search, Filter, Sparkles, X, SlidersHorizontal } from 'lucide-react';

const CATEGORIES: ProductCategory[] = [
  'All',
  'Bone Straight',
  'Curly Wigs',
  'Body Wave',
  'Deep Wave',
  'Lace Frontals',
  'Hair Bundles',
  'Accessories & Care',
];

export const ShopPage: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useApp();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [saveToBuyOnly, setSaveToBuyOnly] = useState(false);
  const [selectedLength, setSelectedLength] = useState<string>('all');

  // Filter products
  const filteredProducts = products.filter((prod) => {
    // Category match
    if (selectedCategory !== 'All' && prod.category !== selectedCategory) {
      return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchSubtitle = prod.subtitle.toLowerCase().includes(q);
      const matchCategory = prod.category.toLowerCase().includes(q);
      const matchOrigin = prod.origin.toLowerCase().includes(q);
      if (!matchName && !matchSubtitle && !matchCategory && !matchOrigin) return false;
    }

    // Save to Buy filter
    if (saveToBuyOnly && !prod.isSaveToBuyEligible) {
      return false;
    }

    // Length filter
    if (selectedLength !== 'all') {
      const hasLength = prod.availableLengths.some((l) => l.includes(selectedLength));
      if (!hasLength) return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
    if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default featured order
  });

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest">
            The Complete Atelier
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF7F2]">
            Shop Luxury Hair Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#9E9AA6]">
            100% human hair, Vietnamese bone straight, melted Swiss HD frontals, and care essentials.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-6 rounded-3xl bg-[#141417] border border-[#2C2933] space-y-4 shadow-xl">
          {/* Top Row: Search and Quick Filter Toggles */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#9E9AA6] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by hair texture, bone straight, bundles, origin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0F0F12] border border-[#2C2933] focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#FAF7F2] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-[#9E9AA6] hover:text-[#FAF7F2]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort & Save to Buy Only Toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSaveToBuyOnly(!saveToBuyOnly)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  saveToBuyOnly
                    ? 'bg-[#D4AF37] text-[#0B0B0C]'
                    : 'bg-[#0F0F12] text-[#FAF7F2] border border-[#2C2933]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save to Buy Only</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#0F0F12] border border-[#2C2933] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:outline-none cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated (5★)</option>
              </select>
            </div>
          </div>

          {/* Category Chips Bar (Single-Line Buttons) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-2 px-4 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#D4AF37] text-[#0B0B0C] font-semibold shadow-md'
                    : 'bg-[#1C1B20] text-[#9E9AA6] hover:text-[#FAF7F2] border border-[#2C2933]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#9E9AA6] px-1">
          <span>
            Showing <strong className="text-[#FAF7F2]">{sortedProducts.length}</strong> luxury units
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </span>
          {saveToBuyOnly && <span className="text-[#D4AF37]">Filtered by Save to Buy eligibility</span>}
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="py-20 text-center bg-[#141417] rounded-3xl border border-[#2C2933] space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#FAF7F2]">No products found</h3>
            <p className="text-xs text-[#9E9AA6]">
              Try clearing your search query or adjusting your filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSaveToBuyOnly(false);
              }}
              className="py-2 px-4 rounded-xl text-xs font-semibold bg-[#D4AF37] text-[#0B0B0C]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
