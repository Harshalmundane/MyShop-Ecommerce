"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { Navbar } from "@/components/store/navbar"

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  })

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          totalAmount: subtotal,
          shippingAddress: address,
          paymentMethod: "cod",
        }),
      })

      if (res.ok) {
        toast({ title: "Order Placed!", description: "Your aesthetic selection is being prepared." })
        clearCart()
        router.push("/orders")
      } else {
        toast({ variant: "destructive", title: "Error", description: "Failed to place order" })
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong" })
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-serif italic">Your selection is empty</h1>
          <Button
            onClick={() => router.push("/products")}
            variant="outline"
            className="rounded-none border-zinc-950 uppercase tracking-widest"
          >
            Back to Collection
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={null} />
      <main className="container mx-auto max-w-4xl px-4 py-16">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8 p-0 hover:bg-transparent uppercase tracking-widest text-[10px] text-zinc-500 flex items-center gap-2"
        >
          <ArrowLeft className="size-3" /> Back to Selection
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h1 className="text-4xl font-serif italic">Delivery Information</h1>
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="street" className="uppercase text-[10px] tracking-widest font-bold">
                  Street Address
                </Label>
                <Input
                  id="street"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  required
                  className="rounded-none border-zinc-200 focus:ring-0 focus:border-zinc-950 h-12"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="uppercase text-[10px] tracking-widest font-bold">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    required
                    className="rounded-none border-zinc-200 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="uppercase text-[10px] tracking-widest font-bold">
                    State
                  </Label>
                  <Input
                    id="state"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    required
                    className="rounded-none border-zinc-200 h-12"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="uppercase text-[10px] tracking-widest font-bold">
                    Zip Code
                  </Label>
                  <Input
                    id="zipCode"
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    required
                    className="rounded-none border-zinc-200 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="uppercase text-[10px] tracking-widest font-bold">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    required
                    className="rounded-none border-zinc-200 h-12"
                  />
                </div>
              </div>

              <div className="p-6 bg-zinc-50 border border-zinc-100 flex items-center gap-4">
                <CheckCircle2 className="size-5 text-zinc-950" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">Cash on Delivery</p>
                  <p className="text-[10px] text-zinc-400 uppercase mt-1">Settle payment upon receiving your order.</p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-zinc-950 text-white h-14 uppercase tracking-[0.25em] text-xs hover:bg-zinc-800 transition-all"
              >
                {isLoading ? "Validating Selection..." : "Confirm Order"}
              </Button>
            </form>
          </div>

          <div className="space-y-8">
            <h2 className="text-xl font-medium uppercase tracking-tighter">Your Selection</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center text-sm uppercase tracking-widest"
                >
                  <span className="text-zinc-500">
                    {item.name} <span className="text-zinc-300 ml-2">x{item.quantity}</span>
                  </span>
                  <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-zinc-200 flex justify-between items-center text-lg font-bold">
                <span className="uppercase tracking-tighter">Total Due</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
