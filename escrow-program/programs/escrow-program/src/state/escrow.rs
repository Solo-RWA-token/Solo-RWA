use anchor_lang::prelude::*;
use anchor_spl::token::{Mint,Token, TokenAccount, Transfer};

#[derive(Account)]
#[instruction(vechile_id: String)]
pub struct InitializeEscrow {
    #[account(
        init,
        payer = buyer,
        space = Escrow::SPACE,
        seeds =[ b "escrow", buyer.key().as_ref(), vechile_id.as_bytes()],
        bump,
    )]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub buyer: Signer<'info>
    pub seller: SystemAccount<'info>,
    #[account(mut)]
    pub buyer_token:Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        psyer = buyer,
        associated_token:mint = mint,
        associated_token::authority = escrow
    )]
    pub escrow_token: Account<'info TokenAccount>,
    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, system>
}

#[derive(Accounts)]
pub struct RefundEscrow<'info> {
    #[account(
        mut,
        seeds = [b "escrow", escrow.buyer.as_ref(), vechile_id.as_bytes()],
        bump =escrow.bump
    )]
    pub escrow: Account<'info, Escrow>
    #[account(mut)]
    pub escrow_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub buyer_token:Account<'info, TokenAccount,
    pub token_program: Program<'info, Token>
}

