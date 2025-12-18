'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function BulkOrderingSection() {
  return (
    <section className="bg-primary/90 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/professionnels"
          className="flex items-center justify-center gap-2 text-white hover:text-white/90 transition-colors"
        >
          <span className="text-sm font-medium">
            🥚 Professionnels : Commandez en gros à prix réduits
          </span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
