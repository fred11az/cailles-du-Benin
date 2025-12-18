import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Vérifier si Supabase est configuré
export const isSupabaseConfigured: boolean = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co')

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Types pour la base de données
export interface DbProduct {
  id: string
  name: string
  description: string
  price: number
  unit: string
  category: 'eggs' | 'meat'
  image: string
  stock: number
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface DbOrder {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_address: string
  delivery_zone_id: string
  items: Array<{
    product_id: string
    product_name: string
    quantity: number
    price: number
  }>
  subtotal: number
  delivery_fee: number
  total: number
  status: 'pending' | 'validated' | 'delivered' | 'cancelled'
  validated_by?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface DbDeliveryZone {
  id: string
  name: string
  price: number
  estimated_time: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DbProfessionalPricing {
  id: string
  name: string
  description: string
  price_per_tray: number | null
  min_quantity: number
  has_tray: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

// ============ FONCTIONS DE LECTURE ============

// Récupérer les produits
export async function fetchProducts(): Promise<DbProduct[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) {
    console.error('Erreur fetch products:', error)
    return null
  }
  return data
}

// Récupérer les zones de livraison
export async function fetchDeliveryZones(): Promise<DbDeliveryZone[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('delivery_zones')
    .select('*')
    .order('price', { ascending: true })
  if (error) {
    console.error('Erreur fetch zones:', error)
    return null
  }
  return data
}

// Récupérer les tarifs professionnels
export async function fetchProfessionalPricing(): Promise<DbProfessionalPricing[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('professional_pricing')
    .select('*')
    .order('id', { ascending: true })
  if (error) {
    console.error('Erreur fetch professional pricing:', error)
    return null
  }
  return data
}

// Récupérer les commandes
export async function fetchOrders(): Promise<DbOrder[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('Erreur fetch orders:', error)
    return null
  }
  return data
}

// ============ FONCTIONS DE MISE À JOUR ============

// Mettre à jour un produit
export async function updateProduct(id: string, updates: Partial<DbProduct>): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
  if (error) {
    console.error('Erreur update product:', error)
    return false
  }
  return true
}

// Mettre à jour une zone
export async function updateDeliveryZone(id: string, updates: Partial<DbDeliveryZone>): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase
    .from('delivery_zones')
    .update(updates)
    .eq('id', id)
  if (error) {
    console.error('Erreur update zone:', error)
    return false
  }
  return true
}

// Mettre à jour un tarif professionnel
export async function updateProfessionalPricing(id: string, updates: Partial<DbProfessionalPricing>): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase
    .from('professional_pricing')
    .update(updates)
    .eq('id', id)
  if (error) {
    console.error('Erreur update professional pricing:', error)
    return false
  }
  return true
}

// Mettre à jour le statut d'une commande
export async function updateOrderStatus(id: string, status: string, validatedBy?: string): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase
    .from('orders')
    .update({ status, validated_by: validatedBy })
    .eq('id', id)
  if (error) {
    console.error('Erreur update order:', error)
    return false
  }
  return true
}

// ============ FONCTIONS DE CRÉATION ============

// Créer une commande
export async function createOrder(order: Omit<DbOrder, 'id' | 'created_at' | 'updated_at'>): Promise<DbOrder | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single()
  if (error) {
    console.error('Erreur create order:', error)
    return null
  }
  return data
}

// Ajouter un produit
export async function createProduct(product: Omit<DbProduct, 'created_at' | 'updated_at'>): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase
    .from('products')
    .insert(product)
  if (error) {
    console.error('Erreur create product:', error)
    return false
  }
  return true
}

// Ajouter une zone
export async function createDeliveryZone(zone: Omit<DbDeliveryZone, 'created_at' | 'updated_at'>): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase
    .from('delivery_zones')
    .insert(zone)
  if (error) {
    console.error('Erreur create zone:', error)
    return false
  }
  return true
}

// ============ FONCTIONS DE SUPPRESSION ============

export async function deleteProduct(id: string): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  if (error) {
    console.error('Erreur delete product:', error)
    return false
  }
  return true
}

export async function deleteDeliveryZone(id: string): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase
    .from('delivery_zones')
    .delete()
    .eq('id', id)
  if (error) {
    console.error('Erreur delete zone:', error)
    return false
  }
  return true
}
