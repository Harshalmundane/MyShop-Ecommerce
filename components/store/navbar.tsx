"use client"

import Link from "next/link"
import { ShoppingBag, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"

export function Navbar({ user }) {
  const { items } = useCart()
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/products" className="text-2xl font-bold tracking-tighter uppercase">
          Closet<span className="text-zinc-400">Creations</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/products"
            className="text-sm font-medium hover:text-zinc-500 transition-colors uppercase tracking-widest"
          >
            Collection
          </Link>
          <Link
            href="/orders"
            className="text-sm font-medium hover:text-zinc-500 transition-colors uppercase tracking-widest"
          >
            My Orders
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="size-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-tight hidden sm:inline-block">{user.name}</span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="size-5" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <User className="size-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
