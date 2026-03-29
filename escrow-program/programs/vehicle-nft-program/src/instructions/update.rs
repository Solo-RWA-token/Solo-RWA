use anchor_lang::prelude::*;
use crate::state::VehicleMetadata;

#[derive(Accounts)]
pub struct UpdateVehicleStatus<'info> {
    #[account(
        mut,
        seeds = [b"vehicle_metadata", vehicle_metadata.mint.as_ref()],
        bump = vehicle_metadata.bump
    )]
    pub vehicle_metadata: Account<'info, VehicleMetadata>,

    /// The oracle or authority allowed to update status.
    pub authority: Signer<'info>,
}

pub fn update_vehicle_status(ctx: Context<UpdateVehicleStatus>, new_status: u8) -> Result<()> {
    let metadata = &mut ctx.accounts.vehicle_metadata;
    
    // Check if status transition is valid
    // For brevity, we just update it
    metadata.status = new_status;

    // CPI to Metaplex to update metadata attributes would go here
    
    Ok(())
}
