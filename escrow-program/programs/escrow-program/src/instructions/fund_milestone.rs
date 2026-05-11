use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount, Token};
use anchor_spl::associated_token::AssociatedToken;
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
    pub order: Box<Account<'info, Order>>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    /// The buyer's source token account (USDC).
    /// CHECK: Validated in the instruction body
    #[account(mut)]
    pub buyer_token: AccountInfo<'info>,

    /// The program's destination token account (USDC) owned by the Order PDA.
    /// CHECK: Validated in the instruction body
    #[account(mut)]
    pub order_token: AccountInfo<'info>,

    /// The custom Voucher Mint for this specific order.
    /// CHECK: Validated in the instruction body
    #[account(mut)]
    pub voucher_mint: AccountInfo<'info>,

    /// The buyer's associated token account for Voucher tokens.
    /// CHECK: Validated in the instruction body
    #[account(mut)]
    pub buyer_voucher_token: AccountInfo<'info>,

    /// The underlying currency mint (e.g. USDC).
    /// CHECK: Validated in the instruction body
    pub token_mint: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn fund_milestone(ctx: Context<FundMilestone>, amount: u64) -> Result<()> {
    let order = &mut ctx.accounts.order;

    // 1. Verify that the order is in the Approved or Processing status
    require!(
        order.status == OrderStatus::Approved as u8 || order.status == OrderStatus::Processing as u8,
        ErrorCode::InvalidOrderState
    );

    // 2. CPI transfer from Buyer to Order PDA (USDC)
    let cpi_accounts = anchor_spl::token::Transfer {
        from: ctx.accounts.buyer_token.to_account_info(),
        to: ctx.accounts.order_token.to_account_info(),
        authority: ctx.accounts.buyer.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    anchor_spl::token::transfer(cpi_ctx, amount)?;

    // 3. Mint Vouchers to Buyer
    let seeds = &[
        b"order".as_ref(),
        order.buyer.as_ref(),
        order.order_id.as_bytes(),
        &[order.bump],
    ];
    let signer = &[&seeds[..]];

    let cpi_mint_accounts = anchor_spl::token::MintTo {
        mint: ctx.accounts.voucher_mint.to_account_info(),
        to: ctx.accounts.buyer_voucher_token.to_account_info(),
        authority: order.to_account_info(),
    };
    let cpi_mint_ctx = CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_mint_accounts, signer);
    anchor_spl::token::mint_to(cpi_mint_ctx, amount)?;

    // 4. Update order state
    order.funded_amount = order.funded_amount.checked_add(amount).ok_or(ErrorCode::InsufficientAmount)?;
    order.status = OrderStatus::Processing as u8;

    // 5. Check if fully funded
    if order.funded_amount >= order.total_amount {
        order.status = OrderStatus::ReadyForDelivery as u8;
    }

    Ok(())
}
