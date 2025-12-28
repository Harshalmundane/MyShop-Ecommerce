"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, ShoppingBag, CreditCard } from "lucide-react"

export default function TransactionsPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalOrders: 0,
    monthlyStats: [] as any[],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats")
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch stats", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-serif tracking-tight text-primary">Financial Performance</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Total Revenue</CardTitle>
            <DollarSign className="size-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif">
              ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <TrendingUp className="mr-1 size-3" /> +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Net Profit</CardTitle>
            <CreditCard className="size-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif text-secondary">
              ${stats.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-zinc-400 mt-1">Estimated 25% margin</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Total Orders</CardTitle>
            <ShoppingBag className="size-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif">{stats.totalOrders}</div>
            <p className="text-xs text-zinc-400 mt-1">Successfully fulfilled</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
          <CardTitle className="font-serif">Monthly Performance Overview</CardTitle>
          <CardDescription>A breakdown of your store's financial activity by month.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Calculating data...
                  </TableCell>
                </TableRow>
              ) : stats.monthlyStats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No transaction data available.
                  </TableCell>
                </TableRow>
              ) : (
                stats.monthlyStats.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-zinc-50/80 transition-colors">
                    <TableCell className="font-medium text-zinc-900">{item.month}</TableCell>
                    <TableCell className="text-zinc-600">{item.orders}</TableCell>
                    <TableCell className="text-zinc-900 font-semibold">${item.revenue.toFixed(2)}</TableCell>
                    <TableCell className="text-secondary font-semibold">${item.profit.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                        +{item.growth}%
                      </Badge>
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
