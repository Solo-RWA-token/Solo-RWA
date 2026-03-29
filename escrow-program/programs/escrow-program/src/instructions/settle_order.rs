use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface, Burn};
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
    #[account(mut)]
    pub buyer_voucher_token: InterfaceAccount<'info, TokenAccount>,

    /// The Voucher Mint for this specific order.
    #[account(
        mut,
        seeds = [b"voucher_mint", order.key().as_ref()],
        bump
    )]
    pub voucher_mint: InterfaceAccount<'info, Mint>,

    /// The Vehicle NFT Mint.
    /// CHECK: The NFT Mint should be the digital twin created for this order.
    pub nft_mint: InterfaceAccount<'info, Mint>,

    /// The program's NFT token account (holding the NFT before settlement).
    #[account(mut)]
    pub program_nft_token: InterfaceAccount<'info, TokenAccount>,

    /// The buyer's associated token account for the Vehicle NFT.
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = nft_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_nft_token: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
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
    anchor_spl::token_interface::burn(burn_ctx, order.total_amount)?;

    // 3. Transfer NFT to Buyer
    let seeds = &[
        b"order".as_ref(),
        order.buyer.as_ref(),
        order.order_id.as_bytes(),
        &[order.bump],
    ];
    let signer = &[&seeds[..]];

    let cpi_accounts = anchor_spl::token_interface::TransferChecked {
        from: ctx.accounts.program_nft_token.to_account_info(),
        to: ctx.accounts.buyer_nft_token.to_account_info(),
        authority: order.to_account_info(),
        mint: ctx.accounts.nft_mint.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    anchor_spl::token_interface::transfer_checked(cpi_ctx, 1, 0)?; // NFT decimals = 0

    // 4. Update order status
    order.status = OrderStatus::Completed as u8;

    Ok(())
}
