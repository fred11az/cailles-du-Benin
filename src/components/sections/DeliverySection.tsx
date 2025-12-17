'use client'

import Image from 'next/image'
import { MapPin, Clock, Truck } from 'lucide-react'
import { useStore, formatPrice } from '@/store/useStore'

export default function DeliverySection() {
  const zones = useStore((state) => state.zones)
  const activeZones = zones.filter((zone) => zone.isActive)

  return (
    <section id="livraison" className="relative py-16 md:py-24 overflow-hidden">
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
            Livraison
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Zones de livraison
          </h2>
          <p className="text-gray-600">
            Nous livrons dans plusieurs zones du Bénin. Les frais varient selon votre localisation.
          </p>
        </div>

        {/* Grille des zones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {activeZones.map((zone) => (
            <div
              key={zone.id}
              className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{zone.name}</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Truck className="w-4 h-4" />
                    <span className="text-sm">Frais de livraison</span>
                  </div>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(zone.price)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Délai estimé</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {zone.estimatedTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            Votre zone n&apos;est pas listée ?{' '}
            <a href="tel:+22900000000" className="text-primary font-medium hover:underline">
              Contactez-nous
            </a>{' '}
            pour un devis personnalisé.
          </p>
        </div>
      </div>
    </section>
  )
}
