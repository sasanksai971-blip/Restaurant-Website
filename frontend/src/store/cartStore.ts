import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Coupon } from '../types';

interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number, customization?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon, discount: number) => void;
  removeCoupon: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      couponDiscount: 0,
      isOpen: false,
      setIsOpen: (open) => set({ isOpen: open }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addItem: (product, quantity = 1, customization = '') => {
        const currentItems = get().items;
        const itemPrice = product.discountedPrice && product.discountedPrice > 0 ? product.discountedPrice : product.price;
        const existingIdx = currentItems.findIndex(
          (i) => i.productId === product.id && (i.customization || '') === (customization || '')
        );

        if (existingIdx > -1) {
          const updated = [...currentItems];
          updated[existingIdx].quantity += quantity;
          set({ items: updated });
        } else {
          const newItem: CartItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            productId: product.id,
            quantity,
            customization: customization || undefined,
            price: itemPrice,
            product,
          };
          set({ items: [...currentItems, newItem] });
        }
      },
      removeItem: (itemId) => {
        const filtered = get().items.filter((i) => i.id !== itemId);
        set({ items: filtered });
        if (filtered.length === 0) {
          set({ appliedCoupon: null, couponDiscount: 0 });
        }
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        const updated = get().items.map((i) =>
          i.id === itemId ? { ...i, quantity } : i
        );
        set({ items: updated });
      },
      clearCart: () => {
        set({ items: [], appliedCoupon: null, couponDiscount: 0 });
      },
      applyCoupon: (coupon, discount) => {
        set({ appliedCoupon: coupon, couponDiscount: discount });
      },
      removeCoupon: () => {
        set({ appliedCoupon: null, couponDiscount: 0 });
      },
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      getTax: () => {
        return Math.round(get().getSubtotal() * 0.05); // 5% GST
      },
      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= 500) return 0;
        return 49;
      },
      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const tax = get().getTax();
        const delivery = get().getDeliveryFee();
        const discount = get().couponDiscount;
        return Math.max(0, subtotal + tax + delivery - discount);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
