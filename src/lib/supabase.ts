import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
