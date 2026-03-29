use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct SubmitMilestone<'info> {
    /// The oracle signer (authorized to submit milestones)
    pub oracle_signer: Signer<'info>,

    /// CHECK: The order program to call via CPI
    pub order_program: UncheckedAccount<'info>,

    /// CHECK: The NFT program to call via CPI
    pub vehicle_nft_program: UncheckedAccount<'info>,

    /// CHECK: The order account to update
    #[account(mut)]
    pub order: UncheckedAccount<'info>,

    /// CHECK: The NFT metadata account to update
    #[account(mut)]
    pub vehicle_metadata: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn submit_milestone(
    ctx: Context<SubmitMilestone>,
    order_id: String,
    milestone_index: u8,
    is_last_milestone: bool,
) -> Result<()> {
    // 1. Verify oracle_signer is authorized (off-chain or in state)

    // 2. Update production status in NFT program via CPI
    // CpiContext::new(ctx.accounts.vehicle_nft_program.to_account_info(), ...)

    // 3. If last milestone and fully funded, trigger settlement? 
    // Or just mark as "ReadyForDelivery" in the Order program.

    Ok(())
}
