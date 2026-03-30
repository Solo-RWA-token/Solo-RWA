# Middleware Architecture

This document outlines the architecture for the off-chain middleware services that support the SRWA platform.

## 1. Core Responsibilities

*   **API Gateway**: Provide a single, unified entry point for the frontend.
*   **Authentication & Authorization**: Manage user sessions and role-based access.
*   **Data Indexing**: Read data from the Solana blockchain and store it in PostgreSQL for efficient querying.
*   **Business Logic**: Execute complex business logic that is not suitable for on-chain execution.

## 2. Simplified Architecture (Hackathon Scope)

For the current phase, we will use a simplified, monolithic approach for the middleware, using Node.js and Fastify.

```mermaid
graph TD
    A[Frontend (Next.js)] --> B[Middleware (Node.js/Fastify)];
    B <--> C[PostgreSQL Database];
    B --> D[Backend-Onchain (Solana)];
    D -- Events --> B;
```

## 3. Data Flow

1.  **Write Operations**: The frontend sends API requests to the Middleware.
2.  **On-Chain Interaction**: The Middleware constructs and sends transactions to the Backend-Onchain (Solana programs).
3.  **Event Indexing**: The Middleware listens for events emitted by the Solana programs.
4.  **Database Update**: Upon receiving an on-chain event, the Middleware updates the PostgreSQL database.
5.  **Read Operations**: The frontend queries the Middleware's API, which reads the indexed and consolidated data from PostgreSQL.
