import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Wand2, Sparkles, Check, Send, AlertCircle, Layers, Palette, UserCheck } from 'lucide-react';

export const Customizer: React.FC = () => {
  const { settings, addOrder } = useStore();
  const [step, setStep] = useState(1);

  // Selections
  const [selectedType, setSelectedType] = useState('Handmade Bouquet');
  const [selectedVarieties, setSelectedVarieties] = useState<string[]>(['Roses']);
  const [primaryColor, setPrimaryColor] = useState('Peach Pink');
  const [secondaryColor, setSecondaryColor] = useState('Soft White');
  const [addFairyLights, setAddFairyLights] = useState(false);
  const [addPearls, setAddPearls] = useState(false);
  const [addPlushie, setAddPlushie] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [customSize, setCustomSize] = useState('Standard');

  // Customer credentials
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successState, setSuccessState] = useState(false);

  const arrangementTypes = [
    { name: 'Handmade Bouquet', basePrice: 1199, desc: 'A full classic bouquet layout' },
    { name: 'Single Flower', basePrice: 299, desc: 'A single aesthetic stem' },
    { name: 'Bridal Bouquet', basePrice: 2299, desc: 'Dense, luxury wrap for weddings' },
    { name: 'Flower Basket', basePrice: 1499, desc: 'Rustic wicker container setup' },
    { name: 'Floral Lamp', basePrice: 1799, desc: 'Under glass dome with lighting elements' },
    { name: 'Custom Arrangement', basePrice: 1899, desc: 'Vase or flat layout' },
    { name: 'Personalized Gift Set', basePrice: 1399, desc: 'Gift hamper box with custom extras' }
  ];

  const flowerVarieties = [
    'Roses', 'Lilies', 'Tulips', 'Hydrangeas', 'Sunflowers',
    'Gerbera Daisies', 'Canterbury Bells', 'Orchids', 'Lotus',
    'Hibiscus', 'Lily of the Valley', 'Poppies', 'Baby\'s Breath',
    'Chrysanthemums', 'Lavender'
  ];

  const colorPalettes = [
    { name: 'Peach Pink', hex: '#EFD7CF' },
    { name: 'Cherry Red', hex: '#893941' },
    { name: 'Lavender Purple', hex: '#D5C4DF' },
    { name: 'Creamy Vanilla', hex: '#FFFAF2' },
    { name: 'Sunshine Yellow', hex: '#FDF0CD' },
    { name: 'Sage Green', hex: '#818263' },
    { name: 'Baby Blue', hex: '#CBE3F5' },
    { name: 'Blush Rose', hex: '#CB7885' }
  ];

  const handleVarietyToggle = (variety: string) => {
    if (selectedVarieties.includes(variety)) {
      if (selectedVarieties.length > 1) {
        setSelectedVarieties(selectedVarieties.filter((v) => v !== variety));
      }
    } else {
      setSelectedVarieties([...selectedVarieties, variety]);
    }
  };

  const getBasePrice = () => {
    const typeObj = arrangementTypes.find((t) => t.name === selectedType);
    return typeObj ? typeObj.basePrice : 0;
  };

  const calculateCustomTotal = () => {
    let total = getBasePrice();
    if (customSize === 'Deluxe') total += 350;
    if (customSize === 'Grand') total += 700;
    if (addFairyLights) total += 100;
    if (addPearls) total += 50;
    if (addPlushie) total += 200;
    return total;
  };

  const handleCustomizerSubmit = () => {
    if (!name || !phone || !address || !pincode) {
      setErrorMsg('Please fill in all your shipping and contact details.');
      return;
    }
    setErrorMsg('');

    const total = calculateCustomTotal();
    const customizationsStr = `Type: ${selectedType}, Flowers: ${selectedVarieties.join(', ')}, Colors: ${primaryColor}/${secondaryColor}, Size: ${customSize}, Lights: ${addFairyLights ? 'Yes' : 'No'}, Pearls: ${addPearls ? 'Yes' : 'No'}, Plushie: ${addPlushie ? 'Yes' : 'No'}, Note: ${customNote || 'None'}`;

    // Add to Context store orders log
    addOrder({
      customerName: name,
      customerPhone: phone,
      shippingAddress: address,
      pincode: pincode,
      items: [
        {
          name: `Bespoke Handmade ${selectedType}`,
          quantity: 1,
          price: total,
          customizations: customizationsStr
        }
      ],
      total: total + settings.shippingFee
    });

    setSuccessState(true);

    // Format WhatsApp text string
    const whatsappMsg = `🌸 *Amra's Studio - Bespoke Custom Order* 🌸

*Customer Details:*
- *Name:* ${name}
- *Phone:* ${phone}
- *Shipping Address:* ${address}, Goa/India
- *Pincode:* ${pincode}

*Bespoke Specification:*
- *Arrangement:* ${selectedType}
- *Flowers:* ${selectedVarieties.join(', ')}
- *Size:* ${customSize}
- *Colors Theme:* Primary: ${primaryColor} | Accent: ${secondaryColor}
- *Add-ons:* ${addFairyLights ? '✓ Fairy Lights ' : ''}${addPearls ? '✓ Pearl Studs ' : ''}${addPlushie ? '✓ Mini Plushie ' : ''}${!addFairyLights && !addPearls && !addPlushie ? 'None' : ''}
- *Personalized Card Note:* ${customNote ? `"${customNote}"` : 'None'}

*Billing:*
- *Bespoke Rate:* ₹${total.toLocaleString('en-IN')}
- *Shipping Fee:* ₹${settings.shippingFee.toLocaleString('en-IN')}
- *Total Amount:* ₹${(total + settings.shippingFee).toLocaleString('en-IN')}

_Please confirm payment instructions. I have attached reference images if needed._`;

    const encodedMsg = encodeURIComponent(whatsappMsg);
    const targetUrl = `https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, '')}?text=${encodedMsg}`;

    setTimeout(() => {
      // Redirect to WhatsApp
      window.open(targetUrl, '_blank');
      setSuccessState(false);
      setStep(1);
      // Reset details
      setSelectedVarieties(['Roses']);
      setAddFairyLights(false);
      setAddPearls(false);
      setAddPlushie(false);
      setCustomNote('');
      setName('');
      setPhone('');
      setAddress('');
      setPincode('');
    }, 1200);
  };

  return (
    <section className="bg-brand-cream-honey/15 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl bg-brand-cream border border-brand-cream-latte rounded-[2.5rem] shadow-xl overflow-hidden">
        
        {/* Banner */}
        <div className="bg-brand-rose-deep px-8 py-10 text-brand-cream flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="space-y-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-cream/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-cream">
              <Wand2 className="h-3.5 w-3.5" />
              Bespoke Artisan Studio
            </span>
            <h2 className="font-serif text-3xl font-bold leading-tight">Design Your Dream Bouquet</h2>
            <p className="text-xs text-brand-cream/80 max-w-xl">
              We recreate reference photos or combine your choices into custom pipe cleaner arrangements designed to bloom forever.
            </p>
          </div>
          <div className="hidden md:flex rounded-2xl bg-brand-cream/10 p-4 border border-brand-cream/20 flex-col items-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-brand-rose-light">Starting From</span>
            <span className="font-serif text-3xl font-bold">₹299</span>
          </div>
        </div>

        {/* Wizard Steps indicator */}
        <div className="border-b border-brand-cream-latte/65 px-8 py-4 bg-brand-cream-honey/10 flex justify-between items-center text-xs font-semibold text-neutral-400 select-none">
          {[
            { id: 1, label: 'Arrangement', icon: Layers },
            { id: 2, label: 'Flowers', icon: Sparkles },
            { id: 3, label: 'Colors & Deco', icon: Palette },
            { id: 4, label: 'Shipping & Send', icon: UserCheck }
          ].map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.id;
            const isActive = step === s.id;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-brand-green-olive border-brand-green-olive text-brand-cream'
                      : isActive
                      ? 'bg-brand-rose-deep border-brand-rose-deep text-brand-cream shadow-sm scale-110'
                      : 'border-brand-cream-latte bg-brand-cream text-neutral-400'
                  }`}
                >
                  {isCompleted ? '✓' : isActive ? <Icon className="h-3.5 w-3.5" /> : s.id}
                </span>
                <span className={`hidden sm:inline ${isActive ? 'text-brand-rose-deep font-bold' : isCompleted ? 'text-brand-green-olive' : 'text-neutral-500'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Body */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main settings options: 7 columns */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* STEP 1: Arrangement Type */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-neutral-900">Step 1: Choose Your Layout Type</h3>
                <p className="text-xs text-neutral-500">Pick a base form factor. Each item has its own initial volume of pipe cleaner flowers.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {arrangementTypes.map((type) => (
                    <button
                      key={type.name}
                      onClick={() => {
                        setSelectedType(type.name);
                        setStep(2);
                      }}
                      className={`border rounded-2xl p-4 text-left transition-all hover:bg-brand-cream-honey/10 ${
                        selectedType === type.name
                          ? 'border-brand-rose-deep bg-brand-rose-light/20 ring-1 ring-brand-rose-deep'
                          : 'border-brand-cream-latte'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-neutral-800">{type.name}</p>
                        {selectedType === type.name && <Check className="h-4.5 w-4.5 text-brand-rose-deep shrink-0" />}
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">{type.desc}</p>
                      <p className="text-xs font-bold text-brand-rose-deep mt-3">₹{type.basePrice.toLocaleString('en-IN')}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Flower Varieties */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-neutral-900">Step 2: Cataloged Varieties Selection</h3>
                <p className="text-xs text-neutral-500">Select one or more flower types you would like Ayesha to integrate (select all that apply).</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {flowerVarieties.map((variety) => {
                    const isSelected = selectedVarieties.includes(variety);
                    return (
                      <button
                        key={variety}
                        onClick={() => handleVarietyToggle(variety)}
                        className={`rounded-xl px-4 py-3 text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-brand-green-olive border-brand-green-olive text-brand-cream font-semibold'
                            : 'bg-brand-cream border-brand-cream-latte text-neutral-700 hover:border-brand-green-sage'
                        }`}
                      >
                        {variety}
                        {isSelected && ' ✓'}
                      </button>
                    );
                  })}
                </div>
                
                <div className="pt-6 border-t border-brand-cream-latte/50 flex justify-between">
                  <button onClick={() => setStep(1)} className="text-xs font-bold text-neutral-500 hover:text-neutral-700">
                    Back to Layout
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={selectedVarieties.length === 0}
                    className="rounded-full bg-brand-rose-deep px-5 py-2.5 text-xs font-semibold text-brand-cream hover:bg-brand-rose-mid disabled:opacity-50"
                  >
                    Next Options
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Colors & Deco */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Size Choice */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400"> Bouquet Size Extension</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'Standard', desc: 'Original configuration', price: '+ ₹0' },
                      { name: 'Deluxe', desc: 'Extra stems and filler', price: '+ ₹350' },
                      { name: 'Grand', desc: 'Full premium bundle wrap', price: '+ ₹700' }
                    ].map((s) => (
                      <button
                        key={s.name}
                        onClick={() => setCustomSize(s.name)}
                        className={`border rounded-xl p-3 text-left transition-all ${
                          customSize === s.name
                            ? 'border-brand-rose-deep bg-brand-rose-light/35'
                            : 'border-brand-cream-latte hover:border-brand-rose-mid/30'
                        }`}
                      >
                        <p className="text-xs font-bold text-neutral-800">{s.name}</p>
                        <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">{s.desc}</p>
                        <p className="text-[10px] font-bold text-brand-rose-deep mt-2">{s.price}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors Select */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Primary Color Theme</h4>
                    <select
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="block w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3 py-2.5 text-xs focus:ring-1 focus:ring-brand-rose-mid outline-none"
                    >
                      {colorPalettes.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Accent Wrapper Theme</h4>
                    <select
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="block w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3 py-2.5 text-xs focus:ring-1 focus:ring-brand-rose-mid outline-none"
                    >
                      {colorPalettes.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Accessories & Embellishments checkboxes */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans">Enhancements</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <label className="flex items-center gap-3 rounded-xl border border-brand-cream-latte p-3 cursor-pointer hover:bg-brand-cream-honey/10 transition-colors">
                      <input
                        type="checkbox"
                        checked={addFairyLights}
                        onChange={(e) => setAddFairyLights(e.target.checked)}
                        className="h-4.5 w-4.5 rounded border-brand-cream-latte text-brand-rose-deep focus:ring-brand-rose-mid accent-brand-rose-deep"
                      />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-neutral-800">Fairy Lights (+ ₹100)</p>
                        <p className="text-[10px] text-neutral-500">Wrap with Micro Warm LEDs inside packaging</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 rounded-xl border border-brand-cream-latte p-3 cursor-pointer hover:bg-brand-cream-honey/10 transition-colors">
                      <input
                        type="checkbox"
                        checked={addPearls}
                        onChange={(e) => setAddPearls(e.target.checked)}
                        className="h-4.5 w-4.5 rounded border-brand-cream-latte text-brand-rose-deep focus:ring-brand-rose-mid accent-brand-rose-deep"
                      />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-neutral-800">Pearl Beads (+ ₹50)</p>
                        <p className="text-[10px] text-neutral-500">Add shiny pearl studs inside flower centers</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 rounded-xl border border-brand-cream-latte p-3 cursor-pointer hover:bg-brand-cream-honey/10 transition-colors">
                      <input
                        type="checkbox"
                        checked={addPlushie}
                        onChange={(e) => setAddPlushie(e.target.checked)}
                        className="h-4.5 w-4.5 rounded border-brand-cream-latte text-brand-rose-deep focus:ring-brand-rose-mid accent-brand-rose-deep"
                      />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-neutral-800">Plushie Add-on (+ ₹200)</p>
                        <p className="text-[10px] text-neutral-500">Attach a small cute teddy plushie in the bouquet wrap</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Hand-written Note card */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Personalized Gift Message</h4>
                  <textarea
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Enter customized card note here..."
                    maxLength={150}
                    rows={2.5}
                    className="w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3 py-2 text-xs focus:ring-1 focus:ring-brand-rose-mid outline-none resize-none"
                  />
                </div>

                <div className="pt-6 border-t border-brand-cream-latte/50 flex justify-between">
                  <button onClick={() => setStep(2)} className="text-xs font-bold text-neutral-500 hover:text-neutral-700">
                    Back to Flowers
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="rounded-full bg-brand-rose-deep px-5 py-2.5 text-xs font-semibold text-brand-cream hover:bg-brand-rose-mid"
                  >
                    Next: Shipping Contact
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Shipping Credentials */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-neutral-900">Step 4: Contact & Shipping Address</h3>
                <p className="text-xs text-neutral-500">Provide shipping details. Production commences immediately following upfront payment verification.</p>
                
                {errorMsg && (
                  <div className="bg-brand-rose-light/50 border border-brand-rose-blush text-brand-rose-deep rounded-xl p-3 text-xs flex items-center gap-2 animate-shake">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full name"
                      className="mt-1 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-brand-rose-mid outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">WhatsApp Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="mt-1 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-brand-rose-mid outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Goa/India Shipping Address</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street details, house no."
                        className="mt-1 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-brand-rose-mid outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Pincode</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="e.g. 403707"
                        maxLength={6}
                        className="mt-1 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-brand-rose-mid outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-cream-latte/50 flex justify-between">
                  <button onClick={() => setStep(3)} className="text-xs font-bold text-neutral-500 hover:text-neutral-700">
                    Back to Deco
                  </button>
                  <button
                    onClick={handleCustomizerSubmit}
                    disabled={successState}
                    className={`rounded-full px-6 py-2.5 text-xs font-bold text-brand-cream flex items-center gap-1.5 transition-all ${
                      successState ? 'bg-brand-green-olive' : 'bg-brand-rose-deep hover:bg-brand-rose-mid'
                    }`}
                  >
                    {successState ? (
                      <>
                        <Check className="h-4 w-4" />
                        Generating Order...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Order to WhatsApp
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Checkout spec details: 5 columns */}
          <div className="lg:col-span-5 bg-brand-cream-honey/15 rounded-3xl border border-brand-cream-latte/70 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-brand-green-olive border-b border-brand-cream-latte/65 pb-2">
                Order Review Summary
              </h4>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Arrangement Form:</span>
                  <span className="font-semibold text-neutral-800">{selectedType}</span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-neutral-500 shrink-0">Selected Flowers:</span>
                  <span className="font-semibold text-neutral-800 text-right line-clamp-2 max-w-[200px]">
                    {selectedVarieties.join(', ')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-500">Size selection:</span>
                  <span className="font-semibold text-neutral-800">{customSize}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-500">Color Palette:</span>
                  <span className="font-semibold text-neutral-800">
                    {primaryColor} / {secondaryColor}
                  </span>
                </div>

                <div className="border-t border-brand-cream-latte/50 pt-2 space-y-1.5">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Add-ons detail</span>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-500">Fairy Lights:</span>
                    <span className="font-semibold text-neutral-700">{addFairyLights ? 'Included (+ ₹100)' : 'None'}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-500">Pearl Beads:</span>
                    <span className="font-semibold text-neutral-700">{addPearls ? 'Included (+ ₹50)' : 'None'}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-500">Cute Plushie:</span>
                    <span className="font-semibold text-neutral-700">{addPlushie ? 'Included (+ ₹200)' : 'None'}</span>
                  </div>
                </div>

                {customNote && (
                  <div className="border-t border-brand-cream-latte/50 pt-2 text-[11px]">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block">Card Message</span>
                    <p className="italic text-neutral-600 bg-brand-cream p-2.5 rounded-lg border border-brand-cream-latte/40 mt-1 leading-relaxed">
                      "{customNote}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Calculations block */}
            <div className="border-t border-brand-cream-latte/65 pt-4 mt-6 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Bespoke Price:</span>
                <span className="font-bold text-neutral-800">₹{calculateCustomTotal().toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Shipping Delivery:</span>
                <span className="font-bold text-neutral-800">₹{settings.shippingFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-dashed border-brand-cream-latte pt-2">
                <span className="font-bold text-neutral-800">Total Bill:</span>
                <span className="font-serif text-xl font-bold text-brand-rose-deep">
                  ₹{(calculateCustomTotal() + settings.shippingFee).toLocaleString('en-IN')}
                </span>
              </div>

              {/* No COD Banner */}
              <div className="mt-4 bg-brand-green-sage/10 rounded-xl p-3 border border-brand-green-sage/25 text-[10px] text-brand-green-olive flex gap-2 items-start text-left">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>
                  <strong>Full pre-payment is standard.</strong> Cash on delivery is not supported for custom artisanal builds.
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
