import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Connection, PublicKey } from '@solana/web3.js'
import { Program, AnchorProvider } from '@coral-xyz/anchor'
import { IDL } from '@/lib/idl'

const connection = new Connection(process.env.SOLANA_RPC_URL || 'http://localhost:8899', 'confirmed')

export async function POST(
  request: Request,
  { params }: { params: { escrowPda: string } }
) {
  try {
    const { escrowPda } = params
    const { arbitratorWallet } = await request.json()

    const purchase = await prisma.purchase.findUnique({
      where: { escrowPda },
      include: { vehicle: true }
    })

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
    }

    // Build the dispute transaction
    const provider = new AnchorProvider(connection, {
        publicKey: new PublicKey(arbitratorWallet),
        signTransaction: async (tx) => tx,
        signAllTransactions: async (txs) => txs,
    }, {})
    
    const program = new Program(IDL as any, provider)

    const tx = await program.methods
      .disputeEscrow(purchase.vehicle.vin)
      .accounts({
        escrow: new PublicKey(escrowPda),
        arbitrator: new PublicKey(arbitratorWallet),
      })
      .transaction()

    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
    tx.feePayer = new PublicKey(arbitratorWallet)

    const serializedTx = tx.serialize({ requireAllSignatures: false }).toString('base64')

    // Update DB status to 'Disputed'
    await prisma.purchase.update({
      where: { escrowPda },
      data: { status: 'Disputed' }
    })

    return NextResponse.json({ transaction: serializedTx })
  } catch (error) {
    console.error('Dispute error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
