'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/store/useStore'
import {
  isSupabaseConfigured,
  fetchProducts,
  fetchDeliveryZones,
  fetchProfessionalPricing,
  fetchOrders,
  fetchProductionStats,
  fetchDailyProduction,
  fetchExpenses,
  updateProfessionalPricing as updateProfessionalPricingDb,
  updateProduct as updateProductDb,
  updateDeliveryZone as updateDeliveryZoneDb,
  updateOrderStatus as updateOrderStatusDb,
  updateProductionStatsDb,
  createOrder as createOrderDb,
  createProduct as createProductDb,
  deleteProduct as deleteProductDb,
  createDeliveryZone as createDeliveryZoneDb,
  deleteDeliveryZone as deleteDeliveryZoneDb,
  createDailyProduction as createDailyProductionDb,
  createExpense as createExpenseDb,
  deleteExpense as deleteExpenseDb,
  DbProduct,
  DbDeliveryZone,
  DbProfessionalPricing,
  DbProductionStats,
  DbDailyProduction,
  DbExpense,
} from '@/lib/supabase'
import type { Product, DeliveryZone, ProfessionalPricing, Order, ProductionStats, DailyProduction, Expense } from '@/types'

// Convertir les données DB vers le format du store
function dbProductToProduct(db: DbProduct): Product {
  return {
    id: db.id,
    name: db.name,
    description: db.description,
    price: db.price,
    unit: db.unit,
    category: db.category,
    image: db.image,
    stock: db.stock,
    isAvailable: db.is_available,
  }
}

function dbZoneToZone(db: DbDeliveryZone): DeliveryZone {
  return {
    id: db.id,
    name: db.name,
    price: db.price,
    estimatedTime: db.estimated_time,
    isActive: db.is_active,
  }
}

function dbPricingToPricing(db: DbProfessionalPricing): ProfessionalPricing {
  return {
    id: db.id as ProfessionalPricing['id'],
    name: db.name,
    description: db.description,
    pricePerTray: db.price_per_tray,
    minQuantity: db.min_quantity,
    hasBranding: db.has_tray,
    isActive: db.is_active,
  }
}

function dbProductionStatsToStats(db: DbProductionStats): ProductionStats {
  return {
    totalQuails: db.total_quails,
    maleQuails: db.male_quails,
    femaleQuails: db.female_quails,
    eggsCollectedToday: db.eggs_collected_today,
    totalEggsInStock: db.total_eggs_in_stock,
    totalMeatInStock: db.total_meat_in_stock,
    lastUpdated: db.last_updated,
    lastUpdatedBy: db.last_updated_by,
  }
}

function dbDailyProductionToProduction(db: DbDailyProduction): DailyProduction {
  return {
    id: db.id,
    date: db.date,
    eggsCollected: db.eggs_collected,
    quailsProcessed: db.quails_processed,
    quailsLost: db.quails_lost,
    notes: db.notes,
    createdAt: db.created_at,
    createdBy: db.created_by,
  }
}

function dbExpenseToExpense(db: DbExpense): Expense {
  return {
    id: db.id,
    date: db.date,
    category: db.category as Expense['category'],
    description: db.description || '',
    amount: db.amount,
    createdAt: db.created_at,
    createdBy: db.created_by,
  }
}

