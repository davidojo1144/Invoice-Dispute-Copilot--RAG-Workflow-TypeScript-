# Invoice Dispute Copilot — RAG Workflow (TypeScript)

Invoice Dispute Copilot is a Turborepo monorepo providing a Fastify-based API and a Next.js web app to manage invoice disputes, run reconciliation jobs in the background via BullMQ, and experiment with a simple Retrieval-Augmented Generation (RAG) workflow for document chunks and queries.

## Features
- Fastify API with endpoints for invoices, disputes, reconciliation job enqueue, DLQ redrive, and a stub search API
- Prisma ORM with PostgreSQL schema including invoices, disputes, documents, embeddings (pgvector), and a DLQ model for failed jobs
- BullMQ queue and worker for reconciliation with exponential backoff, concurrency, and DLQ persistence
- Simple RAG pipeline with text chunking, a deterministic dummy embedder, and cosine similarity search
- Unit tests (Jest) for RAG behavior
- k6 load test targeting the reconciliation API
- Dockerfiles for API and Web, and `compose.yaml` to run Postgres, Redis, API, and Web together
- GitHub Actions CI workflow that runs install, typecheck, lint, and API tests

## Monorepo Layout
- `apps/api` — Fastify API server, Prisma schema, BullMQ worker, RAG utilities
- `apps/web` — Next.js web application
- `packages/eslint-config` — Common ESLint rules used across the repo
- `packages/tsconfig` — Shared TypeScript configuration referencing `tsconfig.base.json`
- Root scripts for OpenAPI/GraphQL code generation and load testing

## Quickstart
### Prerequisites
- Node.js 20+
- Optional: Docker if you want to use `docker compose`
- Optional: Local Postgres and Redis if not using Compose

### Environment
Copy `.env.example` to `.env` and adjust values as needed:
- `DATABASE_URL=postgres://user:password@localhost:5432/idc`
- `REDIS_URL=redis://localhost:6379`
- `HOST=0.0.0.0`
- `PORT=4000`
- `S3_BUCKET=local-bucket`

### Install and Generate
```bash
npm install
npm run prisma:generate -w @idc/api
```

### Migrate and Seed (optional)
```bash
npm run prisma:migrate -w @idc/api
npm run db:seed -w @idc/api
```

### Run in Dev
```bash
# API
npm run dev -w @idc/api
# Web
npm run dev -w @idc/web
```
- API health: http://localhost:4000/health
- Web app: http://localhost:3000/

If `REDIS_URL` is not set, the BullMQ worker is disabled; core API routes still run.

## Core Commands
- `npm run typecheck` — Run TypeScript checks across packages
- `npm run lint` — Lint across packages
- `npm run gen:api` — OpenAPI and GraphQL code generation for the web app
- `npm run test -w @idc/api` — Run API tests (Jest)
- `npm run load:k6` — Run k6 reconciliation load script
- `npm run rag:eval -w @idc/api` — Run the RAG evaluation harness

## API Endpoints
- `GET /invoices` — List invoices (`apps/api/src/routes.ts:6`)
- `GET /disputes` — List disputes (`apps/api/src/routes.ts:20`)
- `POST /disputes/:id/reconcile` — Enqueue reconciliation job (`apps/api/src/routes.ts:35`)
- `POST /dlq/:id/redrive` — Redrive a DLQ job (`apps/api/src/routes.ts:56`)
- `GET /search?query=...` — Stub search (returns empty hits) (`apps/api/src/routes.ts:75`)

Example:
```bash
curl -X POST http://localhost:4000/disputes/inv_123/reconcile \
  -H "Content-Type: application/json" \
  -d '{"version":1}'
```

## Background Processing (BullMQ)
- Queue and worker defined in `apps/api/src/queue/reconcile.ts`
- Concurrency `8` and rate limiter configured
- On final failure, job payload is written to `ReconcileDLQ` (`apps/api/prisma/schema.prisma:90`)
- DLQ entries can be redriven via `POST /dlq/:id/redrive`
- Worker is conditionally started only if `REDIS_URL` is set (`apps/api/src/index.ts:32`)

## Data Layer (Prisma)
- Schema at `apps/api/prisma/schema.prisma`
- Models include `Tenant`, `Vendor`, `Invoice`, `InvoiceLineItem`, `Dispute`, `Document`, `Embedding`, and `ReconcileDLQ`
- `Embedding.vector` uses `Unsupported("vector")` for pgvector; seed sets `vector` as `undefined` pending ingestion

## RAG Pipeline
- Chunking/embedding/similarity:
  - `apps/api/src/rag/pipeline.ts`
  - `apps/api/src/rag/embedder.ts`
  - `apps/api/src/rag/similarity.ts`
- Unit test: `apps/api/test/rag.test.ts:1`
- Evaluation harness: `apps/api/scripts/rag-eval.ts`
  - Reports simple accuracy across toy queries

## Load Testing (k6)
- Script: `apps/api/k6/reconcile.js`
- Run while API is up:
```bash
npm run load:k6
```

## Docker and Compose
- API Dockerfile: `apps/api/Dockerfile`
- Web Dockerfile: `apps/web/Dockerfile`
- Compose: `compose.yaml`
```bash
docker compose up --build
```
Services:
- `postgres` on `5432`
- `redis` on `6379`
- `api` on `4000`
- `web` on `3000`

## CI/CD
- Workflow: `.github/workflows/ci.yml`
- Steps:
  - Install
  - Typecheck
  - Lint
  - API tests

## Notes
- Secrets are not committed. Configure `.env` or environment variables in CI/Compose.
- `Embedding.vector` handling for pgvector should be implemented via native SQL or Prisma extensions in ingestion.
