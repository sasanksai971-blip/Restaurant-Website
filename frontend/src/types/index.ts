export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  createdAt?: string;
}

export interface Address {
  id: string;
  userId: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  latitude?: number | null;
  longitude?: number | null;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  discountedPrice?: number | null;
  isVeg: boolean;
  isBestSeller: boolean;
  ingredients?: string;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  sugar?: number | null;
  sodium?: number | null;
  category?: Category;
}

export interface CartItem {
  id: string;
  cartId?: string;
  productId: string;
  quantity: number;
  customization?: string | null;
  price: number;
  product: Product;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
  distance?: number;
}

export type OrderType = 'delivery' | 'takeaway' | 'dine-in' | 'scheduled';

export type OrderStatus =
  | 'placed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'picked_up'
  | 'served'
  | 'cancelled';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  customization?: string | null;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  storeId?: string | null;
  addressId?: string | null;
  orderType: OrderType;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  total: number;
  scheduledDate?: string | null;
  scheduledTime?: string | null;
  couponCode?: string | null;
  paymentMethod?: string | null;
  createdAt: string;
  items?: OrderItem[];
  store?: Store | null;
  address?: Address | null;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  color: 'blue' | 'orange' | string;
  isActive: boolean;
  image?: string | null;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrder: number;
  maxUses?: number | null;
  usedCount?: number;
  validUntil?: string | null;
  isActive: boolean;
}

export interface TableBooking {
  id: string;
  userId: string;
  storeId: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: string;
  store?: Store;
}

export interface BulkOrder {
  id: string;
  name: string;
  phone: string;
  email: string;
  eventDate: string;
  eventType: string;
  guestCount: number;
  location: string;
  requirements?: string | null;
  status: string;
  createdAt?: string;
}
