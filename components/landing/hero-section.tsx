import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative min-h-[600px] flex items-center bg-gradient-to-b from-primary/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance leading-tight">
              Your Premium Shopping Destination
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Discover an exceptional collection of quality products curated just for you. Shop with confidence, fast
              delivery, and unbeatable prices.
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="/products">
                <Button size="lg" className="text-base">
                  Shop Now
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="text-base bg-transparent">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-96 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl"></div>
            <div className="relative h-full bg-muted rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary/20 mb-4">✨</div>
                <p className="text-muted-foreground">Your products showcase here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
