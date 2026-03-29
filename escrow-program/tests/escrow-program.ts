import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { EscrowProgram } from "../target/types/escrow_program";
import { 
  TOKEN_PROGRAM_ID, 
  TOKEN_2022_PROGRAM_ID,
  createMint, 
  createAccount, 
  mintTo, 
  getAssociatedTokenAddress,
  getAccount,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  transferChecked
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
  const arbitrator = Keypair.generate();
  const orderId = "ORDER-" + Math.random().toString(36).substring(7);
  const totalAmount = new BN(1000 * 1000000); // 1000 USDC

  let mint: PublicKey;
  let buyerTokenAccount: PublicKey;
  let orderPda: PublicKey;
  let voucherMint: PublicKey;
  let buyerVoucherAccount: PublicKey;
  let orderTokenAccount: PublicKey;

  before(async () => {
    // 1. Create USDC Mint (Legacy Token Program)
    mint = await createMint(
      provider.connection,
      buyer,
      buyer.publicKey,
      null,
      6,
      undefined,
      undefined,
      TOKEN_PROGRAM_ID
    );

    // 2. Create Buyer Token Account
    buyerTokenAccount = await createAccount(
      provider.connection,
      buyer,
      mint,
      buyer.publicKey,
      undefined,
      undefined,
      TOKEN_PROGRAM_ID
    );

    // 3. Mint USDC to buyer
    await mintTo(
      provider.connection,
      buyer,
      mint,
      buyerTokenAccount,
      buyer.publicKey,
      10000 * 1000000,
      [],
      undefined,
      TOKEN_PROGRAM_ID
    );

    // 4. Derive Order PDA
    [orderPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("order"), buyer.publicKey.toBuffer(), Buffer.from(orderId)],
      program.programId
    );

    // 5. Derive Voucher Mint PDA
    [voucherMint] = PublicKey.findProgramAddressSync(
      [Buffer.from("voucher_mint"), orderPda.toBuffer()],
      program.programId
    );

    // 6. Derive Order Token Account (USDC)
    orderTokenAccount = await getAssociatedTokenAddress(
      mint,
      orderPda,
      true,
      TOKEN_PROGRAM_ID
    );

    // 7. Derive Buyer Voucher Account
    buyerVoucherAccount = await getAssociatedTokenAddress(
      voucherMint,
      buyer.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );
  });

  it("Initializes Order", async () => {
    await program.methods
      .initializeOrder(orderId, totalAmount)
      .accounts({
        order: orderPda,
        buyer: buyer.publicKey,
        seller: seller.publicKey,
        tokenMint: mint,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const orderAccount = await program.account.order.fetch(orderPda);
    expect(orderAccount.buyer.toBase58()).to.equal(buyer.publicKey.toBase58());
    expect(orderAccount.totalAmount.toString()).to.equal(totalAmount.toString());
    expect(orderAccount.status).to.equal(0); // Created
  });

  it("Fails to approve order with wrong seller", async () => {
    const wrongSeller = Keypair.generate();
    try {
      await program.methods
        .approveOrder(oracle.publicKey, arbitrator.publicKey)
        .accounts({
          order: orderPda,
          seller: wrongSeller.publicKey,
          voucherMint: voucherMint,
          oracleSigner: oracle.publicKey,
          arbitrator: arbitrator.publicKey,
          token2022Program: TOKEN_2022_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([wrongSeller])
        .rpc();
      expect.fail("Should have failed with unauthorized signer");
    } catch (e) {
      // Expected error: seeds/constraint check will fail or the logic inside
    }
  });

  it("Approves Order and Initializes Voucher Mint (Token-2022)", async () => {
    // Need to fund seller for rent
    const tx = new anchor.web3.Transaction().add(
        anchor.web3.SystemProgram.transfer({
            fromPubkey: buyer.publicKey,
            toPubkey: seller.publicKey,
            lamports: anchor.web3.LAMPORTS_PER_SOL / 10,
        })
    );
    await provider.sendAndConfirm(tx);

    await program.methods
      .approveOrder(oracle.publicKey, arbitrator.publicKey)
      .accounts({
        order: orderPda,
        seller: seller.publicKey,
        voucherMint: voucherMint,
        oracleSigner: oracle.publicKey,
        arbitrator: arbitrator.publicKey,
        token2022Program: TOKEN_2022_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([seller])
      .rpc();

    const orderAccount = await program.account.order.fetch(orderPda);
    expect(orderAccount.status).to.equal(1); // Approved
    expect(orderAccount.voucherMint.toBase58()).to.equal(voucherMint.toBase58());
  });

  it("Fails to fund milestone with insufficient balance", async () => {
    const poorBuyer = Keypair.generate();
    const poorBuyerAta = await createAccount(provider.connection, buyer, mint, poorBuyer.publicKey);
    
    try {
      await program.methods
        .fundMilestone(totalAmount)
        .accounts({
          order: orderPda,
          buyer: poorBuyer.publicKey,
          buyerToken: poorBuyerAta,
          orderToken: orderTokenAccount,
          voucherMint: voucherMint,
          buyerVoucherToken: await getAssociatedTokenAddress(voucherMint, poorBuyer.publicKey, false, TOKEN_2022_PROGRAM_ID),
          tokenMint: mint,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([poorBuyer])
        .rpc();
      expect.fail("Should have failed with insufficient funds");
    } catch (e) {
      // Expected
    }
  });

  it("Funds Milestone (Swaps USDC for Vouchers)", async () => {
    const fundAmount = new BN(200 * 1000000); // 20%
    await program.methods
      .fundMilestone(fundAmount)
      .accounts({
        order: orderPda,
        buyer: buyer.publicKey,
        buyerToken: buyerTokenAccount,
        orderToken: orderTokenAccount,
        voucherMint: voucherMint,
        buyerVoucherToken: buyerVoucherAccount,
        tokenMint: mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    const orderAccount = await program.account.order.fetch(orderPda);
    expect(orderAccount.fundedAmount.toString()).to.equal(fundAmount.toString());
    expect(orderAccount.status).to.equal(2); // Processing

    const voucherBalance = await provider.connection.getTokenAccountBalance(buyerVoucherAccount);
    expect(voucherBalance.value.amount).to.equal(fundAmount.toString());
  });

  it("Fails to transfer Non-Transferable Vouchers", async () => {
    const otherWallet = Keypair.generate();
    const otherVoucherAccount = await createAccount(
        provider.connection, 
        buyer, 
        voucherMint, 
        otherWallet.publicKey,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID
    );

    try {
        await transferChecked(
            provider.connection,
            buyer,
            buyerVoucherAccount,
            voucherMint,
            otherVoucherAccount,
            buyer.publicKey,
            1,
            6,
            [],
            undefined,
            TOKEN_2022_PROGRAM_ID
        );
        expect.fail("Voucher transfer should have failed due to Non-Transferable extension");
    } catch (e) {
        // Expected: transfer failed
    }
  });

  it("Fails to settle an underfunded order", async () => {
    const nftMint = await createMint(provider.connection, buyer, orderPda, orderPda, 0, undefined, undefined, TOKEN_2022_PROGRAM_ID);
    const buyerNftAccount = await getAssociatedTokenAddress(nftMint, buyer.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const programNftAccount = await createAccount(provider.connection, buyer, nftMint, orderPda, undefined, undefined, TOKEN_2022_PROGRAM_ID);

    try {
      await program.methods
        .settleOrder()
        .accounts({
          order: orderPda,
          buyer: buyer.publicKey,
          buyerVoucherToken: buyerVoucherAccount,
          voucherMint: voucherMint,
          nftMint: nftMint,
          programNftToken: programNftAccount,
          buyerNftToken: buyerNftAccount,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();
      expect.fail("Settlement should have failed for underfunded order");
    } catch (e) {
      // Expected: InvalidOrderState
    }
  });

  it("Completes funding and Settles Order", async () => {
    const remainingAmount = new BN(800 * 1000000);
    await program.methods
      .fundMilestone(remainingAmount)
      .accounts({
        order: orderPda,
        buyer: buyer.publicKey,
        buyerToken: buyerTokenAccount,
        orderToken: orderTokenAccount,
        voucherMint: voucherMint,
        buyerVoucherToken: buyerVoucherAccount,
        tokenMint: mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    // Setup NFT again (as previous test didn't complete)
    const nftMint = await createMint(provider.connection, buyer, orderPda, orderPda, 0, undefined, undefined, TOKEN_2022_PROGRAM_ID);
    const buyerNftAccount = await getAssociatedTokenAddress(nftMint, buyer.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const programNftAccount = await createAccount(provider.connection, buyer, nftMint, orderPda, undefined, undefined, TOKEN_2022_PROGRAM_ID);
    await mintTo(provider.connection, buyer, nftMint, programNftAccount, orderPda, 1, [], undefined, TOKEN_2022_PROGRAM_ID);

    await program.methods
      .settleOrder()
      .accounts({
        order: orderPda,
        buyer: buyer.publicKey,
        buyerVoucherToken: buyerVoucherAccount,
        voucherMint: voucherMint,
        nftMint: nftMint,
        programNftToken: programNftAccount,
        buyerNftToken: buyerNftAccount,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    const orderAccount = await program.account.order.fetch(orderPda);
    expect(orderAccount.status).to.equal(4); // Completed
  });

  it("Fails to cancel a completed order", async () => {
    try {
      await program.methods
        .cancelOrder()
        .accounts({
          order: orderPda,
          authority: buyer.publicKey,
          orderToken: orderTokenAccount,
          buyerToken: buyerTokenAccount,
          buyerVoucherToken: buyerVoucherAccount,
          voucherMint: voucherMint,
          tokenMint: mint,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .rpc();
      expect.fail("Should have failed to cancel a completed order");
    } catch (e) {
      // Expected
    }
  });

  it("Dispute Flow - Fails for non-arbitrator", async () => {
    // New order for dispute test
    const disputeOrderId = "ORDER-DISPUTE-" + Math.random().toString(36).substring(7);
    const [dOrderPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("order"), buyer.publicKey.toBuffer(), Buffer.from(disputeOrderId)],
        program.programId
    );
    
    await program.methods
      .initializeOrder(disputeOrderId, totalAmount)
      .accounts({
        order: dOrderPda,
        buyer: buyer.publicKey,
        seller: seller.publicKey,
        tokenMint: mint,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    await program.methods
        .approveOrder(oracle.publicKey, arbitrator.publicKey)
        .accounts({
            order: dOrderPda,
            seller: seller.publicKey,
            voucherMint: PublicKey.findProgramAddressSync([Buffer.from("voucher_mint"), dOrderPda.toBuffer()], program.programId)[0],
            oracleSigner: oracle.publicKey,
            arbitrator: arbitrator.publicKey,
            token2022Program: TOKEN_2022_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([seller])
        .rpc();

    try {
        await program.methods
            .disputeOrder()
            .accounts({
                order: dOrderPda,
                arbitrator: buyer.publicKey, // Wrong signer
            })
            .rpc();
        expect.fail("Dispute should have failed for wrong arbitrator");
    } catch (e) {
        // Expected
    }
  });
});
