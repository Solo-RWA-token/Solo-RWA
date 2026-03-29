use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface, TransferChecked, MintTo};
use crate::state::{Order, OrderStatus};
use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct FundMilestone<'info> {
    #[account(
        mut,
        seeds = [b"order", buyer.key().as_ref(), order.order_id.as_bytes()],
        bump = order.bump
    )]
    pub order: Account<'info, Order>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    /// The buyer's source token account (USDC).
    #[account(mut)]
    pub buyer_token: InterfaceAccount<'info, TokenAccount>,

    /// The program's destination token account (USDC) owned by the Order PDA.
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = token_mint,
        associated_token::authority = order,
    )]
    pub order_token: InterfaceAccount<'info, TokenAccount>,

    /// The custom Voucher Mint for this specific order.
    #[account(
        mut,
        seeds = [b"voucher_mint", order.key().as_ref()],
        bump
    )]
    pub voucher_mint: InterfaceAccount<'info, Mint>,

    /// The buyer's associated token account for Voucher tokens.
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = voucher_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_voucher_token: InterfaceAccount<'info, TokenAccount>,

    /// The underlying currency mint (e.g. USDC).
    pub token_mint: InterfaceAccount<'info, Mint>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn fund_milestone(ctx: Context<FundMilestone>, amount: u64) -> Result<()> {
    let order = &mut ctx.accounts.order;

    // 1. Verify that the order is in the Approved or Processing status
    require!(
        order.status == OrderStatus::Approved as u8 || order.status == OrderStatus::Processing as u8,
        ErrorCode::InvalidOrderState
    );

    // 2. CPI transfer from Buyer to Order PDA (USDC)
    let cpi_accounts = TransferChecked {
        from: ctx.accounts.buyer_token.to_account_info(),
        to: ctx.accounts.order_token.to_account_info(),
        authority: ctx.accounts.buyer.to_account_info(),
        mint: ctx.accounts.token_mint.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    anchor_spl::token_interface::transfer_checked(cpi_ctx, amount, ctx.accounts.token_mint.decimals)?;

    // 3. Mint Vouchers to Buyer
    let seeds = &[
        b"order".as_ref(),
        order.buyer.as_ref(),
        order.order_id.as_bytes(),
        &[order.bump],
    ];
    let signer = &[&seeds[..]];

    let cpi_mint_accounts = MintTo {
        mint: ctx.accounts.voucher_mint.to_account_info(),
        to: ctx.accounts.buyer_voucher_token.to_account_info(),
        authority: order.to_account_info(),
    };
    let cpi_mint_ctx = CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_mint_accounts, signer);
    anchor_spl::token_interface::mint_to(cpi_mint_ctx, amount)?;

    // 4. Update order state
    order.funded_amount = order.funded_amount.checked_add(amount).ok_or(ErrorCode::InsufficientAmount)?;
    order.status = OrderStatus::Processing as u8;

    // 5. Check if fully funded
    if order.funded_amount >= order.total_amount {
        order.status = OrderStatus::ReadyForDelivery as u8;
    }

    Ok(())
}
