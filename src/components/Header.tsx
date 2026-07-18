import React, { useState } from 'react';
import { Logo } from './Logo';
import { ShoppingBag, Menu, X, Wand2, BookOpen, HelpCircle, Flower, Image } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, openCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, settings } = useStore();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { id: 'home', label: 'Home', icon: Flower },
    { id: 'catalog', label: 'Catalog', icon: Flower },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'customizer', label: 'Bespoke Customizer', icon: Wand2 },
    { id: 'about', label: 'Our Story', icon: BookOpen },
    { id: 'faq', label: 'FAQs', icon: HelpCircle },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-cream-latte bg-brand-cream/90 backdrop-blur-md transition-all duration-300">
      {/* Top micro-banner */}
      <div className="w-full bg-brand-rose-deep py-1.5 px-4 text-center text-xs font-medium tracking-wide text-brand-cream">
        {settings.promoNotice}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => handleNavClick('home')}>
            <Logo className="w-12 h-12" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-brand-rose-deep bg-brand-rose-light/50 font-semibold'
                      : 'text-neutral-600 hover:text-brand-rose-mid hover:bg-brand-cream-honey/40'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-all duration-300 ${
                    item.id === 'customizer' ? 'group-hover:rotate-12' : 'group-hover:scale-110'
                  } ${isActive ? 'text-brand-rose-deep' : 'text-neutral-400 group-hover:text-brand-rose-mid'}`} />
                  {item.label}
                  {/* Subtle underline for standard tabs */}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-brand-rose-deep" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions (Cart & Mobile Menu) */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative rounded-full bg-brand-rose-deep p-2.5 text-brand-cream shadow-md transition-all hover:scale-105 hover:bg-brand-rose-mid focus:outline-none focus:ring-2 focus:ring-brand-rose-mid"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5.5 w-5.5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-green-sage text-[10px] font-bold text-brand-cream border-2 border-brand-cream">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full p-2 text-neutral-600 hover:bg-brand-cream-honey/50 hover:text-brand-rose-deep focus:outline-none md:hidden"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-cream-latte bg-brand-cream px-4 py-4 space-y-2 shadow-inner animate-in slide-in-from-top-4 duration-200">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-medium transition-all ${
                  isActive
                    ? 'bg-brand-rose-light text-brand-rose-deep'
                    : 'text-neutral-600 hover:bg-brand-cream-honey/40 hover:text-brand-rose-deep'
                }`}
              >
                {item.id === 'customizer' && <Wand2 className="h-5 w-5 text-brand-rose-mid" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
