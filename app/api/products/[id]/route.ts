import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, price, image, stock, category } = await request.json()
    const db = await getDatabase()

    await db.collection("products").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          name,
          description,
          price,
          image,
          stock,
          category,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ message: "Product updated" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    await db.collection("products").deleteOne({ _id: new ObjectId(params.id) })

    return NextResponse.json({ message: "Product deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
