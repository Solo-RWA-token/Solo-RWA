use anchor_lang::prelude::*;

/// Event emitted when an escrow account is successfully initialized and funds are logged.
/// This event will be consumed by the backend to trigger the NFT Token Minting process.
#[event]
pub struct EscrowInitialized {
    /// The public key of the initialized escrow PDA.
    pub escrow_key: Pubkey,
    /// The public key of the buyer who funded the escrow.
    pub buyer: Pubkey,
    /// The amount deposited into the escrow.
    pub amount: u64,
    /// The unique identifier of the vehicle being reserved.
    pub vehicle_id: String,
}

/// Event emitted when an escrow is refunded to the buyer.
#[event]
pub struct EscrowRefunded {
    /// The public key of the refunded escrow PDA.
    pub escrow_key: Pubkey,
}
