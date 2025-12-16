'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, CartItem, DeliveryZone, Order, AdminSession, Expense, ProductionStats, DailyProduction } from '@/types'

// Données initiales des produits
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Oeufs de Cailles - Plateau de 30',
    description: 'Oeufs de caille frais de notre ferme, riches en protéines et en nutriments. Plateau de 30 œufs parfaits pour une alimentation saine.',
    price: 1000,
    unit: 'plateau',
    category: 'eggs',
    image: '/images/eggs.jpg',
    stock: 100,
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Viande de Caille Déplumée',
    description: 'Caille entière fraîche, soigneusement déplumée et nettoyée, prête à cuisiner. Idéale pour vos grillades et plats raffinés.',
    price: 1200,
    unit: 'unité',
    category: 'meat',
    image: '/images/meat.jpg',
    stock: 50,
    isAvailable: true,
  },
]

// Données initiales des zones de livraison
const initialZones: DeliveryZone[] = [
  { id: '1', name: 'Cotonou', price: 1000, estimatedTime: '1-2 heures', isActive: true },
  { id: '2', name: 'Calavi', price: 600, estimatedTime: '2-3 heures', isActive: true },
  { id: '3', name: 'Porto-Novo', price: 1500, estimatedTime: '3-4 heures', isActive: true },
]

// Données initiales de production
const initialProductionStats: ProductionStats = {
  totalQuails: 500,
  maleQuails: 100,
  femaleQuails: 400,
  eggsCollectedToday: 0,
  totalEggsInStock: 3000, // 100 plateaux de 30
  totalMeatInStock: 50,
  lastUpdated: new Date().toISOString(),
}

interface StoreState {
  // Produits
  products: Product[]
  setProducts: (products: Product[]) => void
  updateProduct: (id: string, updates: Partial<Product>) => void

  // Panier
  cart: CartItem[]
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemsCount: () => number

  // Zones de livraison
  zones: DeliveryZone[]
  setZones: (zones: DeliveryZone[]) => void
  addZone: (zone: DeliveryZone) => void
  updateZone: (id: string, updates: Partial<DeliveryZone>) => void
  deleteZone: (id: string) => void

