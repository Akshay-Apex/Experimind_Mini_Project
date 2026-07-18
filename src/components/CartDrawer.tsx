import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShieldAlert, ShoppingBag, Plus, Minus, Send, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateCartQty, clearCart, settings, addOrder } = useStore();

  // Shipping details state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');

  const [validationErr, setValidationErr] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const calculateItemPrice = (item: typeof cart[0]) => {
    let price = item.product.price;
    if (item.customizations.customSize === 'Deluxe') price += 350;
    if (item.customizations.customSize === 'Grand') price += 700;
    if (item.customizations.fairyLights) price += 100;
    if (item.customizations.pearls) price += 50;
    return price * item.quantity;
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  };

  const getTotal = () => {
    return getSubtotal() + settings.shippingFee;
  };

  const handleCheckout = () => {
    if (!name || !phone || !address || !pincode) {
      setValidationErr('All checkout fields are required.');
      return;
    }
    setValidationErr('');
    setSuccess(true);

    const totalBill = getTotal();
    const orderItems = cart.map((item) => {
      const parts = [
        `Size: ${item.customizations.customSize}`,
        `Colors: ${item.customizations.primaryColor}/${item.customizations.secondaryColor}`,
        item.customizations.fairyLights ? 'Fairy Lights (+₹100)' : '',
        item.customizations.pearls ? 'Pearl Beads (+₹50)' : '',
        item.customizations.customNote ? `Note: "${item.customizations.customNote}"` : ''
      ].filter(Boolean);

      return {
        name: item.product.name,
        quantity: item.quantity,
        price: calculateItemPrice(item) / item.quantity,
        customizations: parts.join(' | ')
      };
    });

    // Save order details to local system context
    const createdOrder = addOrder({
      customerName: name,
      customerPhone: phone,
      shippingAddress: address,
      pincode: pincode,
      items: orderItems,
      total: totalBill
    });

    // Format WhatsApp Order message
    const orderItemsText = cart
      .map((item, idx) => {
        const itemPrice = calculateItemPrice(item) / item.quantity;
        return `*${idx + 1}. ${item.product.name}* x ${item.quantity} (₹${itemPrice.toLocaleString('en-IN')}/ea)
   - Size: ${item.customizations.customSize}
   - Colors: ${item.customizations.primaryColor}/${item.customizations.secondaryColor}
   ${item.customizations.fairyLights ? '- ✓ Fairy Lights (Included)\n   ' : ''}${item.customizations.pearls ? '- ✓ Pearl Beads (Included)\n   ' : ''}${item.customizations.customNote ? `- Msg Note: "${item.customizations.customNote}"\n   ` : ''}`;
      })
      .join('\n');

    const message = `🌸 *Amra's Studio - New Order Alert (${createdOrder.id})* 🌸

*Customer Details:*
- *Name:* ${name}
- *Phone:* ${phone}
- *Shipping Address:* ${address}, Goa/India
- *Pincode:* ${pincode}

*Order Items:*
${orderItemsText}
*Billing Summary:*
- *Cart Subtotal:* ₹${getSubtotal().toLocaleString('en-IN')}
- *Flat Shipping:* ₹${settings.shippingFee.toLocaleString('en-IN')}
- *Grand Total:* ₹${totalBill.toLocaleString('en-IN')}

_Please send payment details for GPay / PhonePe. I am placing this order directly via the web portal._`;

    const encodedText = encodeURIComponent(message);
    const targetWaUrl = `https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, '')}?text=${encodedText}`;

    setTimeout(() => {
      // Open WhatsApp tab
      window.open(targetWaUrl, '_blank');
      // Clear local states
      setSuccess(false);
      clearCart();
      setName('');
      setPhone('');
      setAddress('');
      setPincode('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Dark overlay backdrop */}
      <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        {/* Slide-over panel */}
        <div className="w-screen max-w-md transform bg-brand-cream border-l border-brand-cream-latte shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="border-b border-brand-cream-latte px-6 py-5 flex items-center justify-between bg-brand-cream-honey/10">
            <h3 className="font-serif text-lg font-bold text-neutral-900 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-brand-rose-deep" />
              Your Flower Basket
            </h3>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-neutral-400 hover:bg-brand-cream-honey hover:text-brand-rose-deep outline-none"
            >
              <X className="h-5.5 w-5.5" />
            </button>
          </div>

          {/* Cart list scroll area */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <ShoppingBag className="h-12 w-12 text-neutral-300 mx-auto" />
                <h4 className="font-serif text-base font-bold text-neutral-600">Your basket is empty</h4>
                <p className="text-xs text-neutral-500 max-w-[200px] mx-auto">
                  Add handcrafted arrangements from our catalog to get started.
                </p>
                <button
                  onClick={onClose}
                  className="mt-3.5 rounded-full bg-brand-rose-deep px-5 py-2 text-xs font-semibold text-brand-cream hover:bg-brand-rose-mid transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 border border-brand-cream-latte/55 rounded-2xl bg-brand-cream hover:shadow-sm transition-all"
                    >
                      {/* Product small pic */}
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 border border-brand-cream-latte/40">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Info & Configs */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="text-xs font-bold text-neutral-800 line-clamp-1 leading-tight">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-neutral-400 hover:text-brand-rose-deep shrink-0 p-0.5"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="text-[10px] text-neutral-500 mt-1 space-y-0.5 font-sans leading-none">
                            <p>Size: <span className="font-semibold text-neutral-700">{item.customizations.customSize}</span></p>
                            <p>Colors: <span className="font-semibold text-neutral-700">{item.customizations.primaryColor} / {item.customizations.secondaryColor}</span></p>
                            {(item.customizations.fairyLights || item.customizations.pearls) && (
                              <p className="text-brand-green-olive font-semibold flex flex-wrap gap-1">
                                {item.customizations.fairyLights && '✓ Lights'}
                                {item.customizations.pearls && '✓ Pearls'}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Price & Quantity counters */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-brand-cream-latte rounded-lg overflow-hidden bg-brand-cream">
                            <button
                              onClick={() => updateCartQty(item.id, item.quantity - 1)}
                              className="px-2 py-0.5 hover:bg-brand-cream-honey/40 transition-colors text-xs"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 font-semibold text-xs text-neutral-800">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQty(item.id, item.quantity + 1)}
                              className="px-2 py-0.5 hover:bg-brand-cream-honey/40 transition-colors text-xs"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <span className="font-serif text-sm font-bold text-brand-rose-deep">
                            ₹{calculateItemPrice(item).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Checkout form segment */}
                <div className="border-t border-brand-cream-latte/65 pt-6 mt-8 space-y-4">
                  <h4 className="font-serif text-sm font-bold text-neutral-900 border-b border-brand-cream-latte pb-1.5">
                    Shipping & Payment Contact
                  </h4>

                  {validationErr && (
                    <p className="text-[10px] text-brand-rose-deep bg-brand-rose-light/50 border border-brand-rose-blush p-2 rounded-lg font-medium">
                      {validationErr}
                    </p>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 block">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name of recipient"
                        className="mt-1 w-full rounded-lg border border-brand-cream-latte bg-brand-cream px-3 py-2 text-xs focus:ring-1 focus:ring-brand-rose-mid outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 block">WhatsApp Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="WhatsApp contact for shipping updates"
                        className="mt-1 w-full rounded-lg border border-brand-cream-latte bg-brand-cream px-3 py-2 text-xs focus:ring-1 focus:ring-brand-rose-mid outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 block">Delivery Address</label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Street, Locality"
                          className="mt-1 w-full rounded-lg border border-brand-cream-latte bg-brand-cream px-3 py-2 text-xs focus:ring-1 focus:ring-brand-rose-mid outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 block">Pincode</label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="Goa/India"
                          maxLength={6}
                          className="mt-1 w-full rounded-lg border border-brand-cream-latte bg-brand-cream px-3 py-2 text-xs focus:ring-1 focus:ring-brand-rose-mid outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Checkout pricing sum and trigger: absolute bottom */}
          {cart.length > 0 && (
            <div className="border-t border-brand-cream-latte bg-brand-cream-honey/15 p-6 space-y-4.5 shrink-0">
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Cart Subtotal:</span>
                  <span className="font-semibold text-neutral-800">₹{getSubtotal().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span className="font-semibold text-neutral-800">₹{settings.shippingFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-brand-cream-latte/50 pt-2 font-bold text-neutral-950">
                  <span>Estimated Total:</span>
                  <span className="font-serif text-lg text-brand-rose-deep">₹{getTotal().toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* No COD Notice */}
              <div className="bg-brand-rose-light/45 rounded-xl p-2.5 border border-brand-rose-blush/40 text-[9px] text-brand-rose-deep flex gap-2 items-start leading-snug">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Full pre-payment required.</strong> Due to artisanal customization, we do not offer Cash on Delivery.
                </span>
              </div>

              {/* Action checkout button */}
              <button
                onClick={handleCheckout}
                disabled={success}
                className={`w-full rounded-xl py-3 text-xs font-bold text-brand-cream flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ${
                  success ? 'bg-brand-green-olive shadow-none' : 'bg-brand-rose-deep hover:bg-brand-rose-mid hover:-translate-y-0.5'
                }`}
              >
                {success ? (
                  <>
                    <Check className="h-4 w-4" />
                    Opening WhatsApp...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Place Order via WhatsApp
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
