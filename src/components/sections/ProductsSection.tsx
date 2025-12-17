'use client'

import Image from 'next/image'
import { useStore } from '@/store/useStore'
import ProductCard from '@/components/ui/ProductCard'

export default function ProductsSection() {
  const products = useStore((state) => state.products)

  return (
    <section id="produits" className="relative py-16 md:py-24 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/quails-bg.jpg"
          alt="Fond cailles"
          fill
          className="object-cover"
          sizes="100vw"
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium mb-4">
            Nos Produits
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Découvrez nos produits frais
          </h2>
          <p className="text-gray-600">
            Des oeufs et de la viande de caille de qualité supérieure,
            directement de notre ferme à votre table.
          </p>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
