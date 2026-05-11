use anchor_lang::prelude::*;
use crate::state::{Order, Milestone, OrderStatus};
use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(index: u8, name: [u8; 32], funding_bps: u16)]
pub struct CreateMilestone<'info> {
    #[account(
        mut,
        seeds = [b"order", order.buyer.as_ref(), order.order_id.as_bytes()],
        bump = order.bump
    )]
    pub order: Account<'info, Order>,

    #[account(
        init,
        payer = seller,
        space = Milestone::SPACE,
        seeds = [b"milestone", order.key().as_ref(), &[index]],
        bump
    )]
    pub milestone: Account<'info, Milestone>,

    #[account(mut)]
    pub seller: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn create_milestone(
    ctx: Context<CreateMilestone>,
    index: u8,
    name: [u8; 32],
    funding_bps: u16,
) -> Result<()> {
    let order = &mut ctx.accounts.order;
    let milestone = &mut ctx.accounts.milestone;

    // 1. Verify seller
    require!(ctx.accounts.seller.key() == order.seller, ErrorCode::UnauthorizedOracle); 

    // 2. Verify order status
    require!(order.status == OrderStatus::Approved as u8, ErrorCode::InvalidOrderState);

    // 3. Populate milestone
    milestone.order = order.key();
    milestone.index = index;
    milestone.name = name;
    milestone.funding_bps = funding_bps;
    milestone.is_completed = false;
    milestone.is_funded = false;
    milestone.completed_at = 0;

    // 4. Update order milestone count
    order.milestone_count = order.milestone_count.checked_add(1).ok_or(ErrorCode::InvalidMilestones)?;

    Ok(())
}
