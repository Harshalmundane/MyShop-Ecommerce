import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import { Navbar } from "@/components/store/navbar"
import { ProductCard } from "@/components/store/product-card"

export default async function StorefrontPage() {
  const session = await getSession()
  const db = await getDatabase()
  const products = await db
    .collection("products")
    .find({ stock: { $gt: 0 } })
    .sort({ createdAt: -1 })
    .toArray()

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={session} />
      <main className="container mx-auto px-4 py-12">
        <header className="mb-16 text-center space-y-4">
          <h1 className="text-6xl font-serif italic tracking-tight text-zinc-900 md:text-8xl">
            Optimal organization <br /> meets exquisite design
          </h1>
          <p className="mx-auto max-w-2xl text-zinc-500 text-lg uppercase tracking-widest">
            Transform your closets into functional works of art with our custom solutions.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id.toString()} product={JSON.parse(JSON.stringify(product))} />
          ))}
        </div>
      </main>
    </div>
  )
}
