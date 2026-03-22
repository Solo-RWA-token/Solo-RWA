use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer};
use crate::state::Escrow;
use crate::error::ErrorCode;
use crate::events::EscrowFunded;

#[derive(Accounts)]
#[instruction(vehicle_id: String)]
pub struct FundEscrow<'info> {
    #[account(
        mut,
        seeds = [b"escrow", buyer.key().as_ref(), vehicle_id.as_bytes()],
        bump = escrow.bump[0]
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(mut)]
    pub buyer_token: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = mint,
        associated_token::authority = escrow
    )]
    pub escrow_token: Account<'info, TokenAccount>,

    /// CHECK: Mint of the token
    pub mint: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn fund_escrow(ctx: Context<FundEscrow>, _vehicle_id: String, amount: u64) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;

    // 1. Initiate CPI transfer
    let cpi_accounts = Transfer {
        from: ctx.accounts.buyer_token.to_account_info(),
        to: ctx.accounts.escrow_token.to_account_info(),
        authority: ctx.accounts.buyer.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    anchor_spl::token::transfer(cpi_ctx, amount)?;

    // 2. Update state
    escrow.deposited_amount = escrow.deposited_amount.checked_add(amount).ok_or(ErrorCode::InsufficientAmount)?;

    // 3. Emit event
    emit!(EscrowFunded {
        escrow_key: escrow.key(),
        amount,
    });

    Ok(())
}
