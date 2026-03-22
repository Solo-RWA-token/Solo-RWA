import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { escrowPda: string } }
) {
  try {
    const { escrowPda } = params

    const purchase = await prisma.purchase.findUnique({
      where: { escrowPda },
      include: {
        vehicle: true,
        milestones: true,
      },
    })

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
    }

    return NextResponse.json({ purchase })
  } catch (error) {
    console.error('Fetch purchase error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
