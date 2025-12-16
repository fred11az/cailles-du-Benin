// Types pour les produits
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: 'eggs' | 'meat';
  image: string;
  stock: number;
  isAvailable: boolean;
}

// Types pour les zones de livraison
export interface DeliveryZone {
  id: string;
  name: string;
  price: number;
  estimatedTime: string;
  isActive: boolean;
}

// Types pour le panier
export interface CartItem {
  product: Product;
  quantity: number;
}

// Types pour les commandes
export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryZone: DeliveryZone;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  validatedBy?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export type OrderStatus = 'pending' | 'validated' | 'delivered' | 'cancelled';

// Type pour les statistiques admin
export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  todayRevenue: number;
  monthRevenue: number;
}

// Type pour la session admin
export interface AdminSession {
  isAuthenticated: boolean;
  adminName?: string;
}
