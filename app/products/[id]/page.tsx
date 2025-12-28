import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/store/navbar"
import { ChevronLeft, ShieldCheck, Truck, RefreshCw } from "lucide-react"
import Link from "next/link"
import { AddToCartButton } from "@/components/store/add-to-cart-button"

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const db = await getDatabase()
  let product

  try {
    product = await db.collection("products").findOne({ _id: new ObjectId(params.id) })
  } catch (e) {
    notFound()
  }

  if (!product) notFound()

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-24">
        <Link
          href="/products"
          className="inline-flex items-center text-sm text-zinc-500 hover:text-primary mb-8 transition-colors"
        >
          <ChevronLeft className="mr-1 size-4" /> Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Image Gallery */}
          <div className="aspect-[4/5] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
            <img
              src={product.image || "/placeholder.svg?height=1000&width=800&query=luxury-product"}
              alt={product.name}
              className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-10">
            <div className="space-y-4">
              <p className="text-secondary font-medium tracking-[0.2em] uppercase text-xs">{product.category}</p>
              <h1 className="text-5xl font-serif tracking-tight leading-tight">{product.name}</h1>
              <p className="text-3xl font-light text-zinc-900">
                {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

            <p className="text-zinc-600 leading-relaxed text-lg font-light">
              {product.description ||
                "This meticulously crafted piece represents the pinnacle of luxury and design. Every detail has been considered to ensure an unparalleled experience for the discerning individual."}
            </p>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                <AddToCartButton
                  product={JSON.parse(JSON.stringify(product))}
                  className="flex-1 h-16 text-lg rounded-full"
                />
              </div>
              <p className="text-sm text-zinc-500 text-center font-light">
                {product.stock > 0 ? `In Stock: ${product.stock} units available` : "Currently Out of Stock"}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-zinc-100">
              <div className="flex flex-col items-center text-center space-y-2">
                <Truck className="size-5 text-zinc-400" />
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                  Express Shipping
                </span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <ShieldCheck className="size-5 text-zinc-400" />
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                  2-Year Warranty
                </span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <RefreshCw className="size-5 text-zinc-400" />
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                  30-Day Returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
