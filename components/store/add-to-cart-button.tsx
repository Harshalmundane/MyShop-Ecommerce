"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { ShoppingBag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddToCartButtonProps {
  product: any
  className?: string
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const cart = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    cart.addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    toast({
      title: "Added to Bag",
      description: `${product.name} has been added to your shopping bag.`,
    })
  }

  return (
    <Button onClick={handleAddToCart} className={className}>
      <ShoppingBag className="mr-2 size-5" /> Add to Bag
    </Button>
  )
}
