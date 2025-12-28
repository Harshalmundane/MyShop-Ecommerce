import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (role !== 'customer' && role !== 'admin') {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const usersCollection = db.collection('users')

    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    })

    return NextResponse.json(
      { 
        message: 'User created successfully',
        userId: result.insertedId.toString()
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
