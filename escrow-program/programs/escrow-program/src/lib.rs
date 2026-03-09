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

    /// Initializes a new escrow account and transfers the down payment into the PDA vault.
    pub fn initialize_escrow(
        ctx: Context<InitializeEscrow>,
        vehicle_id: String,
        amount: u64,
    ) -> Result<()> {
        instructions::initialize_escrow(ctx, vehicle_id, amount)
    }

    /// Refunds an existing escrow account by transferring funds from the PDA vault back to the buyer.
    pub fn refund_escrow(ctx: Context<RefundEscrow>, vehicle_id: String) -> Result<()> {
        instructions::refund_escrow(ctx, vehicle_id)
    }
}
