import React, { useState } from 'react';
import { useStore, type Product } from '../context/StoreContext';
import { Search, SlidersHorizontal, ShoppingBag, Eye, X, Check, Info, Sparkles, Send } from 'lucide-react';

export const Catalog: React.FC = () => {
  const { products, addToCart, settings, addOrder } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVariety, setSelectedVariety] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Customization choices inside modal
  const [customPrimaryColor, setCustomPrimaryColor] = useState('Peach Pink');
  const [customSecondaryColor, setCustomSecondaryColor] = useState('Soft White');
  const [addFairyLights, setAddFairyLights] = useState(false);
  const [addPearls, setAddPearls] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [customSize, setCustomSize] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [successMsg, setSuccessMsg] = useState(false);

  // Direct Booking States
  const [isDirectBooking, setIsDirectBooking] = useState(false);
  const [bookName, setBookName] = useState('');
  const [bookPhone, setBookPhone] = useState('');
  const [bookAddress, setBookAddress] = useState('');
  const [bookPincode, setBookPincode] = useState('');
  const [bookSuccess, setBookSuccess] = useState(false);
  const [validationErr, setValidationErr] = useState('');

  const categories = [
    'All',
    'Handmade Bouquets',
    'Single Flowers',
    'Bridal Bouquets',
    'Flower Baskets',
    'Floral Lamps',
    'Custom Floral Arrangements',
    'Personalized Gift Sets',
    'Plushie Add-ons'
  ];

  const varieties = [
    'All',
    'Roses',
    'Lilies',
    'Tulips',
    'Hydrangeas',
    'Sunflowers',
    'Gerbera Daisies',
    'Canterbury Bells',
    'Orchids',
    'Lotus',
    'Hibiscus',
    'Lily of the Valley',
    'Poppies',
    'Baby\'s Breath',
    'Chrysanthemums',
    'Lavender'
  ];

  const colorOptions = [
    { name: 'Peach Pink', hex: '#EFD7CF' },
    { name: 'Cherry Red', hex: '#893941' },
    { name: 'Lavender Purple', hex: '#D5C4DF' },
    { name: 'Creamy Vanilla', hex: '#FFFAF2' },
    { name: 'Sunshine Yellow', hex: '#FDF0CD' },
    { name: 'Sage Green', hex: '#818263' },
    { name: 'Baby Blue', hex: '#CBE3F5' },
    { name: 'Blush Rose', hex: '#CB7885' }
  ];

  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesVariety =
      selectedVariety === 'All' ||
      prod.varieties.some((v) => v.toLowerCase().includes(selectedVariety.toLowerCase()));
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesVariety && matchesSearch;
  });

  const openProductModal = (product: Product) => {
    setActiveProduct(product);
    setCustomPrimaryColor('Peach Pink');
    setCustomSecondaryColor('Soft White');
    setAddFairyLights(false);
    setAddPearls(false);
    setCustomNote('');
    setCustomSize('Standard');
    setQuantity(1);
    setSuccessMsg(false);

    setIsDirectBooking(false);
    setBookName('');
    setBookPhone('');
    setBookAddress('');
    setBookPincode('');
    setBookSuccess(false);
    setValidationErr('');
  };

  const handleDirectBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookName || !bookPhone || !bookAddress || !bookPincode) {
      setValidationErr('Please fill in all the shipping and contact details.');
      return;
    }
    setValidationErr('');
    setBookSuccess(true);

    const price = calculateCustomizedPrice();
    const itemTotal = price * quantity;
    const grandTotal = itemTotal + settings.shippingFee;

    const parts = [
      `Size: ${customSize}`,
      `Colors: ${customPrimaryColor}/${customSecondaryColor}`,
      addFairyLights ? 'Fairy Lights (+₹100)' : '',
      addPearls ? 'Pearl Beads (+₹50)' : '',
      customNote ? `Note: "${customNote}"` : ''
    ].filter(Boolean);

    const createdOrder = addOrder({
      customerName: bookName,
      customerPhone: bookPhone,
      shippingAddress: bookAddress,
      pincode: bookPincode,
      items: [
        {
          name: activeProduct!.name,
          quantity: quantity,
          price: price,
          customizations: parts.join(' | ')
        }
      ],
      total: grandTotal
    });

    const orderText = `*1. ${activeProduct!.name}* x ${quantity} (₹${price.toLocaleString('en-IN')}/ea)
   - Size: ${customSize}
   - Colors: ${customPrimaryColor}/${customSecondaryColor}
   ${addFairyLights ? '- ✓ Fairy Lights (Included)\n   ' : ''}${addPearls ? '- ✓ Pearl Beads (Included)\n   ' : ''}${customNote ? `- Msg Note: "${customNote}"\n   ` : ''}`;

    const message = `🌸 *Amra's Studio - New Direct Booking (${createdOrder.id})* 🌸

*Customer Details:*
- *Name:* ${bookName}
- *Phone:* ${bookPhone}
- *Shipping Address:* ${bookAddress}, Goa/India
- *Pincode:* ${bookPincode}

*Order Items:*
${orderText}
*Billing Summary:*
- *Subtotal:* ₹${itemTotal.toLocaleString('en-IN')}
- *Flat Shipping:* ₹${settings.shippingFee.toLocaleString('en-IN')}
- *Grand Total:* ₹${grandTotal.toLocaleString('en-IN')}

_Please send payment details for GPay / PhonePe. I am placing this booking directly via the web portal._`;

    const encodedText = encodeURIComponent(message);
    const targetWaUrl = `https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, '')}?text=${encodedText}`;

    setTimeout(() => {
      // Open WhatsApp tab
      window.open(targetWaUrl, '_blank');
      // Reset states
      setBookSuccess(false);
      setIsDirectBooking(false);
      setActiveProduct(null);
      setBookName('');
      setBookPhone('');
      setBookAddress('');
      setBookPincode('');
    }, 1200);
  };

  const calculateCustomizedPrice = () => {
    if (!activeProduct) return 0;
    let base = activeProduct.price;
    if (customSize === 'Deluxe') base += 350;
    if (customSize === 'Grand') base += 700;
    if (addFairyLights) base += 100;
    if (addPearls) base += 50;
    return base;
  };

  const handleAddToCart = () => {
    if (!activeProduct) return;
    addToCart(activeProduct, quantity, {
      primaryColor: customPrimaryColor,
      secondaryColor: customSecondaryColor,
      fairyLights: addFairyLights,
      pearls: addPearls,
      customNote,
      customSize
    });
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setActiveProduct(null);
    }, 1500);
  };

  return (
    <section className="bg-brand-cream-honey/15 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
            Our Everlasting Catalog
          </h2>
          <p className="text-sm text-neutral-500">
            Browse our handmade pipe cleaner bouquets, lamps, and baskets. Fully customizable.
          </p>
        </div>

        {/* Filter / Search Controls */}
        <div className="bg-brand-cream border border-brand-cream-latte/60 rounded-3xl p-6 shadow-sm mb-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search flowers, bouquets, gift sets..."
                className="w-full pl-11 pr-4 py-3 rounded-full border border-brand-cream-latte bg-brand-cream-honey/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose-mid focus:border-transparent transition-all"
              />
            </div>
            {/* Tagline */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-brand-green-olive">
              <SlidersHorizontal className="h-4.5 w-4.5" />
              Filter by Varieties or Categories Below
            </div>
          </div>

          {/* Category Tabs */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Categories</h4>
            <div className="flex flex-wrap gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-brand-rose-deep text-brand-cream shadow-sm scale-105'
                      : 'bg-brand-cream border border-brand-cream-latte/80 text-neutral-600 hover:bg-brand-rose-light/30 hover:text-brand-rose-deep'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Variety Filter tags */}
          <div className="space-y-2 pt-2 border-t border-brand-cream-latte/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Flower Varieties</h4>
            <div className="flex flex-wrap gap-1.5">
              {varieties.map((varItem) => (
                <button
                  key={varItem}
                  onClick={() => setSelectedVariety(varItem)}
                  className={`rounded-lg px-3 py-1.5 text-xs transition-all duration-200 ${
                    selectedVariety === varItem
                      ? 'bg-brand-green-olive text-brand-cream font-semibold scale-105'
                      : 'bg-brand-cream-honey/30 hover:bg-brand-cream-honey text-neutral-600'
                  }`}
                >
                  {varItem}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-brand-cream border border-brand-cream-latte/60 rounded-3xl p-6">
            <Info className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-neutral-700">No items found matching your filters</h3>
            <p className="text-sm text-neutral-500 mt-1">Try resetting the variety filter or search query.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedVariety('All');
                setSearchQuery('');
              }}
              className="mt-4 rounded-full bg-brand-rose-deep px-5 py-2 text-xs font-semibold text-brand-cream hover:bg-brand-rose-mid transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => openProductModal(prod)}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-brand-cream border border-brand-cream-latte/50 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
              >
                {/* Photo frame */}
                <div className="relative aspect-square w-full overflow-hidden bg-brand-cream-honey/10">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge */}
                  <span className="absolute top-3.5 left-3.5 rounded-full bg-brand-cream/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-green-olive border border-brand-cream-latte/50">
                    {prod.category}
                  </span>
                  
                  {/* Overlay hover effect */}
                  <div className="absolute inset-0 bg-brand-rose-deep/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-brand-cream text-brand-rose-deep rounded-full px-4.5 py-2 text-xs font-bold shadow-lg flex items-center gap-1.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                      <Eye className="h-4 w-4" />
                      View & Customize
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col p-5 bg-brand-cream">
                  <h3 className="font-serif text-base font-bold text-neutral-800 line-clamp-1 leading-tight group-hover:text-brand-rose-deep transition-colors">
                    {prod.name}
                  </h3>
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {prod.varieties.map((v) => (
                      <span key={v} className="text-[9px] bg-brand-cream-honey/60 text-neutral-500 px-2 py-0.5 rounded-md">
                        {v}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-neutral-500 line-clamp-2 leading-relaxed flex-1">
                    {prod.description}
                  </p>
                  <div className="mt-4.5 border-t border-brand-cream-latte/40 pt-4 flex items-center justify-between">
                    <span className="font-serif text-lg font-bold text-brand-rose-deep">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-semibold text-brand-green-olive flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      Bespoke Available
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Customization & Detail Modal */}
        {activeProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setActiveProduct(null)} />

            {/* Modal Body wrapper */}
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="relative w-full max-w-4xl rounded-[2rem] bg-brand-cream border border-brand-cream-latte p-6 sm:p-8 shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                  onClick={() => setActiveProduct(null)}
                  className="absolute right-4.5 top-4.5 rounded-full p-2 text-neutral-500 hover:bg-brand-cream-honey hover:text-brand-rose-deep focus:outline-none z-20"
                >
                  <X className="h-6 w-6" />
                </button>

                {/* Left Side: Image & Descriptions */}
                <div className="space-y-4">
                  <div className="aspect-square rounded-2xl overflow-hidden border border-brand-cream-latte/60">
                    <img
                      src={activeProduct.image}
                      alt={activeProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green-olive bg-brand-green-sage/10 px-3 py-1 rounded-full">
                      {activeProduct.category}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-neutral-900 mt-2.5 leading-tight">
                      {activeProduct.name}
                    </h3>
                    <p className="text-sm text-neutral-600 mt-3.5 leading-relaxed">
                      {activeProduct.description}
                    </p>
                  </div>
                </div>

                {/* Right Side: Customizable Choices */}
                <div className="flex flex-col space-y-5">
                  <div className="border-b border-brand-cream-latte pb-4">
                    <h4 className="font-serif text-lg font-bold text-neutral-900">Personalize Your Piece</h4>
                    <p className="text-xs text-neutral-500">Every single order is seamlessly customized.</p>
                  </div>

                  {/* Size Customization */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Select Arrangement Size</label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {[
                        { name: 'Standard', desc: 'Original size', price: 'Base Price' },
                        { name: 'Deluxe', desc: '30% more blooms', price: '+ ₹350' },
                        { name: 'Grand', desc: '50% more + extra filler', price: '+ ₹700' }
                      ].map((sizeOpt) => (
                        <button
                          key={sizeOpt.name}
                          onClick={() => setCustomSize(sizeOpt.name)}
                          className={`border rounded-xl p-2.5 text-left transition-all ${
                            customSize === sizeOpt.name
                              ? 'border-brand-rose-deep bg-brand-rose-light/30'
                              : 'border-brand-cream-latte hover:border-brand-rose-mid/50'
                          }`}
                        >
                          <p className="text-xs font-bold text-neutral-800">{sizeOpt.name}</p>
                          <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">{sizeOpt.desc}</p>
                          <p className="text-[9px] font-semibold text-brand-rose-deep mt-1">{sizeOpt.price}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Schemes */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Primary Color Theme</label>
                      <select
                        value={customPrimaryColor}
                        onChange={(e) => setCustomPrimaryColor(e.target.value)}
                        className="mt-2 block w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3 py-2 text-xs focus:ring-1 focus:ring-brand-rose-mid outline-none"
                      >
                        {colorOptions.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Wrap/Secondary Theme</label>
                      <select
                        value={customSecondaryColor}
                        onChange={(e) => setCustomSecondaryColor(e.target.value)}
                        className="mt-2 block w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3 py-2 text-xs focus:ring-1 focus:ring-brand-rose-mid outline-none"
                      >
                        {colorOptions.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Embellishments */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Enhancements & Add-ons</label>
                    <div className="space-y-2 mt-2">
                      <label className="flex items-center gap-2.5 rounded-xl border border-brand-cream-latte/70 p-2.5 cursor-pointer hover:bg-brand-cream-honey/10 transition-colors">
                        <input
                          type="checkbox"
                          checked={addFairyLights}
                          onChange={(e) => setAddFairyLights(e.target.checked)}
                          className="h-4.5 w-4.5 rounded border-brand-cream-latte text-brand-rose-deep focus:ring-brand-rose-mid accent-brand-rose-deep"
                        />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-neutral-800">Fairy Lights & Embellishments</p>
                          <p className="text-[10px] text-neutral-500">Includes micro-warm LEDs wrapped around the blooms (+ ₹100)</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 rounded-xl border border-brand-cream-latte/70 p-2.5 cursor-pointer hover:bg-brand-cream-honey/10 transition-colors">
                        <input
                          type="checkbox"
                          checked={addPearls}
                          onChange={(e) => setAddPearls(e.target.checked)}
                          className="h-4.5 w-4.5 rounded border-brand-cream-latte text-brand-rose-deep focus:ring-brand-rose-mid accent-brand-rose-deep"
                        />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-neutral-800">Pearl Beads Embellishments</p>
                          <p className="text-[10px] text-neutral-500">Carefully glued glossy faux pearls inside flower centers (+ ₹50)</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Custom Note */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Handmade Personalized Note</label>
                    <textarea
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      placeholder="Write your personal message to be beautifully written on our signature card..."
                      maxLength={180}
                      rows={2.5}
                      className="mt-2 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3 py-2 text-xs focus:ring-1 focus:ring-brand-rose-mid outline-none resize-none"
                    />
                  </div>

                  {/* Quantity & Booking / Add to Cart options */}
                  <div className="border-t border-brand-cream-latte pt-4 space-y-4">
                    {!isDirectBooking ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-500">Total Price:</span>
                          <span className="font-serif text-2xl font-bold text-brand-rose-deep">
                            ₹{(calculateCustomizedPrice() * quantity).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2.5">
                          <div className="flex gap-3">
                            {/* Quantity Controller */}
                            <div className="flex items-center border border-brand-cream-latte rounded-xl overflow-hidden bg-brand-cream">
                              <button
                                type="button"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-3.5 py-2 text-neutral-600 hover:bg-brand-cream-honey/40 transition-colors"
                              >
                                -
                              </button>
                              <span className="px-3 font-semibold text-xs text-neutral-800">{quantity}</span>
                              <button
                                type="button"
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-3.5 py-2 text-neutral-600 hover:bg-brand-cream-honey/40 transition-colors"
                              >
                                +
                              </button>
                            </div>

                            {/* Add Button */}
                            <button
                              type="button"
                              onClick={handleAddToCart}
                              disabled={successMsg}
                              className={`flex-grow rounded-xl py-3 text-xs font-bold text-brand-cream flex items-center justify-center gap-2 shadow-sm transition-all ${
                                successMsg
                                  ? 'bg-brand-green-olive shadow-none'
                                  : 'bg-brand-rose-mid/10 text-brand-rose-deep hover:bg-brand-rose-mid/20'
                              }`}
                            >
                              {successMsg ? (
                                <>
                                  <Check className="h-4.5 w-4.5" />
                                  Added to Basket!
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="h-4.5 w-4.5" />
                                  Add to Basket
                                </>
                              )}
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setIsDirectBooking(true)}
                            className="w-full rounded-xl bg-brand-rose-deep py-3 text-xs font-bold text-brand-cream hover:bg-brand-rose-mid transition-all shadow-md flex items-center justify-center gap-1.5"
                          >
                            <Sparkles className="h-4 w-4" />
                            Book Instantly via WhatsApp
                          </button>
                        </div>
                      </>
                    ) : (
                      <form onSubmit={handleDirectBook} className="space-y-3">
                        <div className="bg-brand-cream-honey/15 rounded-2xl p-4 border border-brand-cream-latte/50 space-y-3">
                          <p className="text-[10px] font-bold text-brand-green-olive uppercase tracking-wider">Direct Checkout Info</p>
                          
                          {validationErr && (
                            <p className="text-[10px] text-brand-rose-deep font-semibold bg-brand-rose-light/40 border border-brand-rose-blush p-2 rounded-lg">
                              {validationErr}
                            </p>
                          )}

                          {bookSuccess && (
                            <div className="bg-brand-green-sage/15 border border-brand-green-sage text-brand-green-olive rounded-xl p-3 text-xs flex items-center gap-1.5">
                              <Check className="h-4 w-4" />
                              <span>Redirecting to WhatsApp to submit booking...</span>
                            </div>
                          )}

                          {!bookSuccess && (
                            <>
                              <div className="grid grid-cols-1 gap-2.5">
                                <input
                                  type="text"
                                  value={bookName}
                                  onChange={(e) => setBookName(e.target.value)}
                                  required
                                  placeholder="Full Name"
                                  className="w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3 py-2.5 text-xs outline-none"
                                />
                                <input
                                  type="tel"
                                  value={bookPhone}
                                  onChange={(e) => setBookPhone(e.target.value)}
                                  required
                                  placeholder="WhatsApp Phone Number"
                                  className="w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3 py-2.5 text-xs outline-none"
                                />
                              </div>

                              <div className="grid grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  value={bookAddress}
                                  onChange={(e) => setBookAddress(e.target.value)}
                                  required
                                  placeholder="Goa Address"
                                  className="col-span-2 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3 py-2.5 text-xs outline-none"
                                />
                                <input
                                  type="text"
                                  value={bookPincode}
                                  onChange={(e) => setBookPincode(e.target.value)}
                                  required
                                  placeholder="Pincode"
                                  className="w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3 py-2.5 text-xs outline-none"
                                />
                              </div>
                            </>
                          )}
                        </div>

                        {!bookSuccess && (
                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setIsDirectBooking(false)}
                              className="w-1/3 rounded-xl border border-brand-cream-latte py-2.5 text-xs font-semibold text-neutral-600 hover:text-neutral-800"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              className="flex-grow rounded-xl bg-brand-rose-deep py-2.5 text-xs font-bold text-brand-cream hover:bg-brand-rose-mid shadow-md flex items-center justify-center gap-1"
                            >
                              <Send className="h-3.5 w-3.5" />
                              Book (₹{((calculateCustomizedPrice() * quantity) + settings.shippingFee).toLocaleString('en-IN')})
                            </button>
                          </div>
                        )}
                      </form>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
