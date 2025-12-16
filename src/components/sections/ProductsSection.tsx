'use client'

import { useStore } from '@/store/useStore'
import ProductCard from '@/components/ui/ProductCard'

export default function ProductsSection() {
  const products = useStore((state) => state.products)

  return (
    <section id="produits" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Bannière info */}
        <div className="mt-12 md:mt-16 bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 md:p-8 text-white text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Commandes en gros disponibles
          </h3>
          <p className="text-white/90 mb-4">
            Pour les restaurants, hôtels et événements, contactez-nous pour des prix spéciaux.
          </p>
          <a
            href="tel:+22900000000"
            className="inline-flex items-center justify-center bg-white text-primary font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Contactez-nous
          </a>
        </div>
      </div>
    </section>
  )
}
