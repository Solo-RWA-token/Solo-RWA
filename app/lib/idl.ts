export const IDL = {
  "version": "0.1.0",
  "name": "escrow_program",
  "instructions": [
    {
      "name": "initializeEscrow",
      "accounts": [
        { "name": "escrow", "isMut": true, "isSigner": false },
        { "name": "buyer", "isMut": true, "isSigner": true },
        { "name": "seller", "isMut": false, "isSigner": false },
        { "name": "mint", "isMut": false, "isSigner": false },
        { "name": "oracleSigner", "isMut": false, "isSigner": false },
        { "name": "arbitrator", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "vehicleId", "type": "string" },
        { "name": "totalAmount", "type": "u64" },
        { "name": "milestones", "type": { "vec": { "defined": "Milestone" } } }
      ]
    },
    {
      "name": "fundEscrow",
      "accounts": [
        { "name": "escrow", "isMut": true, "isSigner": false },
        { "name": "buyer", "isMut": true, "isSigner": true },
        { "name": "buyerToken", "isMut": true, "isSigner": false },
        { "name": "escrowToken", "isMut": true, "isSigner": false },
        { "name": "mint", "isMut": false, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false },
        { "name": "associatedTokenProgram", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "vehicleId", "type": "string" },
        { "name": "amount", "type": "u64" }
      ]
    },
    {
      "name": "disputeEscrow",
      "accounts": [
        { "name": "escrow", "isMut": true, "isSigner": false },
        { "name": "arbitrator", "isMut": false, "isSigner": true }
      ],
      "args": [
        { "name": "vehicleId", "type": "string" }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Escrow",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "buyer", "type": "publicKey" },
          { "name": "seller", "type": "publicKey" },
          { "name": "totalAmount", "type": "u64" },
          { "name": "depositedAmount", "type": "u64" },
          { "name": "releasedAmount", "type": "u64" },
          { "name": "tokenMint", "type": "publicKey" },
          { "name": "milestones", "type": { "array": [{ "defined": "Milestone" }, 5] } },
          { "name": "oracleSigner", "type": "publicKey" },
          { "name": "arbitrator", "type": "publicKey" },
          { "name": "status", "type": "u8" },
          { "name": "bump", "type": { "array": ["u8", 1] } },
          { "name": "createdAt", "type": "i64" }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Milestone",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "name", "type": { "array": ["u8", 32] } },
          { "name": "releaseBps", "type": "u16" },
          { "name": "completed", "type": "bool" },
          { "name": "completedAt", "type": "i64" }
        ]
      }
    }
  ]
};
