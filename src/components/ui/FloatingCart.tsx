'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, X, Trash2, Plus, Minus } from 'lucide-react'
import { useStore, formatPrice } from '@/store/useStore'

interface FloatingCartProps {
  isProfessional?: boolean
  professionalCategory?: string
}

export default function FloatingCart({ isProfessional = false, professionalCategory }: FloatingCartProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const cart = useStore((state) => state.cart)
  const getCartTotal = useStore((state) => state.getCartTotal)
  const getCartItemsCount = useStore((state) => state.getCartItemsCount)
  const removeFromCart = useStore((state) => state.removeFromCart)
  const updateCartQuantity = useStore((state) => state.updateCartQuantity)
  const professionalPricing = useStore((state) => state.professionalPricing)

  const itemsCount = getCartItemsCount()

  // Obtenir le prix professionnel si applicable
  const getProfessionalPrice = () => {
    if (!isProfessional || !professionalCategory) return null
    const pricing = professionalPricing.find(p => p.id === professionalCategory)
    return pricing?.pricePerTray || null
  }

  const professionalPrice = getProfessionalPrice()

  // Calculer le total avec prix professionnels si applicable
  const calculateTotal = () => {
    if (isProfessional && professionalPrice) {
      return cart.reduce((total, item) => {
        if (item.product.category === 'eggs') {
          return total + (professionalPrice * item.quantity)
        }
        return total + (item.product.price * item.quantity)
      }, 0)
    }
    return getCartTotal()
  }

  // Afficher le panier flottant après un certain scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Vérifier au chargement

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Ne pas afficher si le panier est vide ou si pas assez scrollé
  if (!isVisible && itemsCount === 0) return null

  return (
    <>
      {/* Bouton flottant du panier */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-primary text-white p-4 rounded-full shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all duration-300 ${
          isVisible || itemsCount > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <ShoppingCart className="w-6 h-6" />
        {itemsCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full animate-pulse">
            {itemsCount}
          </span>
        )}
      </button>

      {/* Panel du panier */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Contenu du panier */}
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg">
                  Mon Panier
                  {isProfessional && (
                    <span className="ml-2 text-sm font-normal text-primary">(Pro)</span>
                  )}
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenu */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ShoppingCart className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-lg font-medium">Votre panier est vide</p>
                  <p className="text-sm">Ajoutez des produits pour commencer</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => {
                    const displayPrice = isProfessional && professionalPrice && item.product.category === 'eggs'
                      ? professionalPrice
                      : item.product.price

                    return (
                      <div key={item.product.id} className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
                        {/* Image */}
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-900 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-primary font-bold">
                            {formatPrice(displayPrice)}
                            <span className="text-gray-500 font-normal text-xs">/{item.product.unit}</span>
                          </p>

                          {/* Quantité */}
                          <div className="flex items-center space-x-2 mt-1">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Total & Supprimer */}
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {formatPrice(displayPrice * item.quantity)}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer avec total */}
            {cart.length > 0 && (
              <div className="border-t p-4 bg-gray-50">
                {isProfessional && (
                  <p className="text-xs text-gray-500 mb-2">
                    * Prix professionnels appliqués (min. 10 plateaux)
                  </p>
                )}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>
                <Link
                  href="/panier"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-primary text-white text-center py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                >
                  Voir le panier complet
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
