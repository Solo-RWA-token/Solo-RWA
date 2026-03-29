use anchor_lang::prelude::*;

pub mod error;
pub mod events;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("QdwyxM7n57uXMNRWFHYjUW6W2H4LzGxCsm6uc7mwDVx");

/// Escrow Program
/// This program manages down payments for EV RWA reservations. Phase 1 supports locking and refunding funds.
#[program]
pub mod escrow_program {
    use super::*;

    /// Initializes a new order.
    pub fn initialize_order(
        ctx: Context<InitializeOrder>,
        order_id: String,
        total_amount: u64,
    ) -> Result<()> {
        instructions::initialize_order(ctx, order_id, total_amount)
    }

    /// Approves an order and initializes the Voucher Mint.
    pub fn approve_order(
        ctx: Context<ApproveOrder>,
        oracle_signer: Pubkey,
        arbitrator: Pubkey,
    ) -> Result<()> {
        instructions::approve_order(ctx, oracle_signer, arbitrator)
    }

    /// Funds a milestone and issues Voucher tokens to the buyer.
    pub fn fund_milestone(ctx: Context<FundMilestone>, amount: u64) -> Result<()> {
        instructions::fund_milestone(ctx, amount)
    }

    /// Settles an order by swapping Vouchers for the Vehicle NFT.
    pub fn settle_order(ctx: Context<SettleOrder>) -> Result<()> {
        instructions::settle_order(ctx)
    }

    /// Cancels an existing order and refunds funds.
    pub fn cancel_order(ctx: Context<CancelOrder>) -> Result<()> {
        instructions::cancel_order(ctx)
    }

    /// Disputes an existing order.
    pub fn dispute_order(ctx: Context<DisputeOrder>) -> Result<()> {
        instructions::dispute_order(ctx)
    }
}
