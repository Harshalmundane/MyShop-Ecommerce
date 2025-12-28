"use client"

import Link from "next/link"
import { ShoppingCart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const total = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
    setCartCount(total)
  }

  useEffect(() => {
    updateCartCount() // Initial load

    // Listen for storage changes (across tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        updateCartCount()
      }
    }

    // Listen for same-tab updates from AddToCartButton
    const handleCartUpdated = () => {
      updateCartCount()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("cartUpdated", handleCartUpdated)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cartUpdated", handleCartUpdated)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">S</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">ShopHub</span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 cursor-pointer hover:text-primary transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="hidden sm:flex gap-2">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Login
                </Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}