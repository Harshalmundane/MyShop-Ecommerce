import Header from "@/components/landing/header"
import HeroSection from "@/components/landing/hero-section"
import FeaturedProducts from "@/components/landing/featured-products"
import Categories from "@/components/landing/categories"
import WhyChooseUs from "@/components/landing/why-choose-us"
import Testimonials from "@/components/landing/testimonials"
import Footer from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturedProducts />
      <Categories />
      <WhyChooseUs />
      <Testimonials />
      <Footer />
    </main>
  )
}
