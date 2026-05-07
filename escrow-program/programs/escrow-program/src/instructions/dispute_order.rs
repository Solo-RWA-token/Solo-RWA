use anchor_lang::prelude::*;
use crate::state::{Order, OrderStatus};
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct DisputeOrder<'info> {
    #[account(
        mut,
        seeds = [b"order", order.buyer.as_ref(), order.order_id.as_bytes()],
        bump = order.bump
    )]
    pub order: Account<'info, Order>,

    /// The arbitrator authorized to resolve disputes.
    pub arbitrator: Signer<'info>,
}

pub fn dispute_order(ctx: Context<DisputeOrder>) -> Result<()> {
    let order = &mut ctx.accounts.order;

    // 1. Validation
    require!(ctx.accounts.arbitrator.key() == order.arbitrator, ErrorCode::UnauthorizedArbitrator);
    require!(order.status == OrderStatus::Processing as u8 || order.status == OrderStatus::ReadyForDelivery as u8, ErrorCode::InvalidOrderState);

    // 2. Update status to Disputed
    order.status = OrderStatus::Disputed as u8;

    Ok(())
}
