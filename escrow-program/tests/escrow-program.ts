import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { EscrowProgram } from "../target/types/escrow_program";
import { 
  TOKEN_PROGRAM_ID, 
  createMint, 
  createAccount, 
  mintTo, 
  getAssociatedTokenAddress,
  getAccount
} from "@solana/spl-token";
import { expect } from "chai";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";

describe("escrow-program", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.EscrowProgram as Program<EscrowProgram>;
  const buyer = (provider.wallet as anchor.Wallet).payer;
  const seller = Keypair.generate();
  const oracle = Keypair.generate();
  const vehicleId = "VEHICLE-123";
  const totalAmount = new BN(1000 * 1000000); // 1000 USDC

  let mint: PublicKey;
  let buyerTokenAccount: PublicKey;
  let escrowPda: PublicKey;
  let escrowTokenAccount: PublicKey;

  const milestones = [
    { name: Array.from(Buffer.alloc(32, "Production Started")), releaseBps: 2000, completed: false, completedAt: new BN(0) },
    { name: Array.from(Buffer.alloc(32, "Body Complete")), releaseBps: 2000, completed: false, completedAt: new BN(0) },
    { name: Array.from(Buffer.alloc(32, "Paint Complete")), releaseBps: 2000, completed: false, completedAt: new BN(0) },
    { name: Array.from(Buffer.alloc(32, "Assembly Complete")), releaseBps: 2000, completed: false, completedAt: new BN(0) },
    { name: Array.from(Buffer.alloc(32, "Ready for Delivery")), releaseBps: 2000, completed: false, completedAt: new BN(0) },
  ];

  before(async () => {
    // Create Mint
    mint = await createMint(
      provider.connection,
      buyer,
      buyer.publicKey,
      null,
      6
    );

    // Create Buyer Token Account
    buyerTokenAccount = await createAccount(
      provider.connection,
      buyer,
      mint,
      buyer.publicKey
    );

    // Mint some tokens to buyer
    await mintTo(
      provider.connection,
      buyer,
      mint,
      buyerTokenAccount,
      buyer.publicKey,
      5000 * 1000000
    );

    // Derive Escrow PDA
    [escrowPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), buyer.publicKey.toBuffer(), Buffer.from(vehicleId)],
      program.programId
    );

    // Derive Escrow Token Account
    escrowTokenAccount = await getAssociatedTokenAddress(
      mint,
      escrowPda,
      true
    );
  });

  it("Initializes Escrow", async () => {
    await program.methods
      .initializeEscrow(vehicleId, totalAmount, milestones)
      .accounts({
        escrow: escrowPda,
        buyer: buyer.publicKey,
        seller: seller.publicKey,
        mint: mint,
        oracleSigner: oracle.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const escrowAccount = await program.account.escrow.fetch(escrowPda);
    expect(escrowAccount.buyer.toBase58()).to.equal(buyer.publicKey.toBase58());
    expect(escrowAccount.totalAmount.toString()).to.equal(totalAmount.toString());
    expect(escrowAccount.status).to.equal(0); // Active
  });

  it("Funds Escrow", async () => {
    const fundAmount = new BN(500 * 1000000);
    await program.methods
      .fundEscrow(vehicleId, fundAmount)
      .accounts({
        escrow: escrowPda,
        buyer: buyer.publicKey,
        buyerToken: buyerTokenAccount,
        escrowToken: escrowTokenAccount,
        mint: mint,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const escrowAccount = await program.account.escrow.fetch(escrowPda);
    expect(escrowAccount.depositedAmount.toString()).to.equal(fundAmount.toString());

    const tokenBalance = await provider.connection.getTokenAccountBalance(escrowTokenAccount);
    expect(tokenBalance.value.amount).to.equal(fundAmount.toString());
  });

  it("Releases Milestone", async () => {
    const sellerTokenAccount = await createAccount(
      provider.connection,
      buyer,
      mint,
      seller.publicKey
    );

    await program.methods
      .releaseMilestone(vehicleId, 0)
      .accounts({
        escrow: escrowPda,
        escrowToken: escrowTokenAccount,
        sellerToken: sellerTokenAccount,
        oracleSigner: oracle.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([oracle])
      .rpc();

    const escrowAccount = await program.account.escrow.fetch(escrowPda);
    expect(escrowAccount.milestones[0].completed).to.be.true;
    expect(escrowAccount.releasedAmount.toNumber()).to.equal(200 * 1000000); // 20% of 1000

    const sellerBalance = await provider.connection.getTokenAccountBalance(sellerTokenAccount);
    expect(sellerBalance.value.amount).to.equal((200 * 1000000).toString());
  });

  it("Cancels Escrow", async () => {
    // For this test, we create a new escrow that hasn't started milestones
    const newVehicleId = "VEHICLE-456";
    const [newEscrowPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), buyer.publicKey.toBuffer(), Buffer.from(newVehicleId)],
      program.programId
    );
    const newEscrowTokenAccount = await getAssociatedTokenAddress(mint, newEscrowPda, true);

    await program.methods
      .initializeEscrow(newVehicleId, totalAmount, milestones)
      .accounts({
        escrow: newEscrowPda,
        buyer: buyer.publicKey,
        seller: seller.publicKey,
        mint: mint,
        oracleSigner: oracle.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    await program.methods
      .fundEscrow(newVehicleId, new BN(300 * 1000000))
      .accounts({
        escrow: newEscrowPda,
        buyer: buyer.publicKey,
        buyerToken: buyerTokenAccount,
        escrowToken: newEscrowTokenAccount,
        mint: mint,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const initialBuyerBalance = (await provider.connection.getTokenAccountBalance(buyerTokenAccount)).value.uiAmount;

    await program.methods
      .cancelEscrow(newVehicleId)
      .accounts({
        escrow: newEscrowPda,
        escrowToken: newEscrowTokenAccount,
        buyerToken: buyerTokenAccount,
        authority: buyer.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    const escrowAccount = await program.account.escrow.fetch(newEscrowPda);
    expect(escrowAccount.status).to.equal(2); // Refunded

    const finalBuyerBalance = (await provider.connection.getTokenAccountBalance(buyerTokenAccount)).value.uiAmount;
    expect(finalBuyerBalance).to.equal(initialBuyerBalance + 300);
  });
});
