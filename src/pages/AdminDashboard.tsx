import React, { useState } from 'react';
import { useStore, type Product } from '../context/StoreContext';
import { GALLERY_IMAGES } from '../assets/gallery';
import { Edit, Trash2, Plus, LogOut, Check, X, ShieldAlert, ShoppingBag, Settings, LayoutGrid, Eye, EyeOff } from 'lucide-react';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const {
    products,
    orders,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    updateSettings
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'settings'>('orders');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Editing Product form states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Handmade Bouquets');
  const [newProdPrice, setNewProdPrice] = useState(599);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdVarieties, setNewProdVarieties] = useState('');

  // Settings form states
  const [formWaNumber, setFormWaNumber] = useState(settings.whatsAppNumber);
  const [formEmail, setFormEmail] = useState(settings.emailAddress);
  const [formAddress, setFormAddress] = useState(settings.businessAddress);
  const [formShipping, setFormShipping] = useState(settings.shippingFee);
  const [formNotice, setFormNotice] = useState(settings.promoNotice);
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);

  const categories = [
    'Handmade Bouquets',
    'Single Flowers',
    'Bridal Bouquets',
    'Flower Baskets',
    'Floral Lamps',
    'Custom Floral Arrangements',
    'Personalized Gift Sets',
    'Plushie Add-ons'
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'amrasstudio.co@gmail.com' && password === 'Amra2025!') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Check owner email and secret key.');
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdImage) return;

    const parsedVarieties = newProdVarieties
      ? newProdVarieties.split(',').map((v) => v.trim())
      : ['Roses'];

    addProduct({
      name: newProdName,
      category: newProdCategory,
      price: Number(newProdPrice),
      description: newProdDesc,
      image: newProdImage,
      inStock: true,
      varieties: parsedVarieties
    });

    // Reset fields
    setNewProdName('');
    setNewProdPrice(599);
    setNewProdDesc('');
    setNewProdImage('');
    setNewProdVarieties('');
    setShowAddForm(false);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      whatsAppNumber: formWaNumber,
      emailAddress: formEmail,
      businessAddress: formAddress,
      shippingFee: Number(formShipping),
      promoNotice: formNotice
    });
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4 relative">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-rose-light/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] rounded-full bg-brand-green-sage/10 blur-3xl pointer-events-none" />

        <div className="absolute top-4 left-4">
          <button
            onClick={onBackToStore}
            className="text-xs font-semibold text-neutral-600 hover:text-brand-rose-deep border border-brand-cream-latte rounded-full px-4 py-2 hover:bg-brand-cream-honey/15 transition-all"
          >
            ← Back to Store
          </button>
        </div>

        <div className="w-full max-w-md bg-brand-cream border border-brand-cream-latte p-8 rounded-[2rem] shadow-2xl text-center space-y-6 relative z-10">
          {/* Icon Badge */}
          <div className="inline-flex rounded-full bg-brand-rose-light p-4 text-brand-rose-deep shadow-inner">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-neutral-900">Merchant Gateway</h2>
            <p className="text-xs text-neutral-500">Authorized store manager access only.</p>
          </div>

          {loginError && (
            <div className="bg-brand-rose-light/50 border border-brand-rose-blush text-brand-rose-deep text-xs p-3 rounded-xl text-left flex items-center gap-2">
              <X className="h-4 w-4 shrink-0" />
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500" htmlFor="admin-email">Email Address</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Enter your admin email"
                className="mt-1.5 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-brand-rose-mid transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500" htmlFor="admin-password">Password</label>
              <div className="relative mt-1.5">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2.5 pr-10 text-xs outline-none focus:ring-1 focus:ring-brand-rose-mid transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-brand-rose-deep transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 rounded-xl bg-brand-rose-deep py-3 text-xs font-bold text-brand-cream hover:bg-brand-rose-mid transition-all shadow-md hover:-translate-y-0.5"
            >
              Sign In to Control Panel
            </button>
          </form>

          <p className="text-[10px] text-neutral-400">
            Access restricted to Amra's Studio management only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream-honey/15">
      {/* Admin Nav */}
      <nav className="bg-brand-cream border-b border-brand-cream-latte px-6 py-4.5 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl font-bold tracking-wide text-brand-rose-deep">
            Amra's Studio
          </span>
          <span className="bg-brand-green-sage/10 border border-brand-green-sage/35 text-[9px] font-bold text-brand-green-olive px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Admin Panel
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onBackToStore}
            className="text-xs font-semibold text-neutral-600 hover:text-brand-rose-deep"
          >
            Storefront UI
          </button>
          
          <button
            onClick={() => setIsAuthenticated(false)}
            className="rounded-full bg-brand-cream border border-brand-cream-latte p-2 text-neutral-500 hover:text-brand-rose-deep hover:bg-brand-rose-light/20 transition-all"
            title="Log Out"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar menus */}
          <div className="lg:col-span-3 space-y-2">
            {[
              { id: 'orders', label: 'Orders & Requests Log', count: orders.length, icon: ShoppingBag },
              { id: 'inventory', label: 'Inventory Manager', count: products.length, icon: LayoutGrid },
              { id: 'settings', label: 'Store Configurations', count: null, icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-left text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-rose-deep text-brand-cream shadow-md'
                      : 'bg-brand-cream border border-brand-cream-latte/70 text-neutral-600 hover:bg-brand-rose-light/10 hover:text-brand-rose-deep'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== null && (
                    <span className={`px-2 py-0.5 rounded-md text-[9px] ${isActive ? 'bg-brand-cream text-brand-rose-deep' : 'bg-brand-cream-honey text-neutral-500'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Main Panel */}
          <div className="lg:col-span-9">
            
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-brand-cream border border-brand-cream-latte rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="font-serif text-lg font-bold text-neutral-900 border-b border-brand-cream-latte/65 pb-2">
                  Customer Orders Log
                </h3>

                {orders.length === 0 ? (
                  <div className="text-center py-16 text-neutral-400">
                    <p className="text-xs">No orders or bespoke custom submissions logged yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-brand-cream-latte/70 rounded-2xl p-4 bg-brand-cream hover:bg-brand-cream-honey/5 transition-all space-y-3"
                      >
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <div>
                            <span className="font-semibold text-xs text-brand-rose-deep">{order.id}</span>
                            <span className="text-[10px] text-neutral-400 ml-2.5 font-medium">{order.date}</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="font-serif font-bold text-xs">Total: ₹{order.total.toLocaleString('en-IN')}</span>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                              className={`rounded-lg text-[10px] font-bold px-2 py-1 outline-none ${
                                order.status === 'Completed'
                                  ? 'bg-brand-green-sage/10 text-brand-green-olive border border-brand-green-olive/30'
                                  : order.status === 'Cancelled'
                                  ? 'bg-neutral-100 text-neutral-500 border border-neutral-300'
                                  : 'bg-brand-rose-light text-brand-rose-deep border border-brand-rose-blush/40'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        {/* Customer */}
                        <div className="bg-brand-cream-honey/15 rounded-xl p-3 border border-brand-cream-latte/30 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-[10px] font-semibold text-neutral-400">CUSTOMER INFO</p>
                            <p className="font-bold text-neutral-800 mt-0.5">{order.customerName}</p>
                            <p className="text-neutral-600">{order.customerPhone}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-neutral-400">SHIPPING ADDRESS</p>
                            <p className="text-neutral-700 leading-snug mt-0.5">{order.shippingAddress}</p>
                            <p className="font-semibold text-brand-green-olive">Pincode: {order.pincode}</p>
                          </div>
                        </div>

                        {/* Items detail */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Ordered Items</p>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start text-xs border-b border-brand-cream-latte/40 pb-2 last:border-b-0 last:pb-0">
                              <div className="space-y-1">
                                <p className="font-semibold text-neutral-800">
                                  {item.name} <span className="text-neutral-400 font-normal">x {item.quantity}</span>
                                </p>
                                {item.customizations && (
                                  <p className="text-[10px] text-neutral-500 italic bg-brand-cream px-2 py-1 rounded border border-brand-cream-latte/30">
                                    {item.customizations}
                                  </p>
                                )}
                              </div>
                              <span className="font-bold text-neutral-700">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* INVENTORY MANAGER TAB */}
            {activeTab === 'inventory' && (
              <div className="bg-brand-cream border border-brand-cream-latte rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-brand-cream-latte/65 pb-2">
                  <h3 className="font-serif text-lg font-bold text-neutral-900">
                    Product Inventory Management
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddForm(!showAddForm);
                      setEditingProduct(null);
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold bg-brand-rose-deep text-brand-cream px-3 py-1.5 rounded-full hover:bg-brand-rose-mid shadow-sm transition-all"
                  >
                    {showAddForm ? (
                      <>
                        <X className="h-3.5 w-3.5" />
                        Cancel Add
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        Add New Item
                      </>
                    )}
                  </button>
                </div>

                {/* ADD NEW PRODUCT FORM */}
                {showAddForm && (
                  <form onSubmit={handleCreateProduct} className="border border-brand-rose-blush/40 rounded-2xl p-5 bg-brand-rose-light/10 space-y-4">
                    <h4 className="font-serif font-bold text-sm text-brand-rose-deep">Register New Product</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Product Name</label>
                        <input
                          type="text"
                          value={newProdName}
                          onChange={(e) => setNewProdName(e.target.value)}
                          required
                          placeholder="e.g. Classic Red Tulip Pot"
                          className="mt-1 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Category Offering</label>
                        <select
                          value={newProdCategory}
                          onChange={(e) => setNewProdCategory(e.target.value)}
                          className="mt-1 block w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3 py-2 text-xs outline-none"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Price (INR)</label>
                        <input
                          type="number"
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(Number(e.target.value))}
                          required
                          className="mt-1 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Aesthetic Varieties (Comma-separated)</label>
                        <input
                          type="text"
                          value={newProdVarieties}
                          onChange={(e) => setNewProdVarieties(e.target.value)}
                          placeholder="e.g. Tulips, Baby's Breath"
                          className="mt-1 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">Select Design Image</label>
                      <div className="grid grid-cols-5 md:grid-cols-7 gap-2 max-h-36 overflow-y-auto border border-brand-cream-latte rounded-xl p-2.5 bg-brand-cream">
                        {GALLERY_IMAGES.map((imgUrl, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setNewProdImage(imgUrl)}
                            className={`cursor-pointer aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              newProdImage === imgUrl ? 'border-brand-rose-deep scale-95 ring-1 ring-brand-rose-deep' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={imgUrl} className="w-full h-full object-cover" alt="Local design asset" />
                          </button>
                        ))}
                      </div>
                      <div className="mt-2.5">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Or Paste Image URL</label>
                        <input
                          type="text"
                          value={newProdImage}
                          onChange={(e) => setNewProdImage(e.target.value)}
                          placeholder="e.g. Custom image URL"
                          className="mt-1 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Product Description</label>
                      <textarea
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        rows={2.5}
                        className="mt-1 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2 text-xs outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="rounded-xl bg-brand-green-olive px-6 py-2.5 text-xs font-bold text-brand-cream hover:bg-brand-green-sage"
                    >
                      Save Product to Inventory
                    </button>
                  </form>
                )}

                {/* EDITING PRODUCT FORM */}
                {editingProduct && (
                  <form onSubmit={handleUpdateProduct} className="border border-brand-cream-latte rounded-2xl p-5 bg-brand-cream-honey/15 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-serif font-bold text-sm text-neutral-800">Edit Product: {editingProduct.name}</h4>
                      <button onClick={() => setEditingProduct(null)} className="text-neutral-500 hover:text-brand-rose-deep">
                        <X className="h-4.5 w-4.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Product Name</label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          required
                          className="mt-1 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Category</label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                          className="mt-1 block w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3 py-2 text-xs outline-none"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Price (INR)</label>
                        <input
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                          required
                          className="mt-1 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Stock Availability</label>
                        <select
                          value={editingProduct.inStock ? 'true' : 'false'}
                          onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.value === 'true' })}
                          className="mt-1 block w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3 py-2 text-xs outline-none"
                        >
                          <option value="true">In Stock</option>
                          <option value="false">Out of Stock</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">Select Design Image</label>
                      <div className="grid grid-cols-5 md:grid-cols-7 gap-2 max-h-36 overflow-y-auto border border-brand-cream-latte rounded-xl p-2.5 bg-brand-cream">
                        {GALLERY_IMAGES.map((imgUrl, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setEditingProduct({ ...editingProduct, image: imgUrl })}
                            className={`cursor-pointer aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              editingProduct.image === imgUrl ? 'border-brand-rose-deep scale-95 ring-1 ring-brand-rose-deep' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={imgUrl} className="w-full h-full object-cover" alt="Local design asset" />
                          </button>
                        ))}
                      </div>
                      <div className="mt-2.5">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Or Paste Image URL</label>
                        <input
                          type="text"
                          value={editingProduct.image}
                          onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                          placeholder="e.g. Custom image URL"
                          className="mt-1 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Description</label>
                      <textarea
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        rows={2.5}
                        className="mt-1 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2 text-xs outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="rounded-xl bg-brand-rose-deep px-6 py-2.5 text-xs font-bold text-brand-cream hover:bg-brand-rose-mid"
                    >
                      Update Details
                    </button>
                  </form>
                )}

                {/* PRODUCT LIST */}
                <div className="grid grid-cols-1 gap-4">
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex items-center gap-4 p-3 border border-brand-cream-latte/75 rounded-2xl bg-brand-cream justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="h-12 w-12 rounded-xl object-cover border border-brand-cream-latte/50 shrink-0"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-neutral-800 line-clamp-1">{prod.name}</h4>
                          <p className="text-[9px] text-neutral-400 mt-0.5 uppercase tracking-wider font-semibold">{prod.category}</p>
                          <p className="text-[10px] font-semibold text-brand-rose-deep mt-1">₹{prod.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setShowAddForm(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="rounded-lg p-2 text-neutral-500 hover:text-brand-rose-deep hover:bg-brand-rose-light/35 transition-all"
                          title="Edit Price/Details"
                        >
                          <Edit className="h-4.5 w-4.5" />
                        </button>
                        
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="rounded-lg p-2 text-neutral-500 hover:text-brand-rose-deep hover:bg-brand-rose-light/35 transition-all"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STORE CONFIGURATIONS TAB */}
            {activeTab === 'settings' && (
              <div className="bg-brand-cream border border-brand-cream-latte rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="font-serif text-lg font-bold text-neutral-900 border-b border-brand-cream-latte/65 pb-2">
                  Store Configurations Settings
                </h3>

                {saveSettingsSuccess && (
                  <div className="bg-brand-green-sage/15 border border-brand-green-sage text-brand-green-olive rounded-xl p-3 text-xs flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>Configurations saved successfully. Store elements updated instantly.</span>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Contact WhatsApp Number</label>
                      <input
                        type="text"
                        value={formWaNumber}
                        onChange={(e) => setFormWaNumber(e.target.value)}
                        required
                        className="mt-1 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Store Email Address</label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        required
                        className="mt-1 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2.5 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Goa/India Shipping Fee (INR)</label>
                      <input
                        type="number"
                        value={formShipping}
                        onChange={(e) => setFormShipping(Number(e.target.value))}
                        required
                        className="mt-1 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-sans">Business Address</label>
                      <input
                        type="text"
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                        required
                        className="mt-1 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2.5 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Promo Notification Banner Notice</label>
                    <textarea
                      value={formNotice}
                      onChange={(e) => setFormNotice(e.target.value)}
                      rows={2.5}
                      required
                      className="mt-1 w-full rounded-xl border border-brand-cream-latte bg-brand-cream px-3.5 py-2 text-xs outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-xl bg-brand-rose-deep px-6 py-2.5 text-xs font-bold text-brand-cream hover:bg-brand-rose-mid transition-all shadow"
                  >
                    Save Modifications
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
