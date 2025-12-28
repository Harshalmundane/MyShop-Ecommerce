import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    console.log("[v0] Auth session check:", session?.role)

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body
    console.log("[v0] Updating order status:", { id: params.id, status })

    const db = await getDatabase()

    const result = await db
      .collection("orders")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: { status, updatedAt: new Date() } })

    console.log("[v0] Update result:", result.modifiedCount)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Status updated", success: true })
  } catch (error: any) {
    console.error("[v0] Status update error:", error.message)
    return NextResponse.json({ error: error.message || "Failed to update status" }, { status: 500 })
  }
}
