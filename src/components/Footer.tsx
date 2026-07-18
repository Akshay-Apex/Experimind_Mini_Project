import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  onAdminTrigger: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, onAdminTrigger }) => {
  const { settings } = useStore();

  const handleQuickLink = (tabId: string) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format WhatsApp Link
  const whatsAppUrl = `https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, '')}?text=Hello%20Amra's%20Studio!%20I%20visited%20your%20website%20and%20would%20love%20to%20know%20more%20about%20your%20everlasting%20bouquets.`;

  return (
    <footer className="bg-brand-cream-honey/70 border-t border-brand-cream-latte pt-16 pb-12 text-neutral-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 sm:grid-cols-2">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-semibold tracking-wide text-brand-rose-deep">
              Amra's Studio
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600">
              Crafting premium handcrafted pipe cleaner flowers and everlasting arrangements from our studio in Margao, Goa. Designed to bloom forever.
            </p>
            <div className="flex gap-4.5 pt-2">
              <a
                href="https://www.instagram.com/amrasstudio.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-full bg-brand-cream p-2 text-brand-rose-mid hover:bg-brand-rose-deep hover:text-brand-cream shadow-sm transition-all hover:-translate-y-0.5 duration-300 flex items-center justify-center"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@amrasstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-full bg-brand-cream p-2 text-brand-rose-mid hover:bg-brand-rose-deep hover:text-brand-cream shadow-sm transition-all hover:-translate-y-0.5 duration-300 flex items-center justify-center"
                aria-label="YouTube"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                  <polygon points="10 15 15 12 10 9" fill="currentColor" />
                </svg>
              </a>
              <a
                href={`mailto:${settings.emailAddress}`}
                className="group rounded-full bg-brand-cream p-2 text-brand-rose-mid hover:bg-brand-rose-deep hover:text-brand-cream shadow-sm transition-all hover:-translate-y-0.5 duration-300"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-full bg-brand-cream p-2 text-brand-rose-mid hover:bg-brand-rose-deep hover:text-brand-cream shadow-sm transition-all hover:-translate-y-0.5 duration-300"
                aria-label="WhatsApp"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-green-olive">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {['home', 'catalog', 'gallery', 'customizer', 'about', 'faq'].map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => handleQuickLink(tab)}
                    className="hover:text-brand-rose-deep hover:underline transition-colors capitalize text-left"
                  >
                    {tab === 'about' ? 'Our Story' : tab === 'faq' ? 'FAQs' : tab === 'customizer' ? 'Bespoke Customizer' : tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-green-olive">
              Studio Details
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 shrink-0 text-brand-rose-mid pt-0.5" />
                <span className="text-neutral-600 leading-snug">
                  {settings.businessAddress}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 shrink-0 text-brand-rose-mid" />
                <a href={`mailto:${settings.emailAddress}`} className="hover:text-brand-rose-deep hover:underline">
                  {settings.emailAddress}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Heart className="h-4.5 w-4.5 shrink-0 text-brand-rose-mid" />
                <span className="text-neutral-600">Owner: Ayesha Amra</span>
              </li>
            </ul>
          </div>

          {/* Scope details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-green-olive">
              Shipping & Delivery
            </h4>
            <p className="text-sm leading-relaxed text-neutral-600">
              Providing delivery all over India. Each arrangement is fabricated inside 2 to 4 days, then dispatched with complete tracking options.
            </p>
            <div className="bg-brand-cream/60 border border-brand-cream-latte rounded-lg p-3 text-xs flex items-center justify-between">
              <span>National Delivery</span>
              <span className="font-semibold text-brand-green-olive">All India Shipping</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="mt-12 border-t border-brand-cream-latte pt-8 text-center text-xs text-neutral-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="order-2 sm:order-1">
              &copy; {new Date().getFullYear()} Amra's Studio
              <span
                onClick={onAdminTrigger}
                className="cursor-default select-none text-neutral-400 hover:text-brand-rose-deep"
                title="Portal Gateway"
              >
                .
              </span>{' '}
              All rights reserved.
            </p>
            <p className="order-1 sm:order-2 text-[10px] uppercase tracking-widest text-neutral-400">
              Designed with love in Goa
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
