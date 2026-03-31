use anchor_lang::prelude::*;
use crate::state::Order;
use crate::state::OrderStatus;

#[derive(Accounts)]
#[instruction(order_id: String)]
pub struct InitializeOrder<'info> {
    #[account(
        init,
        payer = buyer,
        space = Order::SPACE,
        seeds = [b"order", buyer.key().as_ref(), order_id.as_bytes()],
        bump
    )]
    pub order: Account<'info, Order>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    /// CHECK: Reference to seller
    pub seller: UncheckedAccount<'info>,

    /// CHECK: Reference to currency mint
    pub token_mint: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn initialize_order(
    ctx: Context<InitializeOrder>,
    order_id: String,
    total_amount: u64,
) -> Result<()> {
    let order = &mut ctx.accounts.order;
    order.buyer = ctx.accounts.buyer.key();
    order.seller = ctx.accounts.seller.key();
    order.total_amount = total_amount;
    order.funded_amount = 0;
    order.token_mint = ctx.accounts.token_mint.key();
    order.status = OrderStatus::Created as u8;
    order.bump = ctx.bumps.order;
    order.created_at = Clock::get()?.unix_timestamp;
    order.order_id = order_id;
    order.milestone_count = 0; 

    Ok(())
}