  // Commandes
  orders: Order[]
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order['status'], validatedBy?: string) => void
  getOrdersByStatus: (status: Order['status']) => Order[]

  // Admin
  adminSession: AdminSession
  login: (password: string, adminName: string) => boolean
  logout: () => void

  // Comptabilité - Dépenses
  expenses: Expense[]
  addExpense: (expense: Expense) => void
  updateExpense: (id: string, updates: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  getExpensesByCategory: (category: Expense['category']) => Expense[]
  getExpensesByPeriod: (startDate: string, endDate: string) => Expense[]
  getTotalExpenses: () => number
  getTotalRevenue: () => number
  getNetProfit: () => number

  // Suivi Production
  productionStats: ProductionStats
  updateProductionStats: (updates: Partial<ProductionStats>) => void
  dailyProductions: DailyProduction[]
  addDailyProduction: (production: DailyProduction) => void
  collectEggs: (quantity: number) => void
  processQuails: (quantity: number, meatKg: number) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Produits
      products: initialProducts,
      setProducts: (products) => set({ products }),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      // Panier
      cart: [],
      addToCart: (product, quantity) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.product.id === product.id)
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }
          return { cart: [...state.cart, { product, quantity }] }
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        })),
      updateCartQuantity: (productId, quantity) =>
        set((state) => ({
          cart: quantity <= 0
            ? state.cart.filter((item) => item.product.id !== productId)
            : state.cart.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
              ),
        })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const { cart } = get()
        return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
      },
      getCartItemsCount: () => {
        const { cart } = get()
        return cart.reduce((count, item) => count + item.quantity, 0)
      },

      // Zones de livraison
      zones: initialZones,
      setZones: (zones) => set({ zones }),
      addZone: (zone) => set((state) => ({ zones: [...state.zones, zone] })),
      updateZone: (id, updates) =>
        set((state) => ({
          zones: state.zones.map((z) => (z.id === id ? { ...z, ...updates } : z)),
        })),
      deleteZone: (id) =>
        set((state) => ({
          zones: state.zones.filter((z) => z.id !== id),
        })),

      // Commandes
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (orderId, status, validatedBy) =>
        set((state) => {
          const order = state.orders.find((o) => o.id === orderId)

          // Si on valide une commande, déduire du stock
          if (order && status === 'validated' && order.status === 'pending') {
            const newProductionStats = { ...state.productionStats }

            order.items.forEach((item) => {
              if (item.product.category === 'eggs') {
                // Déduire les œufs (1 plateau = 30 œufs)
                const eggsToDeduct = item.quantity * 30
                newProductionStats.totalEggsInStock = Math.max(0, newProductionStats.totalEggsInStock - eggsToDeduct)
              } else if (item.product.category === 'meat') {
                // Déduire la viande (par unité de caille)
                newProductionStats.totalMeatInStock = Math.max(0, newProductionStats.totalMeatInStock - item.quantity)
                // Déduire du nombre de mâles (1 commande = 1 caille mâle)
                newProductionStats.maleQuails = Math.max(0, newProductionStats.maleQuails - item.quantity)
                newProductionStats.totalQuails = Math.max(0, newProductionStats.totalQuails - item.quantity)
              }
            })
            newProductionStats.lastUpdated = new Date().toISOString()

            return {
              orders: state.orders.map((o) =>
                o.id === orderId
                  ? { ...o, status, validatedBy: validatedBy || o.validatedBy, updatedAt: new Date().toISOString() }
                  : o
              ),
              productionStats: newProductionStats,
            }
          }

          return {
            orders: state.orders.map((o) =>
              o.id === orderId
                ? { ...o, status, validatedBy: validatedBy || o.validatedBy, updatedAt: new Date().toISOString() }
                : o
            ),
          }
        }),
      getOrdersByStatus: (status) => {
        const { orders } = get()
        return orders.filter((o) => o.status === status)
      },

      // Admin
      adminSession: { isAuthenticated: false },
      login: (password, adminName) => {
        const correctPassword = 'MAHUTIN11@@'
        if (password === correctPassword) {
          set({ adminSession: { isAuthenticated: true, adminName } })
          return true
        }
        return false
      },
      logout: () => set({ adminSession: { isAuthenticated: false } }),

      // Comptabilité - Dépenses
      expenses: [],
      addExpense: (expense) => set((state) => ({ expenses: [expense, ...state.expenses] })),
      updateExpense: (id, updates) =>
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
      getExpensesByCategory: (category) => {
        const { expenses } = get()
        return expenses.filter((e) => e.category === category)
      },
      getExpensesByPeriod: (startDate, endDate) => {
        const { expenses } = get()
        return expenses.filter((e) => e.date >= startDate && e.date <= endDate)
      },
      getTotalExpenses: () => {
        const { expenses } = get()
        return expenses.reduce((total, e) => total + e.amount, 0)
      },
      getTotalRevenue: () => {
        const { orders } = get()
        // Utiliser subtotal (sans frais de livraison) pour la comptabilité interne
        return orders
          .filter((o) => o.status === 'delivered' || o.status === 'validated')
          .reduce((total, o) => total + o.subtotal, 0)
      },
      getNetProfit: () => {
        const { getTotalRevenue, getTotalExpenses } = get()
        return getTotalRevenue() - getTotalExpenses()
      },

      // Suivi Production
      productionStats: initialProductionStats,
      updateProductionStats: (updates) =>
        set((state) => ({
          productionStats: { ...state.productionStats, ...updates, lastUpdated: new Date().toISOString() },
        })),
      dailyProductions: [],
      addDailyProduction: (production) =>
        set((state) => ({ dailyProductions: [production, ...state.dailyProductions] })),
      collectEggs: (quantity) =>
        set((state) => ({
          productionStats: {
            ...state.productionStats,
            eggsCollectedToday: state.productionStats.eggsCollectedToday + quantity,
            totalEggsInStock: state.productionStats.totalEggsInStock + quantity,
            lastUpdated: new Date().toISOString(),
          },
        })),
      processQuails: (quantity, meatKg) =>
        set((state) => ({
          productionStats: {
            ...state.productionStats,
            totalQuails: Math.max(0, state.productionStats.totalQuails - quantity),
            totalMeatInStock: state.productionStats.totalMeatInStock + meatKg,
            lastUpdated: new Date().toISOString(),
          },
        })),
    }),
    {
      name: 'mahutin-ferme-store',
      partialize: (state) => ({
        cart: state.cart,
        orders: state.orders,
        products: state.products,
        zones: state.zones,
        adminSession: state.adminSession,
        expenses: state.expenses,
        productionStats: state.productionStats,
        dailyProductions: state.dailyProductions,
      }),
    }
  )
)

// Fonction utilitaire pour générer un numéro de commande
export function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `MF${year}${month}${day}${random}`
}

// Fonction pour formater le prix en FCFA
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
}

// Fonction pour valider le numéro de téléphone béninois
export function validateBeninPhone(phone: string): boolean {
  // Format béninois: 8 chiffres commençant par 9, 6, ou 5
  const cleanPhone = phone.replace(/\s/g, '')
  const beninPhoneRegex = /^(\+229)?[0-9]{8}$/
  return beninPhoneRegex.test(cleanPhone)
}

// Fonction pour formater une date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Fonction pour obtenir le mois courant au format YYYY-MM
export function getCurrentMonth(): string {
  const date = new Date()
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
}
