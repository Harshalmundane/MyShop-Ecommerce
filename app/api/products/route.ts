import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const db = await getDatabase()
    const products = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, price, image, stock, category } = await request.json()
    const db = await getDatabase()

    const result = await db.collection("products").insertOne({
      name,
      description,
      price,
      image,
      stock,
      category,
      createdAt: new Date(),
    })

    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
