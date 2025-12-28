import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  { name: "Electronics", icon: "⚡", count: 2543 },
  { name: "Fashion", icon: "👔", count: 5821 },
  { name: "Home & Garden", icon: "🏠", count: 3401 },
  { name: "Sports & Outdoors", icon: "⛹️", count: 2124 },
  { name: "Books & Media", icon: "📚", count: 1890 },
  { name: "Beauty & Health", icon: "💄", count: 2756 },
]

export default function Categories() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Shop by Category</h2>
          <p className="text-lg text-muted-foreground">Browse our wide selection of carefully curated categories</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.name} href={`/products?category=${category.name.toLowerCase()}`}>
              <Card className="cursor-pointer hover:shadow-lg hover:border-primary transition-all h-full">
                <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count.toLocaleString()} items</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
