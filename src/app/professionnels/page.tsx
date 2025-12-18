'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShoppingCart,
  Menu,
  X,
  Phone,
  ArrowLeft,
  Store,
  UtensilsCrossed,
  Calendar,
  Users,
  Plus,
  Minus,
  Check,
  MapPin,
  Clock,
  Truck,
  MessageCircle
} from 'lucide-react'
import { useStore, formatPrice } from '@/store/useStore'
import type { Product, ProfessionalCategory } from '@/types'
import FloatingCart from '@/components/ui/FloatingCart'

// Icônes pour les catégories
const categoryIcons = {
  restaurants: UtensilsCrossed,
  supermarches: Store,
  evenements: Calendar,
  revendeurs: Users,
}

export default function ProfessionnelsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProfessionalCategory>('restaurants')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const products = useStore((state) => state.products)
  const zones = useStore((state) => state.zones)
  const professionalPricing = useStore((state) => state.professionalPricing)
  const getCartItemsCount = useStore((state) => state.getCartItemsCount)

  const itemsCount = getCartItemsCount()
  const activeZones = zones.filter((zone) => zone.isActive)
  const currentPricing = professionalPricing.find(p => p.id === selectedCategory)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Professionnel */}
      <header className="bg-primary text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo & Retour */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Retour</span>
              </Link>
              <div className="h-8 w-px bg-white/30" />
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative w-10 h-10 md:w-12 md:h-12">
                  <Image
                    src="/images/logo.svg"
                    alt="Mahutin Ferme Logo"
                    fill
                    className="object-contain brightness-0 invert"
                    priority
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold">Mahutin Ferme</h1>
                  <p className="text-xs text-white/80">Espace Professionnel</p>
                </div>
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <a
                href="https://wa.me/message/4XXFMW6USOKRK1"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="font-medium">WhatsApp</span>
              </a>

              <Link
                href="/panier"
                className="relative p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {itemsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section Professionnel */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Tarifs Professionnels
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Bénéficiez de prix réduits pour vos commandes en gros.
            <br />
            <strong>Minimum 10 plateaux</strong> pour profiter de ces tarifs.
          </p>

          {/* Sélecteur de catégorie */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {professionalPricing.filter(p => p.isActive).map((pricing) => {
              const IconComponent = categoryIcons[pricing.id]
              const isSelected = selectedCategory === pricing.id

              return (
                <button
                  key={pricing.id}
                  onClick={() => setSelectedCategory(pricing.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isSelected
                      ? 'bg-white text-primary shadow-lg scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{pricing.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Info catégorie sélectionnée */}
      {currentPricing && (
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h2 className="text-xl font-bold text-gray-900">
                  Tarif {currentPricing.name}
                </h2>
                <p className="text-gray-600">{currentPricing.description}</p>
              </div>
              <div className="flex items-center space-x-6">
                {currentPricing.pricePerTray ? (
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">
                      {formatPrice(currentPricing.pricePerTray)}
                    </p>
                    <p className="text-sm text-gray-500">par plateau d&apos;œufs</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">Sur devis</p>
                    <p className="text-sm text-gray-500">Contactez-nous</p>
                  </div>
                )}
                <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPricing.hasBranding
                    ? 'bg-primary/10 text-primary'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {currentPricing.hasBranding ? 'Avec plateau' : 'Sans plateau'}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section Produits */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium mb-4">
              Nos Produits
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Commandez en gros
            </h2>
            <p className="text-gray-600">
              Minimum <strong>10 plateaux</strong> pour bénéficier des tarifs professionnels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {products.map((product) => (
              <ProfessionalProductCard
                key={product.id}
                product={product}
                professionalPrice={currentPricing?.pricePerTray || null}
                minQuantity={currentPricing?.minQuantity || 10}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section Livraison */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium mb-4">
              Livraison
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Zones de livraison
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {activeZones.map((zone) => (
              <div
                key={zone.id}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{zone.name}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Truck className="w-4 h-4" />
                      <span className="text-sm">Frais de livraison</span>
                    </div>
                    <span className="font-bold text-primary">{formatPrice(zone.price)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Délai</span>
                    </div>
                    <span className="text-sm font-medium">{zone.estimatedTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA WhatsApp */}
      <section className="py-12 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Des questions ou un devis personnalisé ?
          </h2>
          <p className="text-white/90 mb-6">
            Contactez-nous directement sur WhatsApp pour discuter de vos besoins
          </p>
          <a
            href="https://wa.me/message/4XXFMW6USOKRK1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-white text-green-700 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Contactez-nous sur WhatsApp
          </a>
        </div>
      </section>

      {/* Footer simplifié */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Mahutin Ferme Agro-Pastorale. Tous droits réservés.
          </p>
          <Link href="/" className="text-primary hover:underline mt-2 inline-block">
            Retour au site principal
          </Link>
        </div>
      </footer>

      {/* Panier flottant */}
      <FloatingCart isProfessional={true} professionalCategory={selectedCategory} />
    </main>
  )
}

// Composant ProductCard pour les professionnels
function ProfessionalProductCard({
  product,
  professionalPrice,
  minQuantity,
}: {
  product: Product
  professionalPrice: number | null
  minQuantity: number
}) {
  const [quantity, setQuantity] = useState(minQuantity)
  const [isAdded, setIsAdded] = useState(false)
  const addToCart = useStore((state) => state.addToCart)

  // Prix affiché : professionnel pour les œufs, réduction % pour la viande
  let displayPrice = product.price
  let hasDiscount = false

  if (product.category === 'eggs' && professionalPrice) {
    // Pour les œufs, utiliser le prix pro par plateau
    displayPrice = professionalPrice
    hasDiscount = professionalPrice < product.price
  } else if (product.category === 'meat' && product.professionalDiscount && product.professionalDiscount > 0) {
    // Pour la viande, appliquer la réduction en %
    displayPrice = Math.round(product.price * (1 - product.professionalDiscount / 100))
    hasDiscount = true
  }

  const originalPrice = product.price

  const handleAddToCart = () => {
    if (quantity < minQuantity) {
      alert(`Minimum ${minQuantity} ${product.unit}s requis`)
      return
    }
    addToCart(product, quantity)
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  const incrementQuantity = () => setQuantity((q) => q + 1)
  const decrementQuantity = () => setQuantity((q) => Math.max(q - 1, minQuantity))

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group">
      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Badge catégorie */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            product.category === 'eggs' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.category === 'eggs' ? 'Oeufs' : 'Viande'}
          </span>
        </div>
        {/* Badge réduction */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
            -{product.category === 'meat' && product.professionalDiscount
              ? product.professionalDiscount
              : Math.round((1 - professionalPrice! / originalPrice) * 100)}%
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

        {/* Prix */}
        <div className="flex items-baseline space-x-2 mb-4">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(displayPrice)}
          </span>
          <span className="text-sm text-gray-500">/ {product.unit}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Quantité minimum */}
        <p className="text-xs text-gray-500 mb-3">
          Minimum: {minQuantity} {product.unit}s
        </p>

        {/* Sélecteur de quantité */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
            <button
              onClick={decrementQuantity}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              isAdded
                ? 'bg-green-500 text-white'
                : 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25'
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

        {/* Total */}
        <div className="mt-4 pt-4 border-t flex justify-between items-center">
          <span className="text-gray-600">Total</span>
          <span className="text-xl font-bold text-primary">
            {formatPrice(displayPrice * quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}
