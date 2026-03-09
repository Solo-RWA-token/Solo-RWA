use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer};
use crate::state::Escrow;
use crate::error::ErrorCode;
use crate::events::EscrowRefunded;

/// Instruction accounts for refunding an escrow.
#[derive(Accounts)]
#[instruction(vehicle_id: String)]
pub struct RefundEscrow<'info> {
    /// The escrow PDA where funds are locked.
    #[account(
        mut, 
        seeds = [b"escrow", escrow.buyer.as_ref(), vehicle_id.as_bytes()], 
        bump = escrow.bump[0]
    )]
    pub escrow: Account<'info, Escrow>,
    
    /// The token account associated with the Escrow PDA.
    #[account(mut)]
    pub escrow_token: Account<'info, TokenAccount>,
    
    /// The buyer's associated token account where funds will be returned.
    #[account(mut)]
    pub buyer_token: Account<'info, TokenAccount>,
    
    /// The buyer initiating the refund.
    /// CHECK: Buyer signer
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

/// Function to refund the locked tokens back to the buyer.
/// For Phase 1, it assumes if the escrow isn't released yet, it can be freely refunded.
pub fn refund_escrow(ctx: Context<RefundEscrow>, vehicle_id: String) -> Result<()> {
    let escrow = &ctx.accounts.escrow;
    
    // 1. Verify the escrow hasn't been released yet.
    require!(escrow.status == 0, ErrorCode::AlreadyReleased); // Edge: Can't refund if released

    // 2. Prepare PDA signer seeds. 
    // The Escrow PDA must sign the CPI transfer since it owns the `escrow_token` account.
    let seeds = &[b"escrow".as_ref(), escrow.buyer.as_ref(), vehicle_id.as_bytes(), &[escrow.bump[0]]];
    let signer = &[&seeds[..]];

    // 3. Initiate CPI transfer from Escrow PDA back to the Buyer.
    let cpi_accounts = Transfer {
        from: ctx.accounts.escrow_token.to_account_info(),
        to: ctx.accounts.buyer_token.to_account_info(),
        authority: ctx.accounts.escrow.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    anchor_spl::token::transfer(cpi_ctx, escrow.amount)?;

    // 4. Emit event for off-chain tracking.
    emit!(EscrowRefunded { escrow_key: escrow.key() });
    
    Ok(())
}
