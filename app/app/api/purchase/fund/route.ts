import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js'
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor'
import { IDL } from '@/lib/idl'
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'

const connection = new Connection(process.env.SOLANA_RPC_URL || 'http://localhost:8899', 'confirmed')
const programId = new PublicKey('QdwyxM7n57uXMNRWFHYjUW6W2H4LzGxCsm6uc7mwDVx')

export async function POST(request: Request) {
  try {
    const { buyerWallet, escrowPda, amount, mint } = await request.json()

    if (!buyerWallet || !escrowPda || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const purchase = await prisma.purchase.findUnique({
      where: { escrowPda },
      include: { vehicle: true }
    })

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
    }

    const tokenMint = new PublicKey(mint || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
    const buyerAta = await getAssociatedTokenAddress(tokenMint, new PublicKey(buyerWallet))
    const escrowAta = await getAssociatedTokenAddress(tokenMint, new PublicKey(escrowPda), true)

    // Initialize Anchor Program
    const provider = new AnchorProvider(connection, {
        publicKey: new PublicKey(buyerWallet),
        signTransaction: async (tx) => tx,
        signAllTransactions: async (txs) => txs,
    }, {})
    
    const program = new Program(IDL as any, provider)

    // Build the transaction
    const tx = await program.methods
      .fundEscrow(
        purchase.vehicle.vin,
        new BN(amount * 1000000)
      )
      .accounts({
        escrow: new PublicKey(escrowPda),
        buyer: new PublicKey(buyerWallet),
        buyerToken: buyerAta,
        escrowToken: escrowAta,
        mint: tokenMint,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .transaction()

    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
    tx.feePayer = new PublicKey(buyerWallet)

    const serializedTx = tx.serialize({ requireAllSignatures: false }).toString('base64')

    return NextResponse.json({ transaction: serializedTx })
  } catch (error) {
    console.error('Fund purchase error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
