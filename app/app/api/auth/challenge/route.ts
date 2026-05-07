import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }

    const nonce = uuidv4()

    await prisma.user.upsert({
      where: { walletAddress },
      update: { nonce },
      create: { walletAddress, nonce },
    })

    return NextResponse.json({ nonce })
  } catch (error) {
    console.error('Challenge error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
