use anchor_lang::prelude::*;
use crate::state::{Order, Milestone, OrderStatus};
use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(index: u8)]
pub struct CompleteMilestone<'info> {
    #[account(
        mut,
        seeds = [b"order", order.buyer.as_ref(), order.order_id.as_bytes()],
        bump = order.bump
    )]
    pub order: Account<'info, Order>,

    #[account(
        mut,
        seeds = [b"milestone", order.key().as_ref(), &[index]],
        bump
    )]
    pub milestone: Account<'info, Milestone>,

    /// The oracle authorized to sign off on production milestones.
    pub oracle_signer: Signer<'info>,
}

pub fn complete_milestone(ctx: Context<CompleteMilestone>, _index: u8) -> Result<()> {
    let order = &mut ctx.accounts.order;
    let milestone = &mut ctx.accounts.milestone;

    // 1. Verify oracle_signer
    require!(ctx.accounts.oracle_signer.key() == order.oracle_signer, ErrorCode::UnauthorizedOracle);

    // 2. Verify order status
    require!(
        order.status == OrderStatus::Approved as u8 || order.status == OrderStatus::Processing as u8,
        ErrorCode::InvalidOrderState
    );

    // Transition to Processing if currently Approved
    if order.status == OrderStatus::Approved as u8 {
        order.status = OrderStatus::Processing as u8;
    }

    // 3. Mark as completed
    require!(!milestone.is_completed, ErrorCode::MilestoneAlreadyCompleted);
    milestone.is_completed = true;
    milestone.completed_at = Clock::get()?.unix_timestamp;

    Ok(())
}
