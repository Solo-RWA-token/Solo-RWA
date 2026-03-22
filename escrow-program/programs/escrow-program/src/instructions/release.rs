use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer};
use crate::state::{Escrow, EscrowStatus};
use crate::error::ErrorCode;
use crate::events::MilestoneReleased;

#[derive(Accounts)]
#[instruction(vehicle_id: String, milestone_index: u8)]
pub struct ReleaseMilestone<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow.buyer.as_ref(), vehicle_id.as_bytes()],
        bump = escrow.bump[0]
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub escrow_token: Account<'info, TokenAccount>,

    #[account(mut)]
    pub seller_token: Account<'info, TokenAccount>,

    /// The oracle authorized to sign off on milestones.
    pub oracle_signer: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn release_milestone(
    ctx: Context<ReleaseMilestone>, 
    vehicle_id: String, 
    milestone_index: u8
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;

    // 1. Validations
    require!(ctx.accounts.oracle_signer.key() == escrow.oracle_signer, ErrorCode::UnauthorizedOracle);
    require!(milestone_index < 5, ErrorCode::InvalidEscrowState);
    require!(!escrow.milestones[milestone_index as usize].completed, ErrorCode::MilestoneAlreadyCompleted);
    require!(escrow.status == EscrowStatus::Active as u8, ErrorCode::InvalidEscrowState);

    // 2. Calculate release amount
    let milestone = &mut escrow.milestones[milestone_index as usize];
    let release_amount = (escrow.total_amount as u128)
        .checked_mul(milestone.release_bps as u128)
        .unwrap()
        .checked_div(10000)
        .unwrap() as u64;

    // 3. Ensure escrow has enough funds (deposited >= released_so_far + this_release)
    // For Phase 1, we might allow partial funding, but the release should be capped by deposited amount.
    let available_to_release = escrow.deposited_amount.checked_sub(escrow.released_amount).unwrap_or(0);
    require!(available_to_release >= release_amount, ErrorCode::InsufficientAmount);

    // 4. CPI transfer from Escrow PDA to Seller
    let seeds = &[
        b"escrow".as_ref(),
        escrow.buyer.as_ref(),
        vehicle_id.as_bytes(),
        &[escrow.bump[0]],
    ];
    let signer = &[&seeds[..]];

    let cpi_accounts = Transfer {
        from: ctx.accounts.escrow_token.to_account_info(),
        to: ctx.accounts.seller_token.to_account_info(),
        authority: escrow.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    anchor_spl::token::transfer(cpi_ctx, release_amount)?;

    // 5. Update state
    milestone.completed = true;
    milestone.completed_at = Clock::get()?.unix_timestamp;
    escrow.released_amount = escrow.released_amount.checked_add(release_amount).unwrap();

    // If all milestones completed, mark escrow as Released
    let all_completed = escrow.milestones.iter().all(|m| m.completed);
    if all_completed {
        escrow.status = EscrowStatus::Released as u8;
    }

    // 6. Emit event
    emit!(MilestoneReleased {
        escrow_key: escrow.key(),
        milestone_index,
        amount: release_amount,
    });

    Ok(())
}
