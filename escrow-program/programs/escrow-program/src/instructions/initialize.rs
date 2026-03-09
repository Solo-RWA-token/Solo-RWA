use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount, Transfer};
use crate::state::Escrow;
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
    
    /// The buyer who is creating the escrow and depositing funds.
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    /// The seller address.
    /// CHECK: We merely save this in the Escrow account for reference at this phase.
    pub seller: UncheckedAccount<'info>,
    
    /// The buyer's associated token account from which funds will be transferred.
    #[account(mut)]
    pub buyer_token: Account<'info, TokenAccount>,
    
    /// The token account belonging to the Escrow PDA. Funds will be locked here.
    #[account(
        init_if_needed, 
        payer = buyer, 
        associated_token::mint = mint, 
        associated_token::authority = escrow
    )]
    pub escrow_token: Account<'info, TokenAccount>,
    
    /// The mint of the token being deposited. (e.g. USDC).
    pub mint: Account<'info, Mint>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,
    pub system_program: Program<'info, System>,
}

/// Main function to initialize an escrow reservation.
pub fn initialize_escrow(ctx: Context<InitializeEscrow>, vehicle_id: String, amount: u64) -> Result<()> {
    // 1. Verify that the deposit meets the minimum down payment requirement.
    require!(amount >= MIN_DOWN, ErrorCode::InsufficientAmount);

    let escrow = &mut ctx.accounts.escrow;
    
    // 2. Populate Escrow State Fields.
    escrow.buyer = *ctx.accounts.buyer.key;
    escrow.seller = *ctx.accounts.seller.key; 
    escrow.amount = amount;
    escrow.token_mint = ctx.accounts.mint.key();
    escrow.status = 0; // Set initial status to "Locked"
    escrow.bump = [ctx.bumps.escrow];
    escrow.created_at = Clock::get()?.unix_timestamp;

    // 3. Initiate CPI to transfer tokens from the User to the Escrow PDA's associated token account.
    let cpi_accounts = Transfer {
        from: ctx.accounts.buyer_token.to_account_info(),
        to: ctx.accounts.escrow_token.to_account_info(),
        authority: ctx.accounts.buyer.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    anchor_spl::token::transfer(cpi_ctx, amount)?;

    // 4. Emit initialization event containing details for processing off-chain (minting).
    emit!(EscrowInitialized {
        escrow_key: escrow.key(),
        buyer: escrow.buyer,
        amount,
        vehicle_id,
    });
    
    Ok(())
}
