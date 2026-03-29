use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("8z8m7n57uXMNRWFHYjUW6W2H4LzGxCsm6uc7mwDVx"); // Placeholder, update with actual ID after build

#[program]
pub mod vehicle_nft_program {
    use super::*;

    pub fn mint_vehicle_nft(
        ctx: Context<MintVehicleNft>,
        vin_hash: [u8; 32],
        model: String,
        color: String,
        delivery_est: String,
    ) -> Result<()> {
        instructions::mint_vehicle_nft(ctx, vin_hash, model, color, delivery_est)
    }

    pub fn update_vehicle_status(ctx: Context<UpdateVehicleStatus>, new_status: u8) -> Result<()> {
        instructions::update_vehicle_status(ctx, new_status)
    }

    pub fn burn_vehicle_nft(ctx: Context<BurnVehicleNft>) -> Result<()> {
        instructions::burn_vehicle_nft(ctx)
    }
}
