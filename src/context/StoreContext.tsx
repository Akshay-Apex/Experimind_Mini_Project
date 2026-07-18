import React, { createContext, useContext, useState, useEffect } from 'react';
import { GALLERY_ENTRIES } from '../assets/gallery';


export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
  varieties: string[];
}

export interface CartItem {
  id: string; // Unique ID for this specific cart configuration (product_id + customization hash)
  product: Product;
  quantity: number;
  customizations: {
    primaryColor: string;
    secondaryColor: string;
    fairyLights: boolean;
    pearls: boolean;
    customNote: string;
    customSize: string;
  };
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  pincode: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    customizations: string;
  }[];
  total: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

export interface StoreSettings {
  whatsAppNumber: string;
  emailAddress: string;
  businessAddress: string;
  shippingFee: number;
  promoNotice: string;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  settings: StoreSettings;
  addToCart: (product: Product, quantity: number, customizations: CartItem['customizations']) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQty: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (updatedProduct: Product) => void;
  deleteProduct: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateSettings: (settings: StoreSettings) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Blushing Rose & Tulip Bouquet',
    category: 'Handmade Bouquets',
    price: 1299,
    description: 'An elegant arrangement combining soft pink pipe cleaner roses and pastel tulips, wrapped in premium dual-tone floral mesh. Perfect for anniversaries and expressions of affection.',
    image: GALLERY_ENTRIES[0].src,
    inStock: true,
    varieties: ['Roses', 'Tulips', 'Baby\'s Breath']
  },
  {
    id: 'prod-2',
    name: 'Everlasting Sunshine Sunflower',
    category: 'Single Flowers',
    price: 349,
    description: 'A radiant, single-stem pipe cleaner sunflower crafted with meticulous detail. Features a textured dark brown center and vibrant golden petals, designed to brighten any space indefinitely.',
    image: GALLERY_ENTRIES[1].src,
    inStock: true,
    varieties: ['Sunflowers']
  },
  {
    id: 'prod-3',
    name: 'Bridal Grace Lily Bouquet',
    category: 'Bridal Bouquets',
    price: 2499,
    description: 'A stunning, high-density bridal bouquet featuring pristine white calla lilies and orchids, embellished with delicate pearl studs. Hand-wrapped with soft satin ribbon.',
    image: GALLERY_ENTRIES[2].src,
    inStock: true,
    varieties: ['Lilies', 'Orchids', 'Baby\'s Breath']
  },
  {
    id: 'prod-4',
    name: 'Springtime Canterbury Basket',
    category: 'Flower Baskets',
    price: 1599,
    description: 'A rustic woven wicker basket spilling over with colorful Canterbury bells, gerbera daisies, and lavender sprigs. Includes a lovely matching bow detail on the handle.',
    image: GALLERY_ENTRIES[3].src,
    inStock: true,
    varieties: ['Canterbury Bells', 'Gerbera Daisies', 'Lavender']
  },
  {
    id: 'prod-5',
    name: 'Warm Glow Rose Floral Lamp',
    category: 'Floral Lamps',
    price: 1899,
    description: 'A hand-crafted tabletop floral lamp featuring a glass dome container, illuminating a gorgeous trio of red pipe cleaner roses entwined with micro fairy lights. USB powered.',
    image: GALLERY_ENTRIES[4].src,
    inStock: true,
    varieties: ['Roses']
  },
  {
    id: 'prod-6',
    name: 'Custom Meadow Arrangement',
    category: 'Custom Floral Arrangements',
    price: 1999,
    description: 'A bespoke selection of hydrangeas, lotus, and baby\'s breath arranged elegantly in a ceramic vase. Customizable in color theme and size to match your interior design.',
    image: GALLERY_ENTRIES[5].src,
    inStock: true,
    varieties: ['Hydrangeas', 'Lotus', 'Baby\'s Breath']
  },
  {
    id: 'prod-7',
    name: 'Heartfelt Lavender Gift Set',
    category: 'Personalized Gift Sets',
    price: 1499,
    description: 'A beautifully curated gift hamper containing a bundle of aromatic lavender stems, a box of luxury chocolates, and a premium hand-written card styled to your requirements.',
    image: GALLERY_ENTRIES[6].src,
    inStock: true,
    varieties: ['Lavender', 'Baby\'s Breath']
  },
  {
    id: 'prod-8',
    name: 'Cuddly Bear & Tulip Combo',
    category: 'Plushie Add-ons',
    price: 899,
    description: 'A charming plush teddy bear holding a hand-crafted bright red pipe cleaner tulip. An endearing gift option that is perfect for birthdays, graduations, or just because.',
    image: GALLERY_ENTRIES[7].src,
    inStock: true,
    varieties: ['Tulips']
  }
];

const DEFAULT_SETTINGS: StoreSettings = {
  whatsAppNumber: '919876543210', // Default realistic number for active testing (user can edit in dashboard)
  emailAddress: 'amrasstudio.co@gmail.com',
  businessAddress: 'Margao, Goa, India, 403707',
  shippingFee: 100, // ₹100 flat delivery across India
  promoNotice: '✨ Flat ₹100 shipping across India. Standard production timeline: 2 - 4 days.'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('amra_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('amra_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('amra_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('amra_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('amra_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('amra_settings', JSON.stringify(settings));
  }, [settings]);

  const addToCart = (product: Product, quantity: number, customizations: CartItem['customizations']) => {
    // Generate a unique ID based on product id and customizations
    const customizationStr = JSON.stringify(customizations);
    const cartItemId = `${product.id}-${btoa(customizationStr).substring(0, 8)}`;

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.id === cartItemId);
      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx].quantity += quantity;
        return newCart;
      }
      return [...prevCart, { id: cartItemId, product, quantity, customizations }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
  };

  const updateCartQty = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === cartItemId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => setCart([]);

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProd,
      id: `prod-${Date.now()}`
    };
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = (updatedProd: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Pending'
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        settings,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        updateSettings
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
