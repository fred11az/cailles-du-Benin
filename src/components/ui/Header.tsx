'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ShoppingCart, Menu, X, Phone } from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const cart = useStore((state) => state.cart)
  const getCartItemsCount = useStore((state) => state.getCartItemsCount)

  const itemsCount = getCartItemsCount()

  return (
    <header className="bg-white/30 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-12 h-12 md:w-16 md:h-16">
              <Image
                src="/images/logo.svg"
                alt="Mahutin Ferme Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-gray-800 drop-shadow-sm">Mahutin Ferme</h1>
              <p className="text-xs text-primary font-medium drop-shadow-sm">Agro-Pastorale</p>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Accueil
            </Link>
            <Link href="/#produits" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Produits
            </Link>
            <Link href="/#contact" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* WhatsApp */}
            <a
              href="https://wa.me/message/4XXFMW6USOKRK1"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">WhatsApp</span>
            </a>

            {/* Panier */}
            <Link
              href="/panier"
              className="relative p-2 text-gray-700 hover:text-primary transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce-subtle">
                  {itemsCount}
                </span>
              )}
            </Link>

            {/* Menu Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/80 backdrop-blur-sm border-t border-white/50">
          <nav className="px-4 py-4 space-y-4">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Accueil
            </Link>
            <Link
              href="/#produits"
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Produits
            </Link>
            <Link
              href="/#contact"
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Contact
            </Link>
            <a
              href="https://wa.me/message/4XXFMW6USOKRK1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-green-600 font-medium pt-4 border-t"
            >
              <Phone className="w-5 h-5" />
              <span>Commander sur WhatsApp</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
