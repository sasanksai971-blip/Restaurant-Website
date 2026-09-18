export interface PizzaSize {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  servingSize: string;
  active: boolean;
  sortOrder: number;
}

export interface PizzaCrust {
  id: string;
  name: string;
  description: string;
  additionalPrice: number;
  active: boolean;
  sortOrder: number;
}

export interface PizzaSauce {
  id: string;
  name: string;
  description: string;
  additionalPrice: number;
  color: string;
  active: boolean;
  sortOrder: number;
}

export interface PizzaCheese {
  id: string;
  name: string;
  description: string;
  additionalPrice: number;
  color: string;
  active: boolean;
  sortOrder: number;
}

export interface PizzaTopping {
  id: string;
  name: string;
  category: 'Vegetables' | 'Non-Veg' | 'Premium' | string;
  price: number;
  extraPrice: number;
  vegetarian: boolean;
  image?: string;
  color: string;
  active: boolean;
  sortOrder: number;
}

export interface PizzaExtra {
  id: string;
  name: string;
  category: 'Add-ons' | 'Dips' | 'Breads' | 'Drinks' | 'Desserts' | string;
  price: number;
  active: boolean;
  sortOrder: number;
}

export interface SelectedTopping {
  id: string;
  topping: PizzaTopping;
  quantity: 'normal' | 'extra';
}

export interface SelectedExtra {
  id: string;
  extra: PizzaExtra;
  quantity: number;
}

export interface CustomPizzaConfig {
  size: PizzaSize | null;
  crust: PizzaCrust | null;
  sauce: PizzaSauce | null;
  cheese: PizzaCheese | null;
  toppings: SelectedTopping[];
  extras: SelectedExtra[];
}

export interface CustomPizzaBreakdown {
  basePizza: { name: string; price: number };
  crust: { name: string; price: number };
  sauce: { name: string; price: number };
  cheese: { name: string; price: number };
  toppings: Array<{
    id: string;
    name: string;
    category: string;
    quantity: 'normal' | 'extra';
    price: number;
    vegetarian: boolean;
    color: string;
  }>;
  extras: Array<{
    id: string;
    name: string;
    category: string;
    quantity: number;
    unitPrice: number;
    price: number;
  }>;
  toppingsTotal: number;
  extrasTotal: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface PresetCombo {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  isVeg: boolean;
  sizeName: string;
  crustName: string;
  sauceName: string;
  cheeseName: string;
  toppingNames: Array<{ name: string; quantity: 'normal' | 'extra' }>;
  extraNames?: Array<{ name: string; quantity: number }>;
}
