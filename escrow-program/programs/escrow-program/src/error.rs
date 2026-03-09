use anchor_lang::prelude::*;

/// Custom error codes for the Escrow Program.
#[error_code]
pub enum ErrorCode {
    /// Triggered when the deposited amount is less than the required minimum down payment.
    #[msg("Amount must be greater than or equal to the minimum down payment.")]
    InsufficientAmount,
    /// Triggered when an unsupported token mint is provided.
    #[msg("Invalid token mint. Only accepted token mints are allowed.")]
    InvalidToken,
    /// Triggered when attempting to refund an escrow that has already been released to the seller.
    #[msg("Escrow has already been released or refunded.")]
    AlreadyReleased,
    /// Triggered when the escrow is in an invalid state for the requested operation.
    #[msg("Invalid escrow state for this operation.")]
    InvalidEscrowState,
}
