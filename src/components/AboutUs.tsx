import React from 'react';
import { ShieldCheck, Heart, Sparkles, MapPin, Calendar } from 'lucide-react';

export const AboutUs: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: 'Artisanal Integrity',
      desc: 'Every petal and leaf is shaped entirely by hand with precision, creativity, and love from start to finish.'
    },
    {
      icon: ShieldCheck,
      title: 'Imported Materials',
      desc: 'We utilize high-density premium pipe cleaners, lush satin bindings, and durable wiring to guarantee longevity.'
    },
    {
      icon: Sparkles,
      title: 'Endless Customization',
      desc: 'Custom colors, pearl additions, fairy lights, and shape recreations tailored to match client reference photos.'
    }
  ];

  return (
    <section className="bg-brand-cream py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
          
          {/* Visual Showcase collage */}
          <div className="relative flex justify-center items-center">
            {/* Main Picture */}
            <div className="w-[80%] aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-brand-cream-honey">
              <img
                src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=600"
                alt="Working on floral creations"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Overlaid Picture */}
            <div className="absolute -bottom-8 -left-2 w-[45%] aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-brand-cream-honey">
              <img
                src="https://images.unsplash.com/photo-1589244159943-460088ed5c92?auto=format&fit=crop&q=80&w=400"
                alt="Wicker flower basket close-up"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlaid Badge */}
            <div className="absolute top-6 right-2 bg-brand-green-olive text-brand-cream px-4 py-2.5 rounded-2xl shadow-lg border border-brand-green-sage flex items-center gap-2">
              <MapPin className="h-4.5 w-4.5" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-brand-cream/80">Location</p>
                <p className="text-xs font-bold font-sans">Margao, Goa, India</p>
              </div>
            </div>
          </div>

          {/* Copy Description */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-sage/15 border border-brand-green-sage/30 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-green-olive">
              <Calendar className="h-3.5 w-3.5" />
              Established September 2025
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
              The Story Behind <br />
              <span className="text-brand-rose-deep italic">Amra's Studio</span>
            </h2>

            <div className="space-y-4 text-neutral-600 leading-relaxed text-sm sm:text-base">
              <p>
                Welcome to <strong className="text-neutral-800">Amra's Studio</strong>, a handmade flower brand based in Margao, Goa, India. Founded in September 2025, Amra's Studio specializes in creating premium handcrafted pipe cleaner flowers, bouquets, and floral arrangements designed to last forever.
              </p>
              <p>
                Every single piece is carefully handmade from start to finish using high-quality imported materials, ensuring exceptional detail, durability, and beauty. We believe flowers shouldn't fade with time, which is why our everlasting blooms make meaningful gifts and keepsakes for every occasion.
              </p>
              <p>
                From elegant single flowers to luxurious bridal bouquets and custom floral creations, each design is crafted with care and creativity. Whether you have a specific design in mind or want us to recreate an inspiration photo in our own artistic style, we are here to bring your vision to life.
              </p>
            </div>
          </div>
        </div>

        {/* Brand Core Values */}
        <div className="mt-20 border-t border-brand-cream-latte pt-16">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
              Our Artisanal Standards
            </h3>
            <p className="text-sm text-neutral-500">
              We strive to construct elegant floral elements superior to standard blueprint designs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-brand-cream-honey/30 rounded-2xl p-6 border border-brand-cream-latte/65 transition-all duration-300 hover:shadow-md hover:bg-brand-cream-honey/40 hover:-translate-y-0.5"
                >
                  <div className="inline-flex rounded-xl bg-brand-rose-light p-3 text-brand-rose-deep mb-4 shadow-inner">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-neutral-900 mb-2">{val.title}</h4>
                  <p className="text-sm text-neutral-600 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
