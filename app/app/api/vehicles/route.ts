import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { status: 'Available' },
    })

    return NextResponse.json({ vehicles })
  } catch (error) {
    console.error('Fetch vehicles error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  // Admin only - simplified for now
  try {
    const data = await request.json()
    const vehicle = await prisma.vehicle.create({
      data,
    })
    return NextResponse.json({ vehicle })
  } catch (error) {
    console.error('Create vehicle error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
