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
    /// Triggered when the order is in an invalid state for the requested operation.
    #[msg("Invalid order state for this operation.")]
    InvalidOrderState,
    /// Triggered when the milestones' basis points do not sum to 10000.
    #[msg("Milestone basis points must sum to 10000 (100%).")]
    InvalidMilestones,
    /// Triggered when an unauthorized oracle tries to submit a milestone.
    #[msg("Unauthorized oracle signer.")]
    UnauthorizedOracle,
    /// Triggered when a milestone is already completed.
    #[msg("Milestone already completed.")]
    MilestoneAlreadyCompleted,
    /// Triggered when an unauthorized arbitrator tries to dispute an escrow.
    #[msg("Unauthorized arbitrator signer.")]
    UnauthorizedArbitrator,
    /// Triggered when a milestone has already been funded.
    #[msg("Milestone already funded.")]
    MilestoneAlreadyFunded,
    /// Triggered when the funding amount does not match the milestone target.
    #[msg("Incorrect funding amount for this milestone.")]
    IncorrectFundingAmount,
    /// Triggered when a numerical overflow occurs.
    #[msg("Numerical overflow.")]
    NumericalOverflow,
}
