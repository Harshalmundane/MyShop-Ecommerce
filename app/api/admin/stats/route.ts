import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const orders = await db.collection("orders").find({}).toArray()

    // Calculate totals
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    const totalProfit = totalRevenue * 0.25 // Example 25% profit margin
    const totalOrders = orders.length

    // Simulated monthly stats based on existing data
    const monthlyStats = [
      {
        month: "December 2024",
        orders: Math.floor(totalOrders * 0.4),
        revenue: totalRevenue * 0.4,
        profit: totalRevenue * 0.4 * 0.25,
        growth: 15,
      },
      {
        month: "January 2025",
        orders: Math.floor(totalOrders * 0.6),
        revenue: totalRevenue * 0.6,
        profit: totalRevenue * 0.6 * 0.25,
        growth: 22,
      },
    ].filter((m) => m.orders > 0)

    return NextResponse.json({
      totalRevenue,
      totalProfit,
      totalOrders,
      monthlyStats,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
