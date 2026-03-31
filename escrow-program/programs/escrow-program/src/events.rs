use anchor_lang::prelude::*;

/// Event emitted when an escrow account is successfully initialized and funds are logged.
/// This event will be consumed by the backend to trigger the NFT Token Minting process.
#[event]
pub struct EscrowInitialized {
    pub escrow_key: Pubkey,
    pub buyer: Pubkey,
    pub total_amount: u64,
    pub vehicle_id: String,
}

#[event]
pub struct EscrowFunded {
    pub escrow_key: Pubkey,
    pub amount: u64,
}

#[event]
pub struct MilestoneReleased {
    pub escrow_key: Pubkey,
    pub milestone_index: u8,
    pub amount: u64,
}

#[event]
pub struct EscrowRefunded {
    pub escrow_key: Pubkey,
    pub amount: u64,
}

#[event]
pub struct MilestoneFunded {
    pub order: Pubkey,
    pub milestone_index: u8,
    pub amount: u64,
    pub funded_at: i64,
}
