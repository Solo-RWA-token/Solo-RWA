use anchor_lang::prelude::*;
use anchor_spl::token::{Token, Burn, Transfer};
use anchor_spl::associated_token::AssociatedToken;
use crate::state::{Order, OrderStatus};
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct SettleOrder<'info> {
    #[account(
        mut,
        seeds = [b"order", order.buyer.as_ref(), order.order_id.as_bytes()],
        bump = order.bump
    )]
    pub order: Account<'info, Order>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    /// The buyer's Voucher token account.
    /// CHECK: Validated in instruction
    #[account(mut)]
    pub buyer_voucher_token: AccountInfo<'info>,

    /// The Voucher Mint for this specific order.
    /// CHECK: Validated in instruction
    #[account(
        mut,
        seeds = [b"voucher_mint", order.key().as_ref()],
        bump
    )]
    pub voucher_mint: AccountInfo<'info>,

    /// The Vehicle NFT Mint.
    /// CHECK: Validated in instruction
    pub nft_mint: AccountInfo<'info>,

    /// The program's NFT token account (holding the NFT before settlement).
    /// CHECK: Validated in instruction
    #[account(mut)]
    pub program_nft_token: AccountInfo<'info>,

    /// The buyer's associated token account for the Vehicle NFT.
    /// CHECK: Validated in instruction
    #[account(mut)]
    pub buyer_nft_token: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn settle_order(ctx: Context<SettleOrder>) -> Result<()> {
    let order = &mut ctx.accounts.order;

    // 1. Verify that the order is Ready for Delivery
    require!(order.status == OrderStatus::ReadyForDelivery as u8, ErrorCode::InvalidOrderState);

    // 2. Burn Vouchers from Buyer
    let burn_accounts = Burn {
        mint: ctx.accounts.voucher_mint.to_account_info(),
        from: ctx.accounts.buyer_voucher_token.to_account_info(),
        authority: ctx.accounts.buyer.to_account_info(),
    };
    let burn_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), burn_accounts);
    anchor_spl::token::burn(burn_ctx, order.total_amount)?;

    // 3. Transfer NFT to Buyer
    let seeds = &[
        b"order".as_ref(),
        order.buyer.as_ref(),
        order.order_id.as_bytes(),
        &[order.bump],
    ];
    let signer = &[&seeds[..]];

    let cpi_accounts = Transfer {
        from: ctx.accounts.program_nft_token.to_account_info(),
        to: ctx.accounts.buyer_nft_token.to_account_info(),
        authority: order.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    anchor_spl::token::transfer(cpi_ctx, 1)?; // NFT amount = 1

    // 4. Update order status
    order.status = OrderStatus::Completed as u8;

    Ok(())
}
