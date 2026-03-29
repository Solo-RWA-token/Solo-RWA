use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};
use crate::state::{VehicleMetadata, VehicleStatus};

#[derive(Accounts)]
#[instruction(vin: String, model: String, color: String, delivery_est: String)]
pub struct MintVehicleNft<'info> {
    #[account(
        init,
        payer = payer,
        space = VehicleMetadata::SPACE,
        seeds = [b"vehicle_metadata", mint.key().as_ref()],
        bump
    )]
    pub vehicle_metadata: Account<'info, VehicleMetadata>,

    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Metaplex metadata account
    #[account(mut)]
    pub metadata_account: UncheckedAccount<'info>,

    /// CHECK: Metaplex master edition account
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,

    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = payer,
        mint::freeze_authority = payer,
        mint::token_program = token_2022_program,
        extensions::non_transferable::authority = order_pda,
    )]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = order_pda,
    )]
    pub order_nft_account: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK: The buyer wallet
    pub buyer: UncheckedAccount<'info>,

    /// CHECK: The order PDA
    pub order_pda: UncheckedAccount<'info>,

    /// CHECK: Metaplex program
    pub token_metadata_program: UncheckedAccount<'info>,
    pub token_2022_program: Program<'info, anchor_spl::token_2022::Token2022>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn mint_vehicle_nft(
    ctx: Context<MintVehicleNft>,
    vin: String,
    model: String,
    color: String,
    delivery_est: String,
) -> Result<()> {
    let metadata = &mut ctx.accounts.vehicle_metadata;
    metadata.vin = vin;
    metadata.model = model;
    metadata.color = color;
    metadata.status = VehicleStatus::Reserved as u8;
    metadata.order_pda = ctx.accounts.order_pda.key();
    metadata.buyer_wallet = ctx.accounts.buyer.key();
    metadata.delivery_est = delivery_est;
    metadata.bump = [ctx.bumps.vehicle_metadata][0];

    // CPI to Metaplex to create metadata and master edition (omitted for brevity, assume off-chain or full implementation)
    // In a real scenario, we'd use `mpl_token_metadata::instructions::CreateMetadataAccountV3Cpi`
    
    Ok(())
}
