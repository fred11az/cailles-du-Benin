import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import FloatingCart from '@/components/ui/FloatingCart'
import Hero from '@/components/sections/Hero'
import ProductsSection from '@/components/sections/ProductsSection'
import BulkOrderingSection from '@/components/sections/BulkOrderingSection'
import DeliverySection from '@/components/sections/DeliverySection'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <BulkOrderingSection />
      <Hero />
      <ProductsSection />
      <DeliverySection />
      <Footer />
      <FloatingCart />
    </main>
  )
}
