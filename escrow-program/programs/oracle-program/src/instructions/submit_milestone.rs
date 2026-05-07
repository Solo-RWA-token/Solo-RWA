use anchor_lang::prelude::*;
use escrow_program::cpi::accounts::CompleteMilestone;
use escrow_program::program::EscrowProgram;
use vehicle_nft_program::cpi::accounts::UpdateVehicleStatus;
use vehicle_nft_program::program::VehicleNftProgram;

#[derive(Accounts)]
pub struct SubmitMilestone<'info> {
    /// The oracle signer (authorized to submit milestones)
    pub oracle_signer: Signer<'info>,

    /// The order program to call via CPI
    pub order_program: Program<'info, EscrowProgram>,

    /// The NFT program to call via CPI
    pub vehicle_nft_program: Program<'info, VehicleNftProgram>,

    /// The order account to update
    /// CHECK: Validated in the Order program
    #[account(mut)]
    pub order: AccountInfo<'info>,

    /// The milestone account to update
    /// CHECK: Validated in the Order program
    #[account(mut)]
    pub milestone: AccountInfo<'info>,

    /// The NFT metadata account to update
    /// CHECK: Validated in the NFT program
    #[account(mut)]
    pub vehicle_metadata: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

pub fn submit_milestone(
    ctx: Context<SubmitMilestone>,
    _order_id: String,
    milestone_index: u8,
    is_last_milestone: bool,
) -> Result<()> {
    // 1. CPI to Order Program to complete milestone
    let cpi_order_program = ctx.accounts.order_program.to_account_info();
    let cpi_order_accounts = CompleteMilestone {
        order: ctx.accounts.order.to_account_info(),
        milestone: ctx.accounts.milestone.to_account_info(),
        oracle_signer: ctx.accounts.oracle_signer.to_account_info(),
    };
    let cpi_order_ctx = CpiContext::new(cpi_order_program, cpi_order_accounts);
    escrow_program::cpi::complete_milestone(cpi_order_ctx, milestone_index)?;

    // 2. CPI to Vehicle NFT Program to update status
    // Map milestone index to physical status if needed, or just increment
    let new_status = if is_last_milestone { 2 } else { 1 }; // 1: InProduction, 2: ReadyForDelivery
    
    let cpi_nft_program = ctx.accounts.vehicle_nft_program.to_account_info();
    let cpi_nft_accounts = UpdateVehicleStatus {
        vehicle_metadata: ctx.accounts.vehicle_metadata.to_account_info(),
        authority: ctx.accounts.oracle_signer.to_account_info(),
    };
    let cpi_nft_ctx = CpiContext::new(cpi_nft_program, cpi_nft_accounts);
    vehicle_nft_program::cpi::update_vehicle_status(cpi_nft_ctx, new_status)?;

    Ok(())
}
