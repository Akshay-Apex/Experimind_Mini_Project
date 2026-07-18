import React from 'react';
import { ArrowRight, Wand2, Compass, Award } from 'lucide-react';

interface HeroProps {
  setCurrentTab: (tab: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ setCurrentTab }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-cream-honey/30 to-brand-cream py-16 lg:py-24">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-rose-light/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] rounded-full bg-brand-green-sage/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* Text Content */}
          <div className="text-center lg:col-span-7 lg:text-left space-y-6 z-10">
            {/* Tagline badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-rose-light/60 border border-brand-rose-blush/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-rose-deep">
              <Compass className="h-3.5 w-3.5" />
              Goa's Premier Pipe Cleaner Florist
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-tight">
              Bespoke Flowers <br />
              <span className="text-brand-rose-deep italic">Crafted to Bloom Forever</span>
            </h1>

            {/* Motto Section */}
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Welcome to <span className="font-semibold text-brand-rose-deep">Amra's Studio</span>, where we construct elegant, bespoke digital storefronts superior to standard layout inspiration blueprints. Our premium handcrafted pipe cleaner bouquets serve as long-lasting keepsakes designed to endure for years.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setCurrentTab('catalog')}
                className="group flex items-center gap-2 rounded-full bg-brand-rose-deep px-7 py-3.5 text-sm font-semibold text-brand-cream shadow-lg hover:bg-brand-rose-mid hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                Browse Collection
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={() => setCurrentTab('customizer')}
                className="group flex items-center gap-2 rounded-full bg-brand-cream border-2 border-brand-rose-mid/30 px-7 py-3.5 text-sm font-semibold text-brand-rose-deep hover:bg-brand-rose-light/35 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Wand2 className="h-4.5 w-4.5 text-brand-rose-mid group-hover:rotate-12 transition-transform" />
                Customize Bouquet
              </button>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-3 gap-4 border-t border-brand-cream-latte pt-8 text-left max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col gap-1">
                <span className="font-serif text-2xl font-bold text-brand-rose-deep">100%</span>
                <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Handcrafted</span>
              </div>
              <div className="flex flex-col gap-1 border-l border-brand-cream-latte pl-4">
                <span className="font-serif text-2xl font-bold text-brand-green-olive">Everlasting</span>
                <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">No Wilting</span>
              </div>
              <div className="flex flex-col gap-1 border-l border-brand-cream-latte pl-4">
                <span className="font-serif text-2xl font-bold text-brand-rose-deep">All India</span>
                <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Capabilities</span>
              </div>
            </div>
          </div>

          {/* Hero Images Showcase */}
          <div className="relative lg:col-span-5 flex justify-center items-center">
            {/* Visual Frame */}
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-[2.5rem] overflow-hidden border-8 border-brand-cream-honey shadow-2xl z-10 bg-brand-cream">
              <img
                src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=600"
                alt="Aesthetic Handcrafted Pipe Cleaner Flowers"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              {/* Overlaid Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-brand-cream/80 backdrop-blur-md rounded-2xl p-4 border border-brand-cream-latte/70 flex items-center gap-3">
                <div className="rounded-full bg-brand-rose-deep p-2 text-brand-cream">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-neutral-900">Goa Artisanal Heritage</h4>
                  <p className="text-[10px] text-neutral-500">Carefully shaped, piece by piece</p>
                </div>
              </div>
            </div>

            {/* Decorative Outline Frame */}
            <div className="absolute w-full max-w-sm aspect-[4/5] rounded-[2.5rem] border-2 border-brand-rose-mid/30 translate-x-4 translate-y-4" />
          </div>

        </div>
      </div>
    </section>
  );
};
