import React, { useState } from 'react';
import { GALLERY_IMAGES, getFriendlyName } from '../assets/gallery';
import { useStore } from '../context/StoreContext';
import { X, Send, Eye, Sparkles, Check } from 'lucide-react';

export const Gallery: React.FC = () => {
  const { settings, addOrder } = useStore();
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  
  // Direct booking state
  const [isBooking, setIsBooking] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [customSize, setCustomSize] = useState('Standard');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [validationErr, setValidationErr] = useState('');

  const handleOpenLightbox = (imgUrl: string) => {
    setSelectedImg(imgUrl);
    setIsBooking(false);
    setName('');
    setPhone('');
    setAddress('');
    setPincode('');
    setCustomSize('Standard');
    setNotes('');
    setValidationErr('');
    setBookingSuccess(false);
  };

  const getBasePrice = () => {
    // Gallery designs default base price
    return 1199;
  };

  const calculateTotalPrice = () => {
    let price = getBasePrice();
    if (customSize === 'Deluxe') price += 350;
    if (customSize === 'Grand') price += 700;
    return price;
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address || !pincode) {
      setValidationErr('Please fill in all the shipping and contact details.');
      return;
    }
    setValidationErr('');

    const basePrice = getBasePrice();
    const sizeAddon = customSize === 'Deluxe' ? 350 : customSize === 'Grand' ? 700 : 0;
    const finalPrice = basePrice + sizeAddon;
    const grandTotal = finalPrice + settings.shippingFee;
    
    const friendlyName = selectedImg ? getFriendlyName(selectedImg) : 'Handmade Bouquet';
    const designLabel = `Gallery Design: ${friendlyName}`;

    // Add Order to context logger
    const createdOrder = addOrder({
      customerName: name,
      customerPhone: phone,
      shippingAddress: address,
      pincode: pincode,
      items: [
        {
          name: designLabel,
          quantity: 1,
          price: finalPrice,
          customizations: `Size: ${customSize} | Notes: ${notes || 'None'}`
        }
      ],
      total: grandTotal
    });

    setBookingSuccess(true);

    // Format WhatsApp Direct Booking message
    const message = `🌸 *Amra's Studio - New Booking from Gallery (${createdOrder.id})* 🌸

*Customer Details:*
- *Name:* ${name}
- *Phone:* ${phone}
- *Shipping Address:* ${address}, Goa/India
- *Pincode:* ${pincode}

*Booked Gallery Design:*
- *Design Ref:* ${friendlyName}
- *Size:* ${customSize}
- *Additional Notes:* ${notes || 'None'}

*Billing Summary:*
- *Arrangement Rate:* ₹${finalPrice.toLocaleString('en-IN')}
- *Flat Shipping:* ₹${settings.shippingFee.toLocaleString('en-IN')}
- *Grand Total:* ₹${grandTotal.toLocaleString('en-IN')}

_Please send payment details for GPay / PhonePe. I am confirming this booking directly from the website gallery._`;

    const encodedText = encodeURIComponent(message);
    const targetWaUrl = `https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, '')}?text=${encodedText}`;

    setTimeout(() => {
      // Redirect to WhatsApp
      window.open(targetWaUrl, '_blank');
      setSelectedImg(null);
    }, 1200);
  };

  return (
    <section className="bg-brand-cream-honey/15 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
            Our Everlasting Gallery
          </h2>
          <p className="text-sm text-neutral-500">
            A simplistic showcase of our handcrafted creations. Click any design to view details and book via WhatsApp.
          </p>
        </div>

        {/* Simplistic Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {GALLERY_IMAGES.map((imgUrl, index) => {
            const friendlyName = getFriendlyName(imgUrl);
            return (
              <div
                key={index}
                onClick={() => handleOpenLightbox(imgUrl)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-brand-cream-latte/50 bg-brand-cream shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="aspect-square w-full overflow-hidden bg-brand-cream-honey/10">
                  <img
                    src={imgUrl}
                    alt={friendlyName}
                    className="h-full w-full object-cover transform group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
                
                {/* Hover overlay with visual click trigger */}
                <div className="absolute inset-0 bg-brand-rose-deep/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-brand-cream text-brand-rose-deep rounded-full px-3 py-1.5 text-xs font-semibold shadow-md flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    View & Book
                  </span>
                </div>
                
                <div className="p-3.5 bg-brand-cream text-center">
                  <p className="text-xs font-semibold text-neutral-700 truncate">
                    Design #{friendlyName.split('_')[0] || friendlyName}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lightbox / Booking Modal */}
        {selectedImg && (
          <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setSelectedImg(null)} />

            {/* Modal Box */}
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="relative w-full max-w-3xl rounded-[2rem] bg-brand-cream border border-brand-cream-latte p-6 sm:p-8 shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedImg(null)}
                  className="absolute right-4.5 top-4.5 rounded-full p-2 text-neutral-500 hover:bg-brand-cream-honey hover:text-brand-rose-deep z-20 outline-none"
                >
                  <X className="h-5.5 w-5.5" />
                </button>

                {/* Left: Product Visual */}
                <div className="space-y-4">
                  <div className="aspect-square rounded-2xl overflow-hidden border border-brand-cream-latte/60 shadow-inner">
                    <img
                      src={selectedImg}
                      alt="Selected flower design"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green-olive bg-brand-green-sage/10 px-3 py-1 rounded-full">
                      Everlasting Design
                    </span>
                    <h3 className="font-serif text-xl font-bold text-neutral-900 mt-2.5">
                      Design Reference: {getFriendlyName(selectedImg)}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Every piece is handmade by Ayesha Amra using premium materials. Colors, fillers, and sizes can be adjusted during booking.
                    </p>
                  </div>
                </div>

                {/* Right: Info / Direct Booking Form */}
                <div className="flex flex-col justify-between">
                  {!isBooking ? (
                    <div className="space-y-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="border-b border-brand-cream-latte pb-3">
                          <h4 className="font-serif text-lg font-bold text-neutral-900">Handmade Quality</h4>
                          <p className="text-xs text-neutral-500">Perfect as a keepsake or gorgeous gift.</p>
                        </div>
                        
                        <div className="space-y-2.5 text-xs text-neutral-600">
                          <div className="flex justify-between border-b border-brand-cream-latte/40 pb-1.5">
                            <span className="font-semibold text-neutral-500">Estimated Production:</span>
                            <span className="text-neutral-800">2 - 4 days</span>
                          </div>
                          <div className="flex justify-between border-b border-brand-cream-latte/40 pb-1.5">
                            <span className="font-semibold text-neutral-500">Base Price:</span>
                            <span className="font-bold text-brand-rose-deep">₹1,199</span>
                          </div>
                          <div className="flex justify-between border-b border-brand-cream-latte/40 pb-1.5">
                            <span className="font-semibold text-neutral-500">Delivery:</span>
                            <span className="text-neutral-800">All India shipping</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsBooking(true)}
                        className="w-full mt-6 rounded-full bg-brand-rose-deep py-3 text-xs font-bold text-brand-cream hover:bg-brand-rose-mid transition-all shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="h-4 w-4" />
                        Book This Design Now
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleConfirmBooking} className="space-y-3.5">
                      <div className="border-b border-brand-cream-latte pb-2">
                        <h4 className="font-serif text-base font-bold text-neutral-900">Direct WhatsApp Booking</h4>
                        <p className="text-[10px] text-neutral-500">Please provide your delivery and contact details.</p>
                      </div>

                      {validationErr && (
                        <p className="text-[10px] text-brand-rose-deep font-semibold bg-brand-rose-light/40 border border-brand-rose-blush p-2 rounded-lg">
                          {validationErr}
                        </p>
                      )}

                      {bookingSuccess && (
                        <div className="bg-brand-green-sage/15 border border-brand-green-sage text-brand-green-olive rounded-xl p-3 text-xs flex items-center gap-1.5">
                          <Check className="h-4.5 w-4.5" />
                          <span>Redirecting to WhatsApp to complete your booking...</span>
                        </div>
                      )}

                      {!bookingSuccess && (
                        <>
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Your Full Name</label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                              placeholder="Name"
                              className="mt-0.5 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3 py-2 text-xs outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">WhatsApp Phone Number</label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              required
                              placeholder="Phone"
                              className="mt-0.5 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3 py-2 text-xs outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Select Size</label>
                              <select
                                value={customSize}
                                onChange={(e) => setCustomSize(e.target.value)}
                                className="mt-0.5 block w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-2.5 py-2 text-xs outline-none"
                              >
                                <option value="Standard">Standard (Base)</option>
                                <option value="Deluxe">Deluxe (+₹350)</option>
                                <option value="Grand">Grand (+₹700)</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Pincode</label>
                              <input
                                type="text"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                required
                                placeholder="Pincode"
                                className="mt-0.5 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3 py-2 text-xs outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Shipping Address</label>
                            <input
                              type="text"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              required
                              placeholder="Address, Margao, Goa"
                              className="mt-0.5 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3 py-2 text-xs outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Special Notes (optional)</label>
                            <input
                              type="text"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="e.g. Customize primary color"
                              className="mt-0.5 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3 py-2 text-xs outline-none"
                            />
                          </div>

                          <div className="pt-2 flex gap-3">
                            <button
                              type="button"
                              onClick={() => setIsBooking(false)}
                              className="w-1/3 rounded-full border border-brand-cream-latte py-2.5 text-xs font-semibold text-neutral-600 hover:text-neutral-800"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              className="flex-grow rounded-full bg-brand-rose-deep py-2.5 text-xs font-bold text-brand-cream hover:bg-brand-rose-mid shadow-md flex items-center justify-center gap-1.5"
                            >
                              <Send className="h-3.5 w-3.5" />
                              Book via WhatsApp (₹{calculateTotalPrice().toLocaleString('en-IN')})
                            </button>
                          </div>
                        </>
                      )}
                    </form>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
