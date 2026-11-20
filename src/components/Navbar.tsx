import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OFFICIAL_LOGO_URL } from '../data/mockData';
import {
  ShoppingBag, Heart, Search, User, Sparkles, Menu, X, LogOut,
  Store, LayoutGrid, CreditCard, ShieldCheck, MessageCircle, ChevronRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView, setCurrentView, cartCount, setIsCartDrawerOpen, wishlist,
    searchQuery, setSearchQuery, user, firebaseUser, isAdmin, setAuthModalOpen,
    signOutUser,
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = (view: 'home' | 'shop' | 'savetobuy_hub' | 'customer_dashboard' | 'admin_dashboard') => {
    setIsMenuOpen(false);
    if ((view === 'customer_dashboard' || view === 'admin_dashboard') && !firebaseUser) {
      setAuthModalOpen(true);
      return;
    }
    setCurrentView(view);
  };

  const openAccount = () => {
    setIsMenuOpen(false);
    if (firebaseUser) setCurrentView('customer_dashboard');
    else setAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    setIsMenuOpen(false);
    await signOutUser();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0B0C]/95 backdrop-blur-md border-b border-[#2C2933]">
      <div className="bg-gradient-to-r from-[#18171C] via-[#241F23] to-[#18171C] border-b border-[#2C2933]/60 px-3 py-1 text-center text-[9px] sm:text-[11px] text-[#FAF7F2] tracking-wide">
        <span className="text-[#E8A598]">HOME OF LUXURY HAIR</span>
        <span className="mx-2 text-[#9E9AA6]">·</span>
        <span className="text-[#D4AF37]">FLEXIBLE Pay Small Small PLANS</span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-8">
        <button type="button" onClick={() => navigate('home')} className="flex items-center gap-3 cursor-pointer shrink-0 group text-left" aria-label="D’ROZY home">
          <img src={OFFICIAL_LOGO_URL} alt="D’ROZY BEAUTY HAIR Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-[#D4AF37]/40 shadow-lg group-hover:border-[#D4AF37] transition-all" referrerPolicy="no-referrer" />
          <span className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-gold-gradient whitespace-nowrap">D’ROZY</span>
            <span className="text-[9px] tracking-[0.25em] text-[#E8A598] font-medium uppercase whitespace-nowrap -mt-1">BEAUTY HAIR</span>
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#FAF7F2]">
          <button onClick={() => navigate('home')} className={`whitespace-nowrap hover:text-[#D4AF37] py-1 ${currentView === 'home' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : ''}`}>Storefront</button>
          <button onClick={() => navigate('shop')} className={`whitespace-nowrap hover:text-[#D4AF37] py-1 ${currentView === 'shop' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : ''}`}>Shop Collection</button>
          <button onClick={() => navigate('savetobuy_hub')} className={`flex items-center gap-1.5 whitespace-nowrap hover:text-[#D4AF37] py-1 ${currentView === 'savetobuy_hub' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : ''}`}>
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /><span>Pay Small Small</span>
          </button>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center bg-[#1A191E] border border-[#D4AF37]/50 rounded-lg px-2.5 py-1.5">
                <Search className="w-4 h-4 text-[#D4AF37] mr-2 shrink-0" />
                <input type="text" placeholder="Search hair collection..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); if (currentView !== 'shop') navigate('shop'); }} autoFocus className="bg-transparent text-xs text-[#FAF7F2] placeholder-[#9E9AA6] focus:outline-none w-28 sm:w-56" />
                <button type="button" onClick={() => setIsSearchOpen(false)} aria-label="Close search" className="text-xs text-[#9E9AA6] hover:text-white ml-1 px-1">✕</button>
              </div>
            ) : (
              <button type="button" onClick={() => { setIsSearchOpen(true); if (currentView !== 'shop') navigate('shop'); }} className="p-2 text-[#9E9AA6] hover:text-[#D4AF37] rounded-lg hover:bg-[#1A191E]" aria-label="Search hair collection"><Search className="w-5 h-5" /></button>
            )}
          </div>

          <button type="button" onClick={() => openAccount()} className="relative p-2 text-[#9E9AA6] hover:text-[#E8A598] rounded-lg hover:bg-[#1A191E]" aria-label="Wishlist and account"><Heart className="w-5 h-5" />{wishlist.length > 0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#E8A598] text-[#0B0B0C] text-[10px] font-bold flex items-center justify-center">{wishlist.length}</span>}</button>
          <button type="button" onClick={() => setIsCartDrawerOpen(true)} className="relative p-2 text-[#9E9AA6] hover:text-[#D4AF37] rounded-lg hover:bg-[#1A191E]" aria-label="Shopping Bag"><ShoppingBag className="w-5 h-5" />{cartCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-[#0B0B0C] text-[10px] font-bold flex items-center justify-center">{cartCount}</span>}</button>

          <div className="pl-2 border-l border-[#2C2933] flex items-center gap-1">
            <button type="button" onClick={openAccount} className="p-2 rounded-lg hover:bg-[#1A191E]" aria-label={firebaseUser ? 'My account' : 'Sign in'}>
              <span className="w-8 h-8 rounded-full border border-[#D4AF37]/40 flex items-center justify-center bg-[#1F1E24]"><User className="w-4 h-4 text-[#D4AF37]" /></span>
            </button>
            <button type="button" onClick={() => setIsMenuOpen(true)} className="p-2 rounded-lg text-[#D4AF37] hover:bg-[#1A191E]" aria-label="Open website menu"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </div>

      <div className="lg:hidden flex items-center justify-around border-t border-[#2C2933] py-2.5 px-4 bg-[#141417]/90 text-xs">
        <button onClick={() => navigate('home')} className={`py-1 ${currentView === 'home' ? 'text-[#D4AF37]' : 'text-[#9E9AA6]'}`}>Store</button>
        <button onClick={() => navigate('shop')} className={`py-1 ${currentView === 'shop' ? 'text-[#D4AF37]' : 'text-[#9E9AA6]'}`}>Shop</button>
        <button onClick={() => navigate('savetobuy_hub')} className={`py-1 ${currentView === 'savetobuy_hub' ? 'text-[#D4AF37]' : 'text-[#9E9AA6]'}`}>Pay Small Small</button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[90]">
          <button type="button" aria-label="Close menu overlay" onClick={() => setIsMenuOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <aside role="dialog" aria-modal="true" aria-label="Website menu" className="absolute right-0 top-0 h-full w-[min(88vw,360px)] overflow-y-auto border-l border-[#D4AF37]/25 bg-[#111114] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2C2933] p-5">
              <div className="flex items-center gap-3">
                <img src={OFFICIAL_LOGO_URL} alt="" className="h-10 w-10 rounded-full border border-[#D4AF37]/40 object-cover" />
                <div><p className="font-serif font-bold text-[#F3D77B]">D’ROZY</p><p className="text-[9px] tracking-[0.2em] text-[#E8A598]">BEAUTY HAIR</p></div>
              </div>
              <button type="button" onClick={() => setIsMenuOpen(false)} aria-label="Close menu" className="rounded-lg p-2 text-[#9E9AA6] hover:bg-[#242329] hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <div className="border-b border-[#2C2933] p-5">
              {firebaseUser ? (
                <><p className="font-semibold text-[#FAF7F2]">{user.name}</p><p className="mt-1 break-all text-xs text-[#9E9AA6]">{firebaseUser.email}</p><span className="mt-2 inline-flex rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2 py-1 text-[10px] text-[#D4AF37]">{isAdmin ? 'Administrator' : 'Customer account'}</span></>
              ) : (
                <><p className="font-semibold text-[#FAF7F2]">Welcome to D’ROZY</p><p className="mt-1 text-xs text-[#9E9AA6]">Sign in or create an account to manage your orders.</p></>
              )}
            </div>

            <nav className="space-y-1 p-3">
              <button onClick={() => navigate('home')} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-[#FAF7F2] hover:bg-[#242329]"><Store className="h-4 w-4 text-[#D4AF37]" />Storefront<ChevronRight className="ml-auto h-4 w-4 text-[#77717E]" /></button>
              <button onClick={() => navigate('shop')} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-[#FAF7F2] hover:bg-[#242329]"><LayoutGrid className="h-4 w-4 text-[#D4AF37]" />Shop all products<ChevronRight className="ml-auto h-4 w-4 text-[#77717E]" /></button>
              <button onClick={() => navigate('savetobuy_hub')} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-[#FAF7F2] hover:bg-[#242329]"><Sparkles className="h-4 w-4 text-[#D4AF37]" />Pay Small Small<ChevronRight className="ml-auto h-4 w-4 text-[#77717E]" /></button>
              {firebaseUser && <button onClick={() => navigate('customer_dashboard')} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-[#FAF7F2] hover:bg-[#242329]"><User className="h-4 w-4 text-[#D4AF37]" />My account & orders<ChevronRight className="ml-auto h-4 w-4 text-[#77717E]" /></button>}
              {isAdmin && <button onClick={() => navigate('admin_dashboard')} className="flex w-full items-center gap-3 rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-4 py-3 text-left text-sm font-semibold text-[#F3D77B] hover:bg-[#D4AF37]/20"><ShieldCheck className="h-4 w-4" />Admin dashboard<ChevronRight className="ml-auto h-4 w-4" /></button>}
              {!firebaseUser ? (
                <button onClick={() => { setIsMenuOpen(false); setAuthModalOpen(true); }} className="mt-3 flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-[#F3D77B] to-[#B88B18] px-4 py-3 text-left text-sm font-bold text-[#111]"><User className="h-4 w-4" />Sign in / Create account</button>
              ) : (
                <button onClick={() => void handleSignOut()} className="mt-3 flex w-full items-center gap-3 rounded-xl border border-[#E8A598]/30 bg-[#E8A598]/10 px-4 py-3 text-left text-sm font-semibold text-[#E8A598] hover:bg-[#E8A598]/20"><LogOut className="h-4 w-4" />Log out</button>
              )}
              <a href="https://wa.me/2347061728749" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)} className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#9EAA9F] hover:bg-[#242329]"><MessageCircle className="h-4 w-4 text-emerald-400" />Chat with us on WhatsApp</a>
            </nav>
            <div className="mx-5 border-t border-[#2C2933] py-4 text-[10px] text-[#77717E]">D’ROZY BEAUTY HAIR · HOME OF LUXURY HAIR</div>
          </aside>
        </div>
      )}
    </header>
  );
};
