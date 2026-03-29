use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum VehicleStatus {
    Reserved = 0,
    InProduction = 1,
    ReadyForDelivery = 2,
    Delivered = 3,
    Cancelled = 4,
}

#[account]
pub struct VehicleMetadata {
    pub mint: Pubkey,
    pub vin: String,
    pub model: String,
    pub color: String,
    pub status: u8, // Using u8 to map to VehicleStatus
    pub order_pda: Pubkey,
    pub buyer_wallet: Pubkey,
    pub delivery_est: String,
    pub bump: u8,
}

impl VehicleMetadata {
    pub const SPACE: usize = 8 + 32 + (4 + 64) + (4 + 32) + (4 + 32) + 1 + 32 + 32 + (4 + 32) + 1;
}
