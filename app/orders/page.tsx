"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/store/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle2, FileText, ChevronDown, ChevronUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { jsPDF } from "jspdf"
import { Separator } from "@/components/ui/separator"

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders")
        const data = await res.json()
        setOrders(data.orders || [])
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to fetch orders" })
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const generateInvoice = (order: any) => {
    const doc = new jsPDF()
    const margin = 20
    let y = 30

    // Header
    doc.setFontSize(22)
    doc.text("INVOICE", margin, y)
    y += 10
    doc.setFontSize(10)
    doc.text(`Order ID: #${order._id}`, margin, y)
    y += 5
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, margin, y)
    y += 15

    // Company Info
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("CLOSET CREATIONS", margin, y)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    y += 5
    doc.text("123 Aesthetic Blvd, Design City", margin, y)
    y += 15

    // Bill To
    doc.setFont("helvetica", "bold")
    doc.text("BILL TO:", margin, y)
    doc.setFont("helvetica", "normal")
    y += 5
    doc.text(order.customerName, margin, y)
    y += 5
    doc.text(order.shippingAddress.street, margin, y)
    y += 5
    doc.text(
      `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`,
      margin,
      y,
    )
    y += 20

    // Items Header
    doc.setFont("helvetica", "bold")
    doc.text("Item", margin, y)
    doc.text("Qty", 120, y)
    doc.text("Price", 140, y)
    doc.text("Total", 170, y)
    y += 5
    doc.line(margin, y, 190, y)
    y += 10

    // Items
    doc.setFont("helvetica", "normal")
    order.items.forEach((item: any) => {
      doc.text(item.name, margin, y)
      doc.text(item.quantity.toString(), 120, y)
      doc.text(`$${item.price.toFixed(2)}`, 140, y)
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 170, y)
      y += 8
    })

    y += 10
    doc.line(margin, y, 190, y)
    y += 10

    // Total
    doc.setFont("helvetica", "bold")
    doc.text("TOTAL AMOUNT", 120, y)
    doc.text(`$${order.totalAmount.toFixed(2)}`, 170, y)

    doc.save(`invoice-${order._id.substring(order._id.length - 6)}.pdf`)
  }

  const getStatusStep = (status: string) => {
    const steps = ["pending", "confirmed", "shipped", "delivered"]
    return steps.indexOf(status)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={null} />
      <main className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-serif italic mb-12">Order History</h1>

        {isLoading ? (
          <div className="text-center py-24 text-zinc-400 uppercase tracking-widest text-sm">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-zinc-200">
            <p className="text-zinc-500 uppercase tracking-widest text-sm mb-4">You haven't placed any orders yet</p>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/products")}
              className="rounded-none border-zinc-950 uppercase tracking-widest text-xs"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <Card key={order._id} className="rounded-none border-zinc-200 overflow-hidden shadow-none">
                <CardHeader
                  className="bg-zinc-50/50 cursor-pointer"
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-mono uppercase tracking-tight text-zinc-500">
                          Order #{order._id.substring(order._id.length - 8)}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={`capitalize text-[10px] tracking-widest rounded-none border-zinc-200 ${
                            order.status === "delivered" ? "bg-green-50 text-green-700" : ""
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-bold">${order.totalAmount.toFixed(2)}</p>
                      {expandedOrder === order._id ? (
                        <ChevronUp className="size-4 text-zinc-400" />
                      ) : (
                        <ChevronDown className="size-4 text-zinc-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                {expandedOrder === order._id && (
                  <CardContent className="pt-8 pb-12 px-8 space-y-12">
                    {/* Progress Tracker */}
                    <div className="relative">
                      <div className="absolute top-5 left-0 w-full h-px bg-zinc-200" />
                      <div className="relative flex justify-between">
                        {[
                          { label: "Pending", icon: Package },
                          { label: "Confirmed", icon: CheckCircle2 },
                          { label: "Shipped", icon: Truck },
                          { label: "Delivered", icon: CheckCircle2 },
                        ].map((step, idx) => {
                          const isCompleted = getStatusStep(order.status) >= idx
                          const Icon = step.icon
                          return (
                            <div key={step.label} className="flex flex-col items-center gap-3">
                              <div
                                className={`relative z-10 flex size-10 items-center justify-center rounded-full border bg-background transition-colors ${
                                  isCompleted ? "border-zinc-950 text-zinc-950" : "border-zinc-200 text-zinc-200"
                                }`}
                              >
                                <Icon className="size-5" />
                              </div>
                              <span
                                className={`text-[10px] uppercase tracking-[0.2em] font-bold ${
                                  isCompleted ? "text-zinc-950" : "text-zinc-300"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <Separator className="bg-zinc-100" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">Order Items</h3>
                        <div className="space-y-4">
                          {order.items.map((item: any) => (
                            <div key={item.productId} className="flex justify-between items-center text-sm">
                              <span className="text-zinc-600">
                                {item.name} <span className="text-zinc-300 ml-2">x{item.quantity}</span>
                              </span>
                              <span className="font-bold text-zinc-950 tracking-tight">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
                          Shipping Details
                        </h3>
                        <div className="text-sm space-y-1 text-zinc-600">
                          <p>{order.customerName}</p>
                          <p>{order.shippingAddress.street}</p>
                          <p>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                          </p>
                          <p className="mt-4 font-mono text-[10px] uppercase">{order.shippingAddress.phone}</p>
                        </div>
                      </div>
                    </div>

                    {order.status === "delivered" && (
                      <div className="flex justify-end pt-4">
                        <Button
                          onClick={() => generateInvoice(order)}
                          className="rounded-none bg-zinc-950 text-white hover:bg-zinc-800 transition-all uppercase tracking-widest text-[10px] px-8 h-12 flex items-center gap-2"
                        >
                          <FileText className="size-4" /> Download Invoice (PDF)
                        </Button>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
