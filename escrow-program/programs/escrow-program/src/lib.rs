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

    /// Initializes a new escrow account.
    pub fn initialize_escrow(
        ctx: Context<InitializeEscrow>,
        vehicle_id: String,
        total_amount: u64,
        milestones: Vec<state::Milestone>,
    ) -> Result<()> {
        instructions::initialize_escrow(ctx, vehicle_id, total_amount, milestones)
    }

    /// Funds an existing escrow account.
    pub fn fund_escrow(ctx: Context<FundEscrow>, vehicle_id: String, amount: u64) -> Result<()> {
        instructions::fund_escrow(ctx, vehicle_id, amount)
    }

    /// Releases a milestone payment to the seller.
    pub fn release_milestone(
        ctx: Context<ReleaseMilestone>,
        vehicle_id: String,
        milestone_index: u8,
    ) -> Result<()> {
        instructions::release_milestone(ctx, vehicle_id, milestone_index)
    }

    /// Cancels an existing escrow account and refunds remaining funds to the buyer.
    pub fn cancel_escrow(ctx: Context<CancelEscrow>, vehicle_id: String) -> Result<()> {
        instructions::cancel_escrow(ctx, vehicle_id)
    }

    /// Disputes an existing escrow account.
    pub fn dispute_escrow(ctx: Context<DisputeEscrow>, vehicle_id: String) -> Result<()> {
        instructions::dispute_escrow(ctx, vehicle_id)
    }
}
