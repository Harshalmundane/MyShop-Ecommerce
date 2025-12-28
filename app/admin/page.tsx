import { getSession } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Package, ShoppingCart, Users, DollarSign, Plus, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    redirect("/login")
  }

  const db = await getDatabase()

  const productsCount = await db.collection("products").countDocuments()
  const ordersCount = await db.collection("orders").countDocuments()
  const recentOrders = await db.collection("orders").find({}).sort({ createdAt: -1 }).limit(5).toArray()

  // Calculate total revenue from orders
  const orders = await db.collection("orders").find({}).toArray()
  const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0)

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif tracking-tight text-zinc-900">Dashboard Overview</h1>
          <p className="text-zinc-500">Welcome back. Here's what's happening with your store today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-10 border-zinc-200 bg-transparent" asChild>
            <Link href="/admin/orders">View Orders</Link>
          </Button>
          <Button className="h-10 bg-zinc-900 text-white hover:bg-zinc-800" asChild>
            <Link href="/admin/products" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-zinc-200 shadow-sm overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-500 flex items-center">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 shadow-sm overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif">{ordersCount}</div>
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-500">+8.2%</span> from last week
            </p>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 shadow-sm overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Products</CardTitle>
            <Package className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif">{productsCount}</div>
            <p className="text-xs text-zinc-400 mt-1">Live in storefront</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 shadow-sm overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Active Users</CardTitle>
            <Users className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif">1,248</div>
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-500">+18%</span> since yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Orders List */}
        <Card className="lg:col-span-4 border-zinc-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif">Recent Orders</CardTitle>
              <CardDescription>You have {recentOrders.length} orders pending review.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900" asChild>
              <Link href="/admin/orders" className="flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div
                    key={order._id.toString()}
                    className="flex items-center justify-between border-b border-zinc-100 pb-4 last:border-0 last:pb-0 group"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-zinc-900 leading-none group-hover:underline cursor-pointer">
                        Order #{order._id.toString().slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {order.customerName} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-serif text-zinc-900">${order.total?.toFixed(2)}</p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                          order.status === "delivered"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : order.status === "processing"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="h-10 w-10 text-zinc-200 mb-4" />
                  <p className="text-zinc-500 font-medium">No recent orders found</p>
                  <p className="text-zinc-400 text-sm">Once customers start buying, they'll appear here.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Analytics Preview */}
        <Card className="lg:col-span-3 border-zinc-200 shadow-sm bg-zinc-900 text-white">
          <CardHeader>
            <CardTitle className="font-serif text-white">System Health</CardTitle>
            <CardDescription className="text-zinc-400">Database and API performance metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium uppercase tracking-widest text-zinc-500">
                <span>Database Load</span>
                <span>24%</span>
              </div>
              <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[24%] transition-all duration-1000" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium uppercase tracking-widest text-zinc-500">
                <span>API Latency</span>
                <span>42ms</span>
              </div>
              <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-400 w-[15%] transition-all duration-1000" />
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-800">
              <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-12 border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white transition-all text-xs uppercase tracking-widest"
                  asChild
                >
                  <Link href="/admin/products">Inventory</Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white transition-all text-xs uppercase tracking-widest"
                  asChild
                >
                  <Link href="/admin/orders">Shipping</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
