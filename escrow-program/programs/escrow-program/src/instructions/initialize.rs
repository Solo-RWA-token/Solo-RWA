use anchor_lang::prelude::*;
use anchor_spl::token::{Mint};
use crate::state::{Escrow, Milestone, EscrowStatus};
use crate::error::ErrorCode;
use crate::events::EscrowInitialized;

pub const MIN_DOWN: u64 = 100 * 1_000_000; // 100 USDC (6 decimals)

/// Instruction accounts for initializing a new escrow
#[derive(Accounts)]
#[instruction(vehicle_id: String)]
pub struct InitializeEscrow<'info> {
    /// The PDA acting as the escrow account. Seeded by "escrow", buyer pubkey, and vehicle_id.
    #[account(
        init, 
        payer = buyer, 
        space = Escrow::SPACE, 
        seeds = [b"escrow", buyer.key().as_ref(), vehicle_id.as_bytes()], 
        bump
    )]
    pub escrow: Account<'info, Escrow>,
    
    /// The buyer who is creating the escrow.
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    /// The seller address (OEM treasury).
    /// CHECK: Reference to seller
    pub seller: UncheckedAccount<'info>,
    
    /// The mint of the token to be used (e.g. USDC).
    pub mint: Account<'info, Mint>,

    /// The oracle authorized to sign off on milestones.
    /// CHECK: Reference to oracle
    pub oracle_signer: UncheckedAccount<'info>,

    /// The arbitrator authorized to resolve disputes.
    /// CHECK: Reference to arbitrator
    pub arbitrator: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

/// Main function to initialize an escrow reservation.
pub fn initialize_escrow(
    ctx: Context<InitializeEscrow>, 
    vehicle_id: String, 
    total_amount: u64,
    milestones: Vec<Milestone>,
) -> Result<()> {
    // 1. Verify milestones (must be 5, and bps must sum to 10000)
    require!(milestones.len() == 5, ErrorCode::InvalidMilestones);
    let mut total_bps: u16 = 0;
    for m in &milestones {
        total_bps = total_bps.checked_add(m.release_bps).ok_or(ErrorCode::InvalidMilestones)?;
    }
    require!(total_bps == 10000, ErrorCode::InvalidMilestones);

    let escrow = &mut ctx.accounts.escrow;
    
    // 2. Populate Escrow State Fields.
    escrow.buyer = *ctx.accounts.buyer.key;
    escrow.seller = *ctx.accounts.seller.key; 
    escrow.total_amount = total_amount;
    escrow.deposited_amount = 0;
    escrow.released_amount = 0;
    escrow.token_mint = ctx.accounts.mint.key();
    escrow.oracle_signer = *ctx.accounts.oracle_signer.key;
    escrow.arbitrator = *ctx.accounts.arbitrator.key;
    escrow.status = EscrowStatus::Active as u8;
    escrow.bump = [ctx.bumps.escrow];
    escrow.created_at = Clock::get()?.unix_timestamp;

    // Copy milestones to the fixed-size array in state
    for (i, m) in milestones.iter().enumerate() {
        escrow.milestones[i] = *m;
    }

    // 3. Emit initialization event.
    emit!(EscrowInitialized {
        escrow_key: escrow.key(),
        buyer: escrow.buyer,
        total_amount,
        vehicle_id,
    });
    
    Ok(())
}
