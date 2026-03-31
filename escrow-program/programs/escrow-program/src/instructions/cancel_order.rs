use anchor_lang::prelude::*;
use anchor_spl::token::{Token, Burn, Transfer};
use crate::state::{Order, OrderStatus};
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct CancelOrder<'info> {
    #[account(
        mut,
        seeds = [b"order", order.buyer.as_ref(), order.order_id.as_bytes()],
        bump = order.bump
    )]
    pub order: Account<'info, Order>,

    #[account(mut)]
    pub authority: Signer<'info>,

    /// The program's token account (holding the USDC).
    /// CHECK: Validated in instruction
    #[account(mut)]
    pub order_token: AccountInfo<'info>,

    /// The buyer's associated token account where USDC will be returned.
    /// CHECK: Validated in instruction
    #[account(mut)]
    pub buyer_token: AccountInfo<'info>,

    /// The buyer's associated token account for Vouchers to be burned.
    /// CHECK: Validated in instruction
    #[account(mut)]
    pub buyer_voucher_token: AccountInfo<'info>,

    /// The custom Voucher Mint.
    /// CHECK: Validated in instruction
    #[account(mut)]
    pub voucher_mint: AccountInfo<'info>,

    /// The underlying currency mint (e.g. USDC).
    /// CHECK: Validated in instruction
    pub token_mint: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn cancel_order(ctx: Context<CancelOrder>) -> Result<()> {
    let order = &mut ctx.accounts.order;

    // 1. Validations
    let is_buyer = ctx.accounts.authority.key() == order.buyer;
    let is_oracle = ctx.accounts.authority.key() == order.oracle_signer;
    require!(is_buyer || is_oracle, ErrorCode::UnauthorizedOracle);

    // If buyer cancels, they must have no production milestones completed (simplified logic)
    if is_buyer {
        require!(order.status == OrderStatus::Created as u8 || order.status == OrderStatus::Approved as u8, ErrorCode::InvalidOrderState);
    }

    // 2. Refund USDC to Buyer
    let seeds = &[
        b"order".as_ref(),
        order.buyer.as_ref(),
        order.order_id.as_bytes(),
        &[order.bump],
    ];
    let signer = &[&seeds[..]];

    if order.funded_amount > 0 {
        let cpi_accounts = Transfer {
            from: ctx.accounts.order_token.to_account_info(),
            to: ctx.accounts.buyer_token.to_account_info(),
            authority: order.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        anchor_spl::token::transfer(cpi_ctx, order.funded_amount)?;
    }

    // 3. Burn Vouchers from Buyer
    if is_buyer && order.funded_amount > 0 {
        let burn_accounts = Burn {
            mint: ctx.accounts.voucher_mint.to_account_info(),
            from: ctx.accounts.buyer_voucher_token.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let burn_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), burn_accounts);
        anchor_spl::token::burn(burn_ctx, order.funded_amount)?;
    }

    // 4. Update order state
    order.status = OrderStatus::Cancelled as u8;

    Ok(())
}
