use anchor_lang::prelude::*;
use crate::state::{Escrow, EscrowStatus};
use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(vehicle_id: String)]
pub struct DisputeEscrow<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow.buyer.as_ref(), vehicle_id.as_bytes()],
        bump = escrow.bump[0]
    )]
    pub escrow: Account<'info, Escrow>,

    /// The arbitrator authorized to resolve disputes.
    pub arbitrator: Signer<'info>,
}

pub fn dispute_escrow(ctx: Context<DisputeEscrow>, _vehicle_id: String) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;

    // 1. Validation
    require!(ctx.accounts.arbitrator.key() == escrow.arbitrator, ErrorCode::UnauthorizedArbitrator);
    require!(escrow.status == EscrowStatus::Active as u8, ErrorCode::InvalidEscrowState);

    // 2. Update status to Disputed
    escrow.status = EscrowStatus::Disputed as u8;

    Ok(())
}
