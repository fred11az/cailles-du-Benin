'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, CheckCircle } from 'lucide-react'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { useStore, formatPrice, generateOrderNumber, validateBeninPhone } from '@/store/useStore'
import type { Order, DeliveryZone } from '@/types'

export default function CartPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
  })

  const cart = useStore((state) => state.cart)
  const zones = useStore((state) => state.zones)
  const updateCartQuantity = useStore((state) => state.updateCartQuantity)
  const removeFromCart = useStore((state) => state.removeFromCart)
  const clearCart = useStore((state) => state.clearCart)
  const getCartTotal = useStore((state) => state.getCartTotal)
  const addOrder = useStore((state) => state.addOrder)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const subtotal = getCartTotal()
  const deliveryFee = selectedZone?.price || 0
  const total = subtotal + deliveryFee
  const activeZones = zones.filter((z) => z.isActive)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Le nom est requis'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis'
    } else if (!validateBeninPhone(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide (format: 01XXXXXXXX - 10 chiffres)'
    }

    if (!formData.address.trim()) {
      newErrors.address = "L'adresse est requise"
    }

    if (!selectedZone) {
      newErrors.zone = 'Veuillez sélectionner une zone de livraison'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || cart.length === 0) return

    setIsSubmitting(true)

    // Simuler un délai de traitement
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newOrderNumber = generateOrderNumber()
    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber: newOrderNumber,
      customerName: formData.customerName,
      phone: formData.phone,
      address: formData.address,
      deliveryZone: selectedZone!,
      items: [...cart],
      subtotal,
      deliveryFee,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    addOrder(order)
    setOrderNumber(newOrderNumber)
    setOrderSuccess(true)
    clearCart()
    setIsSubmitting(false)
  }

  if (orderSuccess) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Commande confirmée !
            </h1>
            <p className="text-gray-600 mb-2">
              Merci pour votre commande. Votre numéro de commande est :
            </p>
            <p className="text-2xl font-bold text-primary mb-6">{orderNumber}</p>
            <p className="text-gray-600 mb-8">
              Nous vous contacterons bientôt pour confirmer la livraison.
            </p>
            <Link href="/" className="btn-primary inline-block">
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Votre panier est vide
            </h1>
            <p className="text-gray-600 mb-8">
              Découvrez nos délicieux produits de caille frais.
            </p>
            <Link href="/#produits" className="btn-primary inline-block">
              Voir nos produits
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Retour */}
        <Link
          href="/#produits"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Continuer mes achats</span>
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Mon Panier
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des produits */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-2xl shadow-lg p-4 md:p-6 flex flex-col sm:flex-row gap-4"
              >
                {/* Image */}
                <div className="relative w-full sm:w-24 h-32 sm:h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Détails */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.product.price)} / {item.product.unit}
                    </p>
                  </div>

                  {/* Quantité */}
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                      <button
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-primary">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Récapitulatif et formulaire */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Récapitulatif
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className={`input-field ${errors.customerName ? 'border-red-500' : ''}`}
                    placeholder="Votre nom"
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="Ex: 0197000000"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Adresse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse de livraison *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className={`input-field min-h-[80px] ${errors.address ? 'border-red-500' : ''}`}
                    placeholder="Votre adresse complète"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                {/* Zone de livraison */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zone de livraison *
                  </label>
                  <select
                    value={selectedZone?.id || ''}
                    onChange={(e) => {
                      const zone = activeZones.find((z) => z.id === e.target.value)
                      setSelectedZone(zone || null)
                    }}
                    className={`input-field ${errors.zone ? 'border-red-500' : ''}`}
                  >
                    <option value="">Sélectionnez une zone</option>
                    {activeZones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name} - {formatPrice(zone.price)}
                      </option>
                    ))}
                  </select>
                  {errors.zone && (
                    <p className="text-red-500 text-sm mt-1">{errors.zone}</p>
                  )}
                </div>

                {/* Totaux */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span>
                      {selectedZone ? formatPrice(deliveryFee) : '---'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Bouton de commande */}
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Traitement...' : 'Valider ma commande'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
