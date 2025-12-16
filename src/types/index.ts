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

// Types pour la comptabilité
export type ExpenseCategory =
  | 'provende'
  | 'medicament'
  | 'equipement'
  | 'salaire'
  | 'transport'
  | 'electricite'
  | 'eau'
  | 'autre';

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  createdAt: string;
  createdBy?: string;
}

// Types pour le suivi de production
export interface ProductionStats {
  totalQuails: number;
  maleQuails: number;
  femaleQuails: number;
  eggsCollectedToday: number;
  totalEggsInStock: number; // En nombre d'oeufs (pas plateaux)
  totalMeatInStock: number; // En kg
  lastUpdated: string;
}

export interface DailyProduction {
  id: string;
  date: string;
  eggsCollected: number;
  quailsProcessed: number; // Cailles abattues
  notes?: string;
  createdAt: string;
}

// Types pour les catégories de dépenses avec labels
export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: 'provende', label: 'Provende / Aliments' },
  { value: 'medicament', label: 'Médicaments / Vétérinaire' },
  { value: 'equipement', label: 'Équipement' },
  { value: 'salaire', label: 'Salaires' },
  { value: 'transport', label: 'Transport' },
  { value: 'electricite', label: 'Électricité' },
  { value: 'eau', label: 'Eau' },
  { value: 'autre', label: 'Autre' },
];
