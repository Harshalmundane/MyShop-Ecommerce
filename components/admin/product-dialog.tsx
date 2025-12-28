"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Upload, X } from "lucide-react"

const categories = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Sports & Outdoors",
  "Books & Media",
  "Beauty & Health",
] as const

export function ProductDialog({ open, onOpenChange, product, onSuccess }) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [stock, setStock] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 2MB",
        })
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (product) {
      setName(product.name)
      setPrice(product.price.toString())
      setCategory(product.category)
      setStock(product.stock.toString())
      setDescription(product.description || "")
      setImage(product.image || "")
    } else {
      setName("")
      setPrice("")
      setCategory("")
      setStock("")
      setDescription("")
      setImage("")
    }
  }, [product, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      name,
      price: Number.parseFloat(price),
      category,
      stock: Number.parseInt(stock),
      description,
      image,
    }

    try {
      const url = product ? `/api/products/${product._id}` : "/api/products"
      const method = product ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast({ title: "Success", description: `Product ${product ? "updated" : "added"} successfully` })
        onSuccess()
      } else {
        toast({ variant: "destructive", title: "Error", description: "Failed to save product" })
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-zinc-200">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Product Image</Label>
              <div className="flex flex-col gap-4">
                {image ? (
                  <div className="relative aspect-video w-full rounded-md overflow-hidden border border-zinc-200 group">
                    <img src={image || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <X className="size-4 text-zinc-600" />
                    </button>
                  </div>
                ) : (
                  <Label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-zinc-300 rounded-md bg-zinc-50/50 hover:bg-zinc-100 hover:border-secondary transition-all cursor-pointer group"
                  >
                    <Upload className="size-8 text-zinc-400 group-hover:text-secondary mb-2" />
                    <span className="text-sm font-medium text-zinc-500 group-hover:text-secondary">
                      Click to upload from computer
                    </span>
                    <span className="text-xs text-zinc-400 mt-1">Recommended: Square image, max 2MB</span>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </Label>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-zinc-300 hover:bg-zinc-100"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-zinc-950 text-white hover:bg-zinc-800">
              {isSubmitting ? "Saving..." : "Save Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}