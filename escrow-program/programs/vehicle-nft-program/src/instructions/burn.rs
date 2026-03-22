use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, Token, TokenAccount};
use crate::state::VehicleMetadata;

#[derive(Accounts)]
pub struct BurnVehicleNft<'info> {
    #[account(
        mut,
        close = payer,
        seeds = [b"vehicle_metadata", mint.key().as_ref()],
        bump = vehicle_metadata.bump
    )]
    pub vehicle_metadata: Account<'info, VehicleMetadata>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = payer,
    )]
    pub token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn burn_vehicle_nft(ctx: Context<BurnVehicleNft>) -> Result<()> {
    // 1. Burn the token
    let cpi_accounts = Burn {
        mint: ctx.accounts.mint.to_account_info(),
        from: ctx.accounts.token_account.to_account_info(),
        authority: ctx.accounts.payer.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::burn(cpi_ctx, 1)?;

    // 2. The `vehicle_metadata` account is automatically closed due to `close = payer` attribute

    Ok(())
}
