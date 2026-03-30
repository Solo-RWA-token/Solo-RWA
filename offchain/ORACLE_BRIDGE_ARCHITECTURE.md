# Oracle Bridge Service: High-Level Architecture & Design

## 1. Technology Stack

*   **Language/Framework**: Node.js with TypeScript
*   **Oracle DB Driver**: `node-oracledb`
*   **API Framework**: Fastify
*   **Monitoring**: Prometheus & Grafana
*   **Logging**: Pino

## 2. Architectural Diagram

```mermaid
graph TD
    subgraph "ERP System"
        A[ERP Microservices]
    end

    subgraph "Oracle Bridge Service"
        B[API Layer (Fastify)]
        C[Connection Pool Manager]
        D[Data Transformation Engine]
        E[Query Execution & Optimization]
        F[Error Recovery & Circuit Breaker]
        G[CDC Listener (GoldenGate)]
    end

    subgraph "Oracle Databases"
        H[Oracle DB 1 (12c)]
        I[Oracle DB 2 (19c)]
    end

    A -- REST/GraphQL --> B;
    B --> C;
    C --> E;
    E --> H;
    E --> I;
    D -- Transforms Data --> E;
    F -- Wraps --> E;

    H -- CDC Stream --> G;
    I -- CDC Stream --> G;
    G -- Pushes Data --> A;
```

## 3. Core Components & Logic

1.  **Connection Pooling**:
    *   Uses `node-oracledb`'s built-in connection pool.
    *   Externally configurable min/max connections, timeouts.
    *   Automatic health checks on idle connections.

2.  **Data Transformation Engine**:
    *   Handles bidirectional mapping between JSON and Oracle's relational structure.
    *   Automatic data type conversion.

3.  **Error Recovery & Resiliency**:
    *   **Circuit Breaker**: Trips on database unavailability to prevent overwhelming the DB.
    *   **Retry Logic**: Exponential backoff for transient errors.
    *   **Dead-Letter Queue (DLQ)**: Failed messages are moved to a DLQ for manual inspection.

4.  **Change Data Capture (CDC)**:
    *   Connects to Oracle GoldenGate stream for real-time data synchronization.
    *   Pushes changes to ERP microservices via Kafka events.

5.  **Security**:
    *   TLS 1.3 encryption for all database connections.
    *   Data masking for sensitive fields.
    *   Comprehensive audit trail with correlation IDs.
