'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Truck, Shield, Leaf } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Background image - full section */}
      <div className="absolute inset-0">
        <Image
          src="/images/quails-bg.jpg"
          alt="Cailles de Mahutin Ferme"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="max-w-2xl">
          {/* Texte */}
          <div className="space-y-6 md:space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30">
              <Leaf className="w-4 h-4" />
              <span>100% Naturel & Frais</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
              Des cailles{' '}
              <span className="text-green-400">fraîches</span>{' '}
              de notre ferme à votre table
            </h1>

            <p className="text-lg md:text-xl text-white/90 max-w-lg drop-shadow-md">
              Découvrez nos oeufs et viande de caille de qualité supérieure,
              élevés naturellement dans notre ferme au Bénin.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/#produits" className="btn-primary inline-flex items-center justify-center space-x-2">
                <span>Voir nos produits</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://wa.me/message/4XXFMW6USOKRK1"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600/90 backdrop-blur-sm border-2 border-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:bg-green-500 inline-flex items-center justify-center"
              >
                Commander sur WhatsApp
              </a>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/30">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-white">Livraison rapide</p>
                <p className="text-xs text-white/70">Dans tout le Bénin</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-white">Qualité garantie</p>
                <p className="text-xs text-white/70">Produits frais</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-white">100% Naturel</p>
                <p className="text-xs text-white/70">Sans additifs</p>
              </div>
            </div>
          </div>

          {/* Badges flottants */}
          <div className="hidden lg:block absolute top-1/4 right-10 bg-white rounded-2xl shadow-xl p-4">
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

          <div className="hidden lg:block absolute bottom-1/4 right-20 bg-primary text-white rounded-2xl shadow-xl p-4">
            <p className="text-sm font-medium">À partir de</p>
            <p className="text-2xl font-bold">1000 FCFA</p>
          </div>
        </div>
      </div>
    </section>
  )
}
