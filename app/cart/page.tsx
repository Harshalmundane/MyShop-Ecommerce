"use client"

import Link from "next/link"
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { Navbar } from "@/components/store/navbar"

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart()
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={null} />
      <main className="container mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-serif italic mb-12">Your Selection</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-6 border border-dashed border-zinc-300">
            <ShoppingBag className="size-12 text-zinc-300" />
            <p className="text-zinc-500 uppercase tracking-widest text-sm">Your collection is empty</p>
            <Link href="/products">
              <Button
                variant="outline"
                className="rounded-none border-zinc-950 uppercase tracking-widest text-xs px-8 h-12 hover:bg-zinc-950 hover:text-white transition-all bg-transparent"
              >
                Discover Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-8">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-6 border-b border-zinc-200 pb-8 group">
                  <div className="size-32 bg-zinc-100 overflow-hidden border border-zinc-200 shrink-0">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="size-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{item.name}</h3>
                        <p className="text-zinc-500 text-sm font-semibold mt-1">${item.price.toFixed(2)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.productId)}
                        className="text-zinc-400 hover:text-red-600"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-zinc-200 h-10 px-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>
                      <p className="text-sm font-bold text-zinc-950 ml-auto">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <div className="bg-zinc-50 p-8 border border-zinc-200">
                <h2 className="text-xl font-medium mb-6 uppercase tracking-tighter">Order Summary</h2>
                <div className="space-y-4 text-sm uppercase tracking-widest text-zinc-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-zinc-900 font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold uppercase tracking-widest">Free</span>
                  </div>
                  <Separator className="bg-zinc-200" />
                  <div className="flex justify-between text-base font-bold text-zinc-900">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <Link href="/checkout">
                  <Button className="w-full mt-8 rounded-none bg-zinc-950 text-white h-14 uppercase tracking-[0.2em] text-xs hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                    Proceed to Checkout <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
              <p className="text-center text-[10px] text-zinc-400 uppercase tracking-widest">
                Complimentary worldwide shipping on all orders over $500
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
