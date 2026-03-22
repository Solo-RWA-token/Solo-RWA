use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer};
use crate::state::{Escrow, EscrowStatus};
use crate::error::ErrorCode;
use crate::events::EscrowRefunded;

/// Instruction accounts for cancelling/refunding an escrow.
#[derive(Accounts)]
#[instruction(vehicle_id: String)]
pub struct CancelEscrow<'info> {
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
    
    /// The buyer or multisig initiating the cancellation.
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

/// Function to refund the locked tokens back to the buyer and cancel the escrow.
pub fn cancel_escrow(ctx: Context<CancelEscrow>, vehicle_id: String) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    
    // 1. Validations
    // Check authority is either the buyer or the oracle (acting as multisig/admin in Phase 1)
    // Actually, for Phase 1, the build plan says: "buyer (before milestone 1), or multisig"
    let is_buyer = ctx.accounts.authority.key() == escrow.buyer;
    let is_oracle = ctx.accounts.authority.key() == escrow.oracle_signer;
    require!(is_buyer || is_oracle, ErrorCode::UnauthorizedOracle);

    // If buyer is cancelling, check that no milestones have been completed yet.
    if is_buyer {
        let any_completed = escrow.milestones.iter().any(|m| m.completed);
        require!(!any_completed, ErrorCode::InvalidEscrowState);
    }

    require!(escrow.status == EscrowStatus::Active as u8, ErrorCode::AlreadyReleased);

    // 2. Prepare PDA signer seeds. 
    let seeds = &[b"escrow".as_ref(), escrow.buyer.as_ref(), vehicle_id.as_bytes(), &[escrow.bump[0]]];
    let signer = &[&seeds[..]];

    // 3. Calculate refund amount (remaining deposited funds)
    let refund_amount = escrow.deposited_amount.checked_sub(escrow.released_amount).unwrap_or(0);

    // 4. Initiate CPI transfer from Escrow PDA back to the Buyer.
    if refund_amount > 0 {
        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_token.to_account_info(),
            to: ctx.accounts.buyer_token.to_account_info(),
            authority: ctx.accounts.escrow.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        anchor_spl::token::transfer(cpi_ctx, refund_amount)?;
    }

    // 5. Update state
    escrow.status = EscrowStatus::Refunded as u8;

    // 6. Emit event
    emit!(EscrowRefunded { 
        escrow_key: escrow.key(),
        amount: refund_amount 
    });
    
    Ok(())
}