export function useSupabaseSync() {
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setProducts = useStore((state) => state.setProducts)
  const setZones = useStore((state) => state.setZones)
  const updateProductionStats = useStore((state) => state.updateProductionStats)
  const setDailyProductions = useStore((state) => state.setDailyProductions)
  const setExpenses = useStore((state) => state.setExpenses)

  useEffect(() => {
    async function loadData() {
      if (!isSupabaseConfigured) {
        console.log('Supabase non configuré, utilisation du localStorage')
        setIsLoading(false)
        return
      }

      try {
        // Charger les données en parallèle
        const [products, zones, pricing, productionStats, dailyProduction, expenses] = await Promise.all([
          fetchProducts(),
          fetchDeliveryZones(),
          fetchProfessionalPricing(),
          fetchProductionStats(),
          fetchDailyProduction(),
          fetchExpenses(),
        ])

        if (products) {
          setProducts(products.map(dbProductToProduct))
        }

        if (zones) {
          setZones(zones.map(dbZoneToZone))
        }

        if (pricing) {
          // Mettre à jour les tarifs professionnels dans le store
          const store = useStore.getState()
          pricing.forEach((p) => {
            store.updateProfessionalPricing(p.id as ProfessionalPricing['id'], {
              name: p.name,
              description: p.description,
              pricePerTray: p.price_per_tray,
              minQuantity: p.min_quantity,
              hasBranding: p.has_tray,
              isActive: p.is_active,
            })
          })
        }

        if (productionStats) {
          updateProductionStats(dbProductionStatsToStats(productionStats))
        }

        if (dailyProduction) {
          setDailyProductions(dailyProduction.map(dbDailyProductionToProduction))
        }

        if (expenses) {
          setExpenses(expenses.map(dbExpenseToExpense))
        }

        setIsConnected(true)
        console.log('Données chargées depuis Supabase')
      } catch (err) {
        console.error('Erreur de connexion Supabase:', err)
        setError('Erreur de connexion à la base de données')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [setProducts, setZones, updateProductionStats, setDailyProductions, setExpenses])

  return { isLoading, isConnected, error, isSupabaseConfigured }
}

// Hook pour synchroniser les mises à jour vers Supabase
export function useSyncToSupabase() {
  const syncProfessionalPricing = async (
    id: string,
    updates: Partial<ProfessionalPricing>
  ): Promise<boolean> => {
    if (!isSupabaseConfigured) return true // Mode local uniquement

    const dbUpdates: Record<string, unknown> = {}
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.pricePerTray !== undefined) dbUpdates.price_per_tray = updates.pricePerTray
    if (updates.minQuantity !== undefined) dbUpdates.min_quantity = updates.minQuantity
    if (updates.hasBranding !== undefined) dbUpdates.has_tray = updates.hasBranding
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive

    return updateProfessionalPricingDb(id, dbUpdates)
  }

  const syncProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    if (!isSupabaseConfigured) return true

    const dbUpdates: Record<string, unknown> = {}
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.price !== undefined) dbUpdates.price = updates.price
    if (updates.unit !== undefined) dbUpdates.unit = updates.unit
    if (updates.category !== undefined) dbUpdates.category = updates.category
    if (updates.image !== undefined) dbUpdates.image = updates.image
    if (updates.stock !== undefined) dbUpdates.stock = updates.stock
    if (updates.isAvailable !== undefined) dbUpdates.is_available = updates.isAvailable

    return updateProductDb(id, dbUpdates)
  }

  const syncZone = async (id: string, updates: Partial<DeliveryZone>): Promise<boolean> => {
    if (!isSupabaseConfigured) return true

    const dbUpdates: Record<string, unknown> = {}
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.price !== undefined) dbUpdates.price = updates.price
    if (updates.estimatedTime !== undefined) dbUpdates.estimated_time = updates.estimatedTime
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive

    return updateDeliveryZoneDb(id, dbUpdates)
  }

  const syncOrderStatus = async (
    id: string,
    status: string,
    validatedBy?: string
  ): Promise<boolean> => {
    if (!isSupabaseConfigured) return true
    return updateOrderStatusDb(id, status, validatedBy)
  }

  const addProductToDb = async (product: Product): Promise<boolean> => {
    if (!isSupabaseConfigured) return true
    return createProductDb({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      unit: product.unit,
      category: product.category,
      image: product.image,
      stock: product.stock,
      is_available: product.isAvailable,
    })
  }

  const removeProductFromDb = async (id: string): Promise<boolean> => {
    if (!isSupabaseConfigured) return true
    return deleteProductDb(id)
  }

  const addZoneToDb = async (zone: DeliveryZone): Promise<boolean> => {
    if (!isSupabaseConfigured) return true
    return createDeliveryZoneDb({
      id: zone.id,
      name: zone.name,
      price: zone.price,
      estimated_time: zone.estimatedTime,
      is_active: zone.isActive,
    })
  }

  const removeZoneFromDb = async (id: string): Promise<boolean> => {
    if (!isSupabaseConfigured) return true
    return deleteDeliveryZoneDb(id)
  }

  const syncProductionStats = async (stats: Partial<ProductionStats>): Promise<boolean> => {
    if (!isSupabaseConfigured) return true

    const dbUpdates: Record<string, unknown> = {}
    if (stats.totalQuails !== undefined) dbUpdates.total_quails = stats.totalQuails
    if (stats.maleQuails !== undefined) dbUpdates.male_quails = stats.maleQuails
    if (stats.femaleQuails !== undefined) dbUpdates.female_quails = stats.femaleQuails
    if (stats.eggsCollectedToday !== undefined) dbUpdates.eggs_collected_today = stats.eggsCollectedToday
    if (stats.totalEggsInStock !== undefined) dbUpdates.total_eggs_in_stock = stats.totalEggsInStock
    if (stats.totalMeatInStock !== undefined) dbUpdates.total_meat_in_stock = stats.totalMeatInStock
    if (stats.lastUpdated !== undefined) dbUpdates.last_updated = stats.lastUpdated
    if (stats.lastUpdatedBy !== undefined) dbUpdates.last_updated_by = stats.lastUpdatedBy

    return updateProductionStatsDb(dbUpdates)
  }

  const addDailyProductionToDb = async (production: DailyProduction): Promise<boolean> => {
    if (!isSupabaseConfigured) return true
    return createDailyProductionDb({
      id: production.id,
      date: production.date,
      eggs_collected: production.eggsCollected,
      quails_processed: production.quailsProcessed,
      quails_lost: production.quailsLost,
      notes: production.notes,
      created_by: production.createdBy,
    })
  }

  const addOrderToDb = async (order: Order): Promise<boolean> => {
    if (!isSupabaseConfigured) return true
    const dbOrder = await createOrderDb({
      order_number: order.orderNumber,
      customer_name: order.customerName,
      customer_phone: order.phone,
      customer_address: order.address,
      delivery_zone_id: order.deliveryZone.id,
      items: order.items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      subtotal: order.subtotal,
      delivery_fee: order.deliveryFee,
      total: order.total,
      status: order.status,
      validated_by: order.validatedBy,
      notes: order.notes,
    })
    return dbOrder !== null
  }

  const addExpenseToDb = async (expense: Expense): Promise<boolean> => {
    if (!isSupabaseConfigured) return true
    return createExpenseDb({
      id: expense.id,
      date: expense.date,
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      created_by: expense.createdBy,
    })
  }

  const removeExpenseFromDb = async (id: string): Promise<boolean> => {
    if (!isSupabaseConfigured) return true
    return deleteExpenseDb(id)
  }

  return {
    syncProfessionalPricing,
    syncProduct,
    syncZone,
    syncOrderStatus,
    addProductToDb,
    removeProductFromDb,
    addZoneToDb,
    removeZoneFromDb,
    syncProductionStats,
    addDailyProductionToDb,
    addOrderToDb,
    addExpenseToDb,
    removeExpenseFromDb,
    isSupabaseConfigured,
  }
}
