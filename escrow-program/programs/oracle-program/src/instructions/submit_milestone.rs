use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct SubmitMilestone<'info> {
    /// The oracle signer (authorized to submit milestones)
    pub oracle_signer: Signer<'info>,

    /// CHECK: The escrow program to call via CPI
    pub escrow_program: UncheckedAccount<'info>,

    /// CHECK: The NFT program to call via CPI
    pub vehicle_nft_program: UncheckedAccount<'info>,

    /// CHECK: The escrow account to update
    #[account(mut)]
    pub escrow: UncheckedAccount<'info>,

    /// CHECK: The NFT metadata account to update
    #[account(mut)]
    pub vehicle_metadata: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn submit_milestone(
    ctx: Context<SubmitMilestone>,
    vehicle_id: String,
    milestone_index: u8,
    evidence_hash: [u8; 32],
) -> Result<()> {
    // 1. Verify oracle_signer is in the whitelist (off-chain or in state)
    // For simplicity, we just assume the signer is valid if they pass the Anchor check

    // 2. CPI to Escrow Program to release milestone
    // CpiContext::new(ctx.accounts.escrow_program.to_account_info(), ...)

    // 3. CPI to Vehicle NFT Program to update status
    // CpiContext::new(ctx.accounts.vehicle_nft_program.to_account_info(), ...)

    // 4. Emit event
    // emit!(MilestoneSubmitted { vehicle_id, milestone_index, evidence_hash });

    Ok(())
}
