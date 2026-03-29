use anchor_lang::prelude::*;

declare_id!("9z8m7n57uXMNRWFHYjUW6W2H4LzGxCsm6uc7mwDVx2Yx");

pub mod instructions;
pub mod events;
pub mod error;

use instructions::*;

#[program]
pub mod oracle_program {
    use super::*;

    pub fn submit_milestone(
        ctx: Context<SubmitMilestone>,
        order_id: String,
        milestone_index: u8,
        is_last_milestone: bool,
    ) -> Result<()> {
        instructions::submit_milestone(ctx, order_id, milestone_index, is_last_milestone)
    }
}
