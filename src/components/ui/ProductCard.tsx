'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, ShoppingCart, Check } from 'lucide-react'
import type { Product } from '@/types'
import { useStore, formatPrice } from '@/store/useStore'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const addToCart = useStore((state) => state.addToCart)

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
      setQuantity(1)
    }, 2000)
  }

  const incrementQuantity = () => setQuantity((q) => Math.min(q + 1, 99))
  const decrementQuantity = () => setQuantity((q) => Math.max(q - 1, 1))

  return (
    <div className="card group overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Badge catégorie */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${product.category === 'eggs' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
            {product.category === 'eggs' ? 'Oeufs' : 'Viande'}
          </span>
        </div>
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-800 px-4 py-2 rounded-full font-medium">
              Indisponible
            </span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        {/* Prix */}
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-gray-500">/ {product.unit}</span>
        </div>

        {/* Sélecteur de quantité et bouton */}
        {product.isAvailable && (
          <div className="flex items-center gap-3 pt-2">
            {/* Quantité */}
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={decrementQuantity}
                className="p-2 hover:bg-gray-100 transition-colors"
                aria-label="Diminuer la quantité"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="p-2 hover:bg-gray-100 transition-colors"
                aria-label="Augmenter la quantité"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Bouton ajouter */}
            <button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                isAdded
                  ? 'bg-green-500 text-white'
                  : 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25 hover:shadow-xl'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Ajouté</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Ajouter</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
