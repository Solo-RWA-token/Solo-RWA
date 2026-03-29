use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenInterface};
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
    /// CHECK: The mint should be initialized as part of the approval process with NonTransferable extension.
    #[account(
        init,
        payer = seller,
        mint::decimals = 6,
        mint::authority = order,
        mint::freeze_authority = order,
        mint::token_program = token_2022_program,
        extensions::non_transferable::authority = order,
        seeds = [b"voucher_mint", order.key().as_ref()],
        bump
    )]
    pub voucher_mint: Box<InterfaceAccount<'info, Mint>>,

    /// The oracle authorized to sign off on production milestones.
    /// CHECK: Reference to oracle
    pub oracle_signer: UncheckedAccount<'info>,

    /// The arbitrator authorized to resolve disputes.
    /// CHECK: Reference to arbitrator
    pub arbitrator: UncheckedAccount<'info>,

    pub token_2022_program: Program<'info, anchor_spl::token_2022::Token2022>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn approve_order(
    ctx: Context<ApproveOrder>,
    oracle_signer: Pubkey,
    arbitrator: Pubkey,
) -> Result<()> {
    let order = &mut ctx.accounts.order;
    
    // 1. Verify that the order is in the Created status
    require!(order.status == OrderStatus::Created as u8, crate::error::ErrorCode::InvalidOrderState);

    // 2. Populate Order State Fields.
    order.oracle_signer = oracle_signer;
    order.arbitrator = arbitrator;
    order.voucher_mint = ctx.accounts.voucher_mint.key();
    order.status = OrderStatus::Approved as u8;

    Ok(())
}
