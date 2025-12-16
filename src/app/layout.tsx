import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cailledubenin.com'),
  title: {
    default: 'Mahutin Ferme | Cailles du Bénin - Oeufs et Viande de Caille Frais',
    template: '%s | Mahutin Ferme - Cailles du Bénin',
  },
  description: 'Mahutin Ferme, votre ferme d\'élevage de cailles au Bénin. Achetez des oeufs de caille frais et de la viande de caille de qualité. Livraison à Cotonou, Calavi, Porto-Novo et dans tout le Bénin.',
  keywords: [
    'caille',
    'cailles',
    'Bénin',
    'oeufs de caille',
    'viande de caille',
    'ferme',
    'élevage',
    'Cotonou',
    'Calavi',
    'Porto-Novo',
    'livraison',
    'Mahutin Ferme',
    'produits fermiers',
    'alimentation saine',
  ],
  authors: [{ name: 'Mahutin Ferme' }],
  creator: 'Mahutin Ferme',
  publisher: 'Mahutin Ferme',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_BJ',
    url: 'https://cailledubenin.com',
    siteName: 'Mahutin Ferme - Cailles du Bénin',
    title: 'Mahutin Ferme | Oeufs et Viande de Caille Frais au Bénin',
    description: 'Découvrez nos produits de caille frais : oeufs et viande de qualité. Livraison rapide à Cotonou, Calavi et Porto-Novo.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mahutin Ferme - Oeufs et Viande de Caille',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mahutin Ferme | Cailles du Bénin',
    description: 'Oeufs et viande de caille frais. Livraison au Bénin.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'votre-code-verification-google',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#22C55E" />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
