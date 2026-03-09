use anchor_lang::prelude::*;

#[account]
pub struct Escrow {
    /// The public key of the buyer who deposits the funds.
    pub buyer: Pubkey,
    /// The public key of the seller (hardcoded for MVP Phase 1).
    pub seller: Pubkey,
    /// The down payment amount locked in the escrow (in fractional units like lamports or USDC decimals).
    pub amount: u64,
    /// The SPL token mint of the deposited currency (e.g., USDC or SOL).
    pub token_mint: Pubkey,
    /// The status of the escrow (0 = Locked, 1 = Released/Refunded). Phase 1 only uses Locked.
    pub status: u8,
    /// Bump seed used to validate the Escrow PDA.
    pub bump: [u8; 1],
    /// Unix timestamp of when the escrow was created.
    pub created_at: i64,
}

impl Escrow {
    /// Calculate the space required for the Escrow account layout:
    /// Discriminator (8) + Buyer PK (32) + Seller PK (32) + Amount (8) + Token Mint PK (32) + Status (1) + Bump (1) + Created At (8).
    pub const SPACE: usize = 8 + 32 + 32 + 8 + 32 + 1 + 1 + 8;
}
