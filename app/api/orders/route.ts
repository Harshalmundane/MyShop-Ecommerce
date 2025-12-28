import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { items, totalAmount, shippingAddress, paymentMethod } = await request.json()
    const db = await getDatabase()

    // 1. Get User
    const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId as string) })

    // 2. Create Order
    const order = {
      userId: session.userId,
      customerName: user.name,
      customerEmail: user.email,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("orders").insertOne(order)

    // 3. Update Stocks
    for (const item of items) {
      await db
        .collection("products")
        .updateOne({ _id: new ObjectId(item.productId) }, { $inc: { stock: -item.quantity } })
    }

    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Order error:", error)
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const orders = await db.collection("orders").find({ userId: session.userId }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ orders })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
