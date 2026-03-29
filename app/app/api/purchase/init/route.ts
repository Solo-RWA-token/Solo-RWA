import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js'
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor'
import { IDL } from '@/lib/idl'

const connection = new Connection(process.env.SOLANA_RPC_URL || 'http://localhost:8899', 'confirmed')
const programId = new PublicKey('QdwyxM7n57uXMNRWFHYjUW6W2H4LzGxCsm6uc7mwDVx')

export async function POST(request: Request) {
  try {
    const { buyerWallet, vehicleId, milestones, seller, mint, oracleSigner } = await request.json()

    if (!buyerWallet || !vehicleId || !milestones) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    const [escrowPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('escrow'), new PublicKey(buyerWallet).toBuffer(), Buffer.from(vehicle.vin)],
      programId
    )

    // Check if purchase already exists
    const existingPurchase = await prisma.purchase.findUnique({
      where: { escrowPda: escrowPda.toBase58() },
    })

    if (existingPurchase) {
      return NextResponse.json({ error: 'Purchase already initiated' }, { status: 400 })
    }

    // Initialize Anchor Program
    // Use a dummy provider for building transaction
    const provider = new AnchorProvider(connection, {
        publicKey: new PublicKey(buyerWallet),
        signTransaction: async (tx) => tx,
        signAllTransactions: async (txs) => txs,
    }, {})
    
    const program = new Program(IDL as any, provider)

    // Build the transaction
    const tx = await program.methods
      .initializeEscrow(
        vehicle.vin,
        new BN(vehicle.priceUsd * 1000000), // Convert to USDC decimals
        milestones.map((m: any) => ({
            name: Array.from(Buffer.alloc(32, m.name)),
            releaseBps: m.releaseBps,
            completed: false,
            completedAt: new BN(0)
        }))
      )
      .accounts({
        escrow: escrowPda,
        buyer: new PublicKey(buyerWallet),
        seller: new PublicKey(seller || 'HQr8T8T8T8T8T8T8T8T8T8T8T8T8T8T8T8T8T8T8T8T8'), // Default seller
        mint: new PublicKey(mint || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), // Default USDC
        oracleSigner: new PublicKey(oracleSigner || 'HQr8T8T8T8T8T8T8T8T8T8T8T8T8T8T8T8T8T8T8T8T8'), // Default oracle
        systemProgram: SystemProgram.programId,
      })
      .transaction()

    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
    tx.feePayer = new PublicKey(buyerWallet)

    const serializedTx = tx.serialize({ requireAllSignatures: false }).toString('base64')

    // Create purchase in DB
    await prisma.purchase.create({
      data: {
        buyerWallet,
        vehicleId,
        escrowPda: escrowPda.toBase58(),
        totalUsdc: vehicle.priceUsd,
        status: 'Active',
        milestones: {
          create: milestones.map((m: any) => ({
            name: m.name,
            releaseBps: m.releaseBps,
          })),
        },
      },
    })

    return NextResponse.json({ transaction: serializedTx, escrowPda: escrowPda.toBase58() })
  } catch (error) {
    console.error('Init purchase error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
