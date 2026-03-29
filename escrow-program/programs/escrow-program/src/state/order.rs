use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum OrderStatus {
    Created = 0,
    Approved = 1,
    Processing = 2,
    ReadyForDelivery = 3,
    Completed = 4,
    Disputed = 5,
    Cancelled = 6,
}

#[account]
pub struct Order {
    /// The public key of the buyer who initiates the order.
    pub buyer: Pubkey,
    /// The public key of the seller (OEM treasury).
    pub seller: Pubkey,
    /// The total purchase amount (in USDC units).
    pub total_amount: u64,
    /// The amount currently funded by the buyer.
    pub funded_amount: u64,
    /// The SPL token mint of the underlying currency (e.g., USDC).
    pub token_mint: Pubkey,
    /// The custom Voucher Mint for this specific order.
    pub voucher_mint: Pubkey,
    /// The oracle authorized to sign off on production milestones.
    pub oracle_signer: Pubkey,
    /// The arbitrator authorized to resolve disputes.
    pub arbitrator: Pubkey,
    /// The status of the order.
    pub status: u8,
    /// Bump seed for the Order PDA.
    pub bump: u8,
    /// Unix timestamp of when the order was created.
    pub created_at: i64,
    /// The number of milestones in this order.
    pub milestone_count: u8,
    /// The unique identifier for this order (e.g. ERP order ID).
    pub order_id: String,
}

impl Order {
    /// Discriminator (8) + Buyer PK (32) + Seller PK (32) + Total Amount (8) + Funded Amount (8) + Token Mint PK (32) + Voucher Mint PK (32) + Oracle PK (32) + Arbitrator PK (32) + Status (1) + Bump (1) + Created At (8) + Milestone Count (1) + Order ID (4 + 64)
    pub const SPACE: usize = 8 + 32 + 32 + 8 + 8 + 32 + 32 + 32 + 32 + 1 + 1 + 8 + 1 + (4 + 64);
}

#[account]
pub struct Milestone {
    /// The Order account this milestone belongs to.
    pub order: Pubkey,
    /// The index of this milestone (0, 1, 2...).
    pub index: u8,
    /// The name of the milestone (e.g. "Chassis Built").
    pub name: [u8; 32],
    /// The basis points of the total amount required for this milestone (1/10000).
    pub funding_bps: u16,
    /// Whether this milestone has been completed (off-chain production status).
    pub is_completed: bool,
    /// Whether this milestone has been funded by the buyer.
    pub is_funded: bool,
    /// Unix timestamp of completion.
    pub completed_at: i64,
}

impl Milestone {
    /// Discriminator (8) + Order PK (32) + Index (1) + Name (32) + Funding BPS (2) + Is Completed (1) + Is Funded (1) + Completed At (8)
    pub const SPACE: usize = 8 + 32 + 1 + 32 + 2 + 1 + 1 + 8;
}
