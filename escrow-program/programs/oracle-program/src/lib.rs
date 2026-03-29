use anchor_lang::prelude::*;

pub mod instructions;
use instructions::*;

declare_id!("9z8m7n57uXMNRWFHYjUW6W2H4LzGxCsm6uc7mwDVx"); // Placeholder

#[program]
pub mod oracle_program {
    use super::*;

    pub fn submit_milestone(
        ctx: Context<SubmitMilestone>,
        vehicle_id: String,
        milestone_index: u8,
        evidence_hash: [u8; 32],
    ) -> Result<()> {
        instructions::submit_milestone(ctx, vehicle_id, milestone_index, evidence_hash)
    }
}
