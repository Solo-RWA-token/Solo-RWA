use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};
use anchor_spl::token_2022::Token2022;
use crate::state::{Order, Milestone, OrderStatus};

#[derive(Accounts)]
pub struct ApproveOrder<'info> {
    #[account(
        mut,
        seeds = [b"order", order.buyer.as_ref(), order.order_id.as_bytes()],
        bump = order.bump
    )]
    pub order: Account<'info, Order>,

    #[account(mut)]
    pub seller: Signer<'info>,

    /// The Voucher Mint (using Token-2022).
    /// CHECK: Initialized manually in the instruction body
    #[account(mut)]
    pub voucher_mint: AccountInfo<'info>,

    /// The oracle authorized to sign off on production milestones.
    /// CHECK: Reference to oracle
    pub oracle_signer: UncheckedAccount<'info>,

    /// The arbitrator authorized to resolve disputes.
    /// CHECK: Reference to arbitrator
    pub arbitrator: UncheckedAccount<'info>,

    pub token_2022_program: Program<'info, Token2022>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn approve_order(
    ctx: Context<ApproveOrder>,
    _oracle_signer: Pubkey,
    _arbitrator: Pubkey,
) -> Result<()> {
    let order = &mut ctx.accounts.order;
    
    // 1. Verify that the order is in the Created status
    require!(order.status == OrderStatus::Created as u8, crate::error::ErrorCode::InvalidOrderState);

    // 2. Populate Order State Fields.
    order.oracle_signer = ctx.accounts.oracle_signer.key();
    order.arbitrator = ctx.accounts.arbitrator.key();
    order.voucher_mint = ctx.accounts.voucher_mint.key();
    order.status = OrderStatus::Approved as u8;

    Ok(())
}
