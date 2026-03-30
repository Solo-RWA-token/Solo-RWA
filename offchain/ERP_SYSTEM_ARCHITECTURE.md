# ERP System: High-Level Architecture & Design

## 1. Technology Stack & Naming Convention

*   **Frontend**: Next.js (`/solo/app`)
*   **Middleware**: Node.js with TypeScript + Fastify (`/solo/offchain`)
*   **Backend-Onchain**: Solana Programs (`/solo/escrow-program`)
*   **Database**: PostgreSQL (Existing)
*   **Cache & Queue**: Redis

## 2. Architectural Principles

*   **Microservices**: Each core ERP module (Inventory, Financials, HR, CRM, Supply Chain) will be an independent microservice.
*   **API-First**: All functionality will be exposed via RESTful and GraphQL APIs.
*   **Event-Driven**: Services will communicate asynchronously via a central message bus (Kafka) to ensure loose coupling and scalability.
*   **CQRS (Command Query Responsibility Segregation)**: We will separate read and write operations to optimize performance. Write operations go to the primary PostgreSQL database, while read-heavy queries can be served by optimized read replicas or even specialized data stores (e.g., Elasticsearch for search).
*   **Multi-Tenancy**: Data will be isolated at the database level using a schema-per-tenant strategy. A shared `public` schema will manage tenant metadata.

## 3. System Diagram

```mermaid
graph TD
    subgraph "User Layer"
        A[Next.js Frontend]
    end

    subgraph "API Gateway & Auth"
        B[API Gateway]
        C["Authentication Service (AuthN/AuthZ)"]
    end

    subgraph "Core ERP Microservices"
        D[Inventory Service]
        E[Financial Service]
        F[HR Service]
        G[CRM Service]
        H[Supply Chain Service]
    end

    subgraph "Data & Eventing Layer"
        I["PostgreSQL (Write DB)"]
        J["PostgreSQL (Read Replicas)"]
        K["Apache Kafka (Event Bus)"]
        L["Redis (Cache)"]
    end

    A --> B;
    B --> C;
    B --> D;
    B --> E;
    B --> F;
    B --> G;
    B --> H;

    D <--> I;
    E <--> I;
    F <--> I;
    G <--> I;
    H <--> I;

    D --> K;
    E --> K;
    F --> K;
    G --> K;
H --> K;

    K --> D;
    K --> E;
    K --> F;
    K --> G;
    K --> H;

    D --> J;
    E --> J;
    F --> J;
    G --> J;
    H --> J;

    D --> L;
    E --> L;
    F --> L;
    G --> L;
    H --> L;
```
