import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Hero from '@/components/sections/Hero'
import ProductsSection from '@/components/sections/ProductsSection'
import DeliverySection from '@/components/sections/DeliverySection'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ProductsSection />
      <DeliverySection />
      <Footer />
    </main>
  )
}
