import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import nacl from 'tweetnacl'
import bs58 from 'bs58'

export async function POST(request: Request) {
  try {
    const { walletAddress, signature, message } = await request.json()

    if (!walletAddress || !signature || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
    })

    if (!user || !user.nonce) {
      return NextResponse.json({ error: 'User not found or nonce expired' }, { status: 404 })
    }

    // Verify SIWS message contains the nonce
    if (!message.includes(user.nonce)) {
      return NextResponse.json({ error: 'Invalid nonce' }, { status: 400 })
    }

    // Verify signature
    const isSignatureValid = nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      bs58.decode(signature),
      bs58.decode(walletAddress)
    )

    if (!isSignatureValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Clear nonce after successful verification
    await prisma.user.update({
      where: { walletAddress },
      data: { nonce: null },
    })

    // Create JWT
    const token = jwt.sign(
      { walletAddress: user.walletAddress, userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    )

    const response = NextResponse.json({ success: true, token })
    
    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
