"use client"

import { useState, useEffect } from "react"
import { Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const statusColors = {
  pending: "bg-zinc-100 text-zinc-700 border-zinc-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-amber-50 text-amber-700 border-amber-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders")
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch orders" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        toast({ title: "Success", description: "Order status updated" })
        fetchOrders()
      } else {
        toast({ variant: "destructive", title: "Error", description: "Failed to update status" })
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong" })
    }
  }

  const filteredOrders = orders.filter(
    (o) =>
      o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>

      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>View and manage customer orders and fulfillment</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-zinc-500" />
              <Input
                placeholder="Search orders or customers..."
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
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order._id} className="group hover:bg-zinc-50/80">
                    <TableCell className="font-mono text-xs text-zinc-600">#{order._id.substring(18)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-900">{order.customerName}</span>
                        <span className="text-xs text-zinc-500">{order.customerEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-600 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-zinc-900 font-semibold">${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Select value={order.status} onValueChange={(val) => updateStatus(order._id, val)}>
                        <SelectTrigger className={`w-[130px] h-8 text-xs ${statusColors[order.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="hover:bg-zinc-200">
                        <Eye className="mr-2 size-4" /> View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
