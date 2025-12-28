"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ProductDialog } from "@/components/admin/product-dialog"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { toast } = useToast()

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch products" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast({ title: "Success", description: "Product deleted successfully" })
        fetchProducts()
      } else {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete product" })
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong" })
    }
  }

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button
          onClick={() => {
            setSelectedProduct(null)
            setIsDialogOpen(true)
          }}
          className="bg-zinc-950 text-white hover:bg-zinc-800"
        >
          <Plus className="mr-2 size-4" /> Add Product
        </Button>
      </div>

      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Manage your store's products and stock levels</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-zinc-500" />
              <Input
                placeholder="Search products..."
                className="pl-9 border-zinc-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow>
                <TableHead className="w-[80px] p-4">Image</TableHead>
                <TableHead className="w-[250px] p-4">Name</TableHead>
                <TableHead className="w-[120px] p-4">Category</TableHead>
                <TableHead className="w-[100px] p-4">Price</TableHead>
                <TableHead className="w-[100px] p-4">Stock</TableHead>
                <TableHead className="w-[120px] text-right p-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product._id} className="group hover:bg-zinc-50/80">
                    <TableCell className="p-4">
                      <div className="size-10 rounded-md bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200">
                        {product.image ? (
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <Package className="size-5 text-zinc-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="p-4 font-medium text-zinc-900">{product.name}</TableCell>
                    <TableCell className="p-4 text-zinc-600">{product.category}</TableCell>
                    <TableCell className="p-4 text-zinc-900 font-semibold">{product.price.toFixed(2)}</TableCell>
                    <TableCell className="p-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          product.stock > 10
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : product.stock > 0
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                    </TableCell>
                    <TableCell className="text-right p-4">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product)
                            setIsDialogOpen(true)
                          }}
                          className="h-8 px-2 hover:bg-zinc-200"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product._id)}
                          className="h-8 px-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
        onSuccess={() => {
          fetchProducts()
          setIsDialogOpen(false)
        }}
      />
    </div>
  )
}