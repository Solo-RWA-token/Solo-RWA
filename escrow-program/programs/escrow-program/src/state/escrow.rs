use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum EscrowStatus {
    Active = 0,
    Released = 1,
    Refunded = 2,
    Disputed = 3,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Default)]
pub struct Milestone {
    pub name: [u8; 32],          // e.g. "production_started"
    pub release_bps: u16,        // basis points of total to release (1/10000)
    pub completed: bool,
    pub completed_at: i64,
}

#[account]
pub struct Escrow {
    /// The public key of the buyer who deposits the funds.
    pub buyer: Pubkey,
    /// The public key of the seller (OEM treasury).
    pub seller: Pubkey,
    /// The total purchase amount (in fractional units like USDC decimals).
    pub total_amount: u64,
    /// The amount currently deposited in the escrow.
    pub deposited_amount: u64,
    /// The amount already released to the seller.
    pub released_amount: u64,
    /// The SPL token mint of the deposited currency (e.g., USDC).
    pub token_mint: Pubkey,
    /// The milestones for the purchase.
    pub milestones: [Milestone; 5],
    /// The oracle authorized to sign off on milestones.
    pub oracle_signer: Pubkey,
    /// The arbitrator authorized to resolve disputes.
    pub arbitrator: Pubkey,
    /// The status of the escrow.
    pub status: u8, // Using u8 for simpler storage, mapped to EscrowStatus
    /// Bump seed used to validate the Escrow PDA.
    pub bump: [u8; 1],
    /// Unix timestamp of when the escrow was created.
    pub created_at: i64,
}

impl Escrow {
    /// Calculate the space required for the Escrow account layout:
    /// Discriminator (8) + Buyer PK (32) + Seller PK (32) + Total Amount (8) + Deposited Amount (8) + Released Amount (8) + Token Mint PK (32) + Milestones (5 * (32 + 2 + 1 + 8)) + Oracle PK (32) + Arbitrator PK (32) + Status (1) + Bump (1) + Created At (8).
    pub const SPACE: usize = 8 + 32 + 32 + 8 + 8 + 8 + 32 + (5 * (32 + 2 + 1 + 8)) + 32 + 32 + 1 + 1 + 8;
}
