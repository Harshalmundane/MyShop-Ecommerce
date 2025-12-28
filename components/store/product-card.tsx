"use client"

import type React from "react"

import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

export function ProductCard({ product }) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
    toast({ title: "Added to Bag", description: `${product.name} has been added.` })
  }

  return (
    <div className="group relative flex flex-col space-y-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href={`/products/${product._id}`} className="block">
        <div className="aspect-[4/5] overflow-hidden bg-zinc-100 border border-zinc-100/50 relative">
          <img
            src={product.image || "/placeholder.svg?height=500&width=400&query=luxury-item"}
            alt={product.name}
            className="size-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        </div>
        <div className="mt-6 flex flex-col space-y-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-secondary font-semibold">
            {product.category}
          </span>
          <h3 className="text-xl font-serif text-zinc-900 group-hover:text-secondary transition-colors">
            {product.name}
          </h3>
          <p className="text-zinc-500 font-light text-lg">
            ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </Link>
      <Button
        onClick={handleAddToCart}
        className="absolute bottom-4 right-4 h-14 w-14 rounded-full bg-zinc-950 p-0 text-white shadow-2xl translate-y-20 opacity-0 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) group-hover:translate-y-0 group-hover:opacity-100 hover:bg-secondary hover:text-white"
      >
        <Plus className="size-6" />
      </Button>
    </div>
  )
}
