import { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Catalog } from './components/Catalog';
import { Customizer } from './components/Customizer';
import { AboutUs } from './components/AboutUs';
import { FAQ } from './components/FAQ';
import { CartDrawer } from './components/CartDrawer';
import { AdminDashboard } from './pages/AdminDashboard';
import { ArrowRight, Sparkles } from 'lucide-react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (window.location.pathname === '/hidden-admin-gateway') {
      return 'admin';
    }
    return 'home';
  });

  const [cartOpen, setCartOpen] = useState(false);

  // Router sync
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/hidden-admin-gateway') {
        setCurrentTab('admin');
      } else {
        setCurrentTab('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSetTab = (tab: string) => {
    setCurrentTab(tab);
    if (tab === 'admin') {
      window.history.pushState({}, '', '/hidden-admin-gateway');
    } else {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentTab === 'admin') {
    return <AdminDashboard onBackToStore={() => handleSetTab('home')} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-neutral-800">
      <Header currentTab={currentTab} setCurrentTab={handleSetTab} openCart={() => setCartOpen(true)} />
      
      <main className="flex-grow">
        {currentTab === 'home' && (
          <div className="space-y-16 pb-16">
            <Hero setCurrentTab={handleSetTab} />
            
            {/* Catalog Preview */}
            <div className="border-t border-brand-cream-latte/40 pt-16">
              <Catalog />
              <div className="text-center mt-6">
                <button
                  onClick={() => handleSetTab('catalog')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-rose-deep hover:underline"
                >
                  View Full Catalog <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Bespoke Customizer Preview Section */}
            <div className="bg-brand-cream-honey/15 border-y border-brand-cream-latte/50 py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-rose-light px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-rose-deep">
                  <Sparkles className="h-3.5 w-3.5" />
                  Bespoke Creation
                </span>
                <h3 className="font-serif text-3xl font-bold text-neutral-900">Have a Custom Reference Photo?</h3>
                <p className="text-sm text-neutral-600 max-w-xl mx-auto leading-relaxed">
                  We specialize in crafting exact custom requests. Choose your flowers, wire sizes, wrap textures, and custom colors using our interactive builder.
                </p>
                <button
                  onClick={() => handleSetTab('customizer')}
                  className="rounded-full bg-brand-rose-deep px-6 py-3 text-xs font-bold text-brand-cream shadow-md hover:bg-brand-rose-mid transition-all"
                >
                  Launch Customizer Wizard
                </button>
              </div>
            </div>

            {/* Story Teaser */}
            <AboutUs />

            {/* Quick FAQs */}
            <FAQ />
          </div>
        )}

        {currentTab === 'catalog' && <Catalog />}
        
        {currentTab === 'customizer' && <Customizer />}
        
        {currentTab === 'about' && <AboutUs />}
        
        {currentTab === 'faq' && <FAQ />}
      </main>

      <Footer setCurrentTab={handleSetTab} onAdminTrigger={() => handleSetTab('admin')} />
      
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
