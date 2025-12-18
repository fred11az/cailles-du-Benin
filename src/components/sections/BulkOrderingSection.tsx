'use client'

import Link from 'next/link'
import { ArrowRight, Percent } from 'lucide-react'

export default function BulkOrderingSection() {
  return (
    <section id="professionnels" className="relative py-12 md:py-16 bg-gradient-to-r from-primary to-primary-dark overflow-hidden">
      {/* Motif de fond */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Texte */}
          <div className="flex items-center space-x-4 text-center md:text-left">
            <div className="hidden sm:flex w-14 h-14 bg-white/20 rounded-full items-center justify-center flex-shrink-0">
              <Percent className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Commandes en gros disponibles
              </h2>
              <p className="text-white/90 mt-1">
                Restaurants, supermarchés, événements, revendeurs
              </p>
            </div>
          </div>

          {/* Bouton CTA */}
          <Link
            href="/professionnels"
            className="inline-flex items-center justify-center bg-white text-primary font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-center"
          >
            <span className="hidden sm:inline">Cliquez ici pour commander en gros et avoir des prix réduits</span>
            <span className="sm:hidden">Commander en gros</span>
            <ArrowRight className="w-5 h-5 ml-2 flex-shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  )
}
