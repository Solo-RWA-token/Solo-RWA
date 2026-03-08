use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount  Transfer};
use solana_program::clock::UnixTimestamp;

declare_id!("QdwyxM7n57uXMNRWFHYjUW6W2H4LzGxCsm6uc7mwDVx");

#[program]
pub mod escrow_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
