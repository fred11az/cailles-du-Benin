'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/store/useStore'
import {
  isSupabaseConfigured,
  fetchProducts,
  fetchDeliveryZones,
  fetchProfessionalPricing,
  fetchOrders,
  updateProfessionalPricing as updateProfessionalPricingDb,
  updateProduct as updateProductDb,
  updateDeliveryZone as updateDeliveryZoneDb,
  updateOrderStatus as updateOrderStatusDb,
  createOrder as createOrderDb,
  DbProduct,
  DbDeliveryZone,
  DbProfessionalPricing,
} from '@/lib/supabase'
import type { Product, DeliveryZone, ProfessionalPricing, Order } from '@/types'

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

export function useSupabaseSync() {
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setProducts = useStore((state) => state.setProducts)
  const setZones = useStore((state) => state.setZones)

  useEffect(() => {
    async function loadData() {
      if (!isSupabaseConfigured) {
        console.log('Supabase non configuré, utilisation du localStorage')
        setIsLoading(false)
        return
      }

      try {
        // Charger les données en parallèle
        const [products, zones, pricing] = await Promise.all([
          fetchProducts(),
          fetchDeliveryZones(),
          fetchProfessionalPricing(),
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
  }, [setProducts, setZones])

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

  return {
    syncProfessionalPricing,
    syncProduct,
    syncZone,
    syncOrderStatus,
    isSupabaseConfigured,
  }
}
