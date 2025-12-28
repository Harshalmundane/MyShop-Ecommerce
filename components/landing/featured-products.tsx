import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Star } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  image: string
  category: string
}

const featured: Product[] = [
  {
    id: "1",
    name: "Premium Headphones",
    price: 199,
    originalPrice: 299,
    rating: 5,
    image: "product-1",
    category: "Electronics",
  },
  {
    id: "2",
    name: "Wireless Watch",
    price: 149,
    rating: 4.5,
    image: "product-2",
    category: "Accessories",
  },
  {
    id: "3",
    name: "Smart Speaker",
    price: 129,
    originalPrice: 179,
    rating: 4,
    image: "product-3",
    category: "Electronics",
  },
  {
    id: "4",
    name: "Phone Case Pro",
    price: 49,
    rating: 5,
    image: "product-4",
    category: "Accessories",
  },
]

export default function FeaturedProducts() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Featured Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked selection of our best-selling items. Quality guaranteed, fast shipping included.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="relative mb-4 h-48 bg-muted rounded-lg flex items-center justify-center overflow-hidden group">
                  <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    <div className="text-4xl">📦</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-foreground">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <Button className="w-full gap-2 mt-4">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
