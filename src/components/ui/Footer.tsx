'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* À propos */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-14 h-14 flex-shrink-0">
                <Image
                  src="/images/logo.svg"
                  alt="Mahutin Ferme Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">Mahutin Ferme</h3>
                <p className="text-xs text-primary">Agro-Pastorale</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Votre ferme d&apos;élevage de cailles au Bénin. Nous vous proposons des oeufs et de la viande de caille de qualité supérieure.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/#produits" className="text-gray-400 hover:text-primary transition-colors">
                  Nos produits
                </Link>
              </li>
              <li>
                <Link href="/panier" className="text-gray-400 hover:text-primary transition-colors">
                  Mon panier
                </Link>
              </li>
              <li>
                <Link href="/#livraison" className="text-gray-400 hover:text-primary transition-colors">
                  Zones de livraison
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MessageCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <a
                    href="https://wa.me/message/4XXFMW6USOKRK1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-500 transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a href="mailto:fermemahutin@gmail.com" className="text-gray-400 hover:text-primary transition-colors">
                  fermemahutin@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a href="tel:+2290198713324" className="text-gray-400 hover:text-primary transition-colors">
                  +229 01 98 71 33 24
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Abomey-Calavi, Houeto Pylônes<br />
                  à 200m du carrefour, Bénin
                </span>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Suivez-nous</h4>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/message/4XXFMW6USOKRK1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Horaires : Lun - Sam, 8h - 18h
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Mahutin Ferme - Cailles du Bénin. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
