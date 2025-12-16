'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Truck, Shield, Leaf } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-green-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texte */}
          <div className="text-center lg:text-left space-y-6 md:space-y-8">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Leaf className="w-4 h-4" />
              <span>100% Naturel & Frais</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Des cailles{' '}
              <span className="text-primary">fraîches</span>{' '}
              de notre ferme à votre table
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
              Découvrez nos oeufs et viande de caille de qualité supérieure,
              élevés naturellement dans notre ferme au Bénin.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/#produits" className="btn-primary inline-flex items-center justify-center space-x-2">
                <span>Voir nos produits</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="tel:+22900000000" className="btn-secondary inline-flex items-center justify-center">
                Commander par téléphone
              </a>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-gray-900">Livraison rapide</p>
                <p className="text-xs text-gray-500">Dans tout le Bénin</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-gray-900">Qualité garantie</p>
                <p className="text-xs text-gray-500">Produits frais</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-gray-900">100% Naturel</p>
                <p className="text-xs text-gray-500">Sans additifs</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Cercle décoratif */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full" />

              {/* Image principale */}
              <div className="absolute inset-4 rounded-full overflow-hidden shadow-2xl shadow-primary/20">
                <Image
                  src="https://images.unsplash.com/photo-1569127959161-2b1297b2d9a6?w=800&q=80"
                  alt="Oeufs de caille frais de Mahutin Ferme"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Badge flottant */}
              <div className="absolute -bottom-2 -left-2 md:bottom-4 md:left-0 bg-white rounded-2xl shadow-xl p-4 animate-fade-in">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">+</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">500+</p>
                    <p className="text-sm text-gray-500">Clients satisfaits</p>
                  </div>
                </div>
              </div>

              {/* Badge prix */}
              <div className="absolute -top-2 -right-2 md:top-4 md:right-0 bg-primary text-white rounded-2xl shadow-xl p-4 animate-fade-in">
                <p className="text-sm font-medium">À partir de</p>
                <p className="text-2xl font-bold">2500 FCFA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
