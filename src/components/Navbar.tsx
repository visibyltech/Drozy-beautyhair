import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OFFICIAL_LOGO_URL, WHATSAPP_CONTACT, WHATSAPP_LINK } from '../data/mockData';
import { ShoppingBag, Heart, Search, User, Sparkles, MessageCircle, ShieldAlert } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    setIsCartDrawerOpen,
    wishlist,
    searchQuery,
    setSearchQuery,
    user,
    switchUserRole,
    notifications,
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0B0C]/95 backdrop-blur-md border-b border-[#2C2933]">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-gradient-to-r from-[#18171C] via-[#241F23] to-[#18171C] border-b border-[#2C2933]/60 px-4 py-1.5 text-center text-[11px] text-[#FAF7F2] flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2 text-[#9E9AA6]">
          <span className="text-[#D4AF37]">★</span>
          <span>100% RAW HUMAN HAIR GUARANTEE</span>
        </div>
        <div className="mx-auto flex items-center gap-2 font-medium tracking-wide">
          <span className="text-[#E8A598]">HOME OF LUXURY HAIR</span>
          <span className="text-[#9E9AA6]">·</span>
          <span className="text-[#D4AF37]">SAVE TO BUY INSTALLMENTS AVAILABLE</span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[#FAF7F2]">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">{WHATSAPP_CONTACT}</span>
          </a>
        </div>
      </div>

      {/* Main Navigation Bar - Following Strict Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark & Official Logo */}
        <div
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-3 cursor-pointer shrink-0 group"
        >
          <img
            src={OFFICIAL_LOGO_URL}
            alt="D’ROZY BEAUTY HAIR Logo"
            className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]/40 shadow-lg group-hover:border-[#D4AF37] transition-all"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-gold-gradient whitespace-nowrap">
              D’ROZY
            </span>
            <span className="text-[9px] tracking-[0.25em] text-[#E8A598] font-medium uppercase whitespace-nowrap -mt-1">
              BEAUTY HAIR
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-Line, Text with Underline Hover) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#FAF7F2]">
          <button
            onClick={() => setCurrentView('home')}
            className={`whitespace-nowrap transition-colors hover:text-[#D4AF37] py-1 cursor-pointer ${
              currentView === 'home' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-[#FAF7F2]'
            }`}
          >
            Storefront
          </button>
          <button
            onClick={() => setCurrentView('shop')}
            className={`whitespace-nowrap transition-colors hover:text-[#D4AF37] py-1 cursor-pointer ${
              currentView === 'shop' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-[#FAF7F2]'
            }`}
          >
            Shop Collection
          </button>
          <button
            onClick={() => setCurrentView('savetobuy_hub')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-[#D4AF37] py-1 cursor-pointer ${
              currentView === 'savetobuy_hub' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-[#FAF7F2]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Save to Buy</span>
          </button>
          <button
            onClick={() => setCurrentView('customer_dashboard')}
            className={`whitespace-nowrap transition-colors hover:text-[#D4AF37] py-1 cursor-pointer ${
              currentView === 'customer_dashboard'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-[#FAF7F2]'
            }`}
          >
            Customer Portal
          </button>
          <button
            onClick={() => setCurrentView('admin_dashboard')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors py-1 cursor-pointer ${
              currentView === 'admin_dashboard'
                ? 'text-[#E8A598] border-b-2 border-[#E8A598]'
                : 'text-[#9E9AA6] hover:text-[#E8A598]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#E8A598]" />
            <span>Admin Hub</span>
          </button>
        </nav>

        {/* Zone 3: Interactive Affordances & User Controls */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Quick Search */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center bg-[#1A191E] border border-[#D4AF37]/50 rounded-lg px-2.5 py-1.5 animate-in fade-in">
                <Search className="w-4 h-4 text-[#D4AF37] mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search bone straight, wigs, frontal..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentView !== 'shop') setCurrentView('shop');
                  }}
                  autoFocus
                  className="bg-transparent text-xs text-[#FAF7F2] placeholder-[#9E9AA6] focus:outline-none w-36 sm:w-56"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-xs text-[#9E9AA6] hover:text-[#FAF7F2] ml-1 px-1"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  if (currentView !== 'shop') setCurrentView('shop');
                }}
                className="p-2 text-[#9E9AA6] hover:text-[#D4AF37] transition-colors rounded-lg hover:bg-[#1A191E]"
                aria-label="Search hair collection"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Wishlist Icon */}
          <button
            onClick={() => setCurrentView('customer_dashboard')}
            className="relative p-2 text-[#9E9AA6] hover:text-[#E8A598] transition-colors rounded-lg hover:bg-[#1A191E]"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#E8A598] text-[#0B0B0C] text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Drawer Trigger */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative p-2 text-[#9E9AA6] hover:text-[#D4AF37] transition-colors rounded-lg hover:bg-[#1A191E]"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-[#0B0B0C] text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Role Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#2C2933]">
            <button
              onClick={() => setCurrentView('customer_dashboard')}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#1A191E] transition-colors group"
            >
              <div className="w-8 h-8 rounded-full border border-[#D4AF37]/40 flex items-center justify-center bg-[#1F1E24] overflow-hidden">
                <User className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#FAF7F2] leading-tight">
                  {user.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-[#9E9AA6] capitalize">{user.role}</span>
              </div>
            </button>

            {/* Quick Role Switcher for seamless test of customer vs admin */}
            <button
              onClick={switchUserRole}
              title={`Switch to ${user.role === 'customer' ? 'Admin' : 'Customer'} Mode`}
              className="hidden sm:inline-flex text-[10px] font-medium px-2 py-1 rounded bg-[#2C2933]/70 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-[#9E9AA6] transition-colors cursor-pointer border border-[#2C2933]"
            >
              Mode: {user.role === 'customer' ? 'Customer' : 'Admin'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Sub-Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-[#2C2933] py-2.5 px-4 bg-[#141417]/90 text-xs">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 ${
            currentView === 'home' ? 'text-[#D4AF37]' : 'text-[#9E9AA6]'
          }`}
        >
          <span>Store</span>
        </button>
        <button
          onClick={() => setCurrentView('shop')}
          className={`flex flex-col items-center gap-1 ${
            currentView === 'shop' ? 'text-[#D4AF37]' : 'text-[#9E9AA6]'
          }`}
        >
          <span>Shop</span>
        </button>
        <button
          onClick={() => setCurrentView('savetobuy_hub')}
          className={`flex flex-col items-center gap-1 ${
            currentView === 'savetobuy_hub' ? 'text-[#D4AF37] font-semibold' : 'text-[#9E9AA6]'
          }`}
        >
          <span className="text-[#D4AF37]">Save to Buy</span>
        </button>
        <button
          onClick={() => setCurrentView('customer_dashboard')}
          className={`flex flex-col items-center gap-1 ${
            currentView === 'customer_dashboard' ? 'text-[#D4AF37]' : 'text-[#9E9AA6]'
          }`}
        >
          <span>Portal</span>
        </button>
        <button
          onClick={() => setCurrentView('admin_dashboard')}
          className={`flex flex-col items-center gap-1 ${
            currentView === 'admin_dashboard' ? 'text-[#E8A598] font-semibold' : 'text-[#9E9AA6]'
          }`}
        >
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
};
