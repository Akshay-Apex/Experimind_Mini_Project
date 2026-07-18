import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FAQItem {
  q: string;
  a: string;
}

export const FAQ: React.FC = () => {
  const { settings } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqSearch, setFaqSearch] = useState('');

  const faqs: FAQItem[] = [
    {
      q: 'Are these real flowers?',
      a: 'No. Our flowers are handcrafted using premium pipe cleaners and other decorative materials.'
    },
    {
      q: 'How long do the flowers last?',
      a: 'With proper care, they can last for years and serve as a long-lasting keepsake.'
    },
    {
      q: 'Can I customize my order?',
      a: 'Yes. Colors, flower types, bouquet sizes, themes, lights, pearls, and notes can all be customized.'
    },
    {
      q: 'Do you recreate reference photos?',
      a: 'Yes. You may share a reference image, and we will create our own handcrafted interpretation of the design in our unique artistic style.'
    },
    {
      q: 'Are the flowers waterproof?',
      a: 'No. Please keep them away from water and excessive moisture.'
    },
    {
      q: 'What are the creation and transit timelines?',
      a: 'Production requires 2 – 4 days depending on composition complexity. Post-dispatch delivery across India takes up to 1 week.'
    },
    {
      q: 'Is Cash on Delivery (COD) available?',
      a: 'No. We currently do not offer Cash on Delivery; full pre-payment is standard.'
    }
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Format WhatsApp Link for general query
  const whatsAppUrl = `https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, '')}?text=Hello%20Amra's%20Studio!%20I%20have%20a%20question%20regarding%20an%20order...`;

  return (
    <section className="bg-brand-cream py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        
        {/* Title */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex rounded-full bg-brand-rose-light/50 p-2 text-brand-rose-deep">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-neutral-500 max-w-lg mx-auto">
            Everything you need to know about our handcrafted everlasting flowers, timelines, shipping and customizations.
          </p>
        </div>

        {/* Search FAQs */}
        <div className="relative max-w-md mx-auto mb-10">
          <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-brand-cream-latte bg-brand-cream-honey/10 text-xs focus:outline-none focus:ring-1 focus:ring-brand-rose-mid"
          />
        </div>

        {/* Accordions */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10 bg-brand-cream-honey/20 border border-brand-cream-latte/50 rounded-2xl">
            <p className="text-sm text-neutral-500 font-medium">No questions found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-brand-cream-latte bg-brand-cream-honey/10 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="flex w-full items-center justify-between px-6 py-4.5 text-left transition-colors hover:bg-brand-cream-honey/25"
                  >
                    <span className="font-serif text-sm sm:text-base font-bold text-neutral-900">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-brand-rose-deep shrink-0 ml-3" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-neutral-400 shrink-0 ml-3" />
                    )}
                  </button>

                  {/* Collapse panel */}
                  {isOpen && (
                    <div className="border-t border-brand-cream-latte/50 bg-brand-cream px-6 py-4.5">
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 bg-brand-cream-honey/30 rounded-[2rem] p-8 border border-brand-cream-latte text-center space-y-4">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900">Still Have Questions?</h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            We are here to help bring your floral ideas to life! Reach out directly via WhatsApp for support or reference images.
          </p>
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand-rose-deep px-6 py-3 text-xs font-semibold text-brand-cream shadow-md hover:bg-brand-rose-mid hover:-translate-y-0.5 transition-all"
          >
            <MessageSquare className="h-4 w-4" />
            Chat with Ayesha Amra
          </a>
        </div>

      </div>
    </section>
  );
};
