# Verification-Driven Phased Implementation Plan

To ensure the AI Agents build a **Production-Ready** application rather than just a broken MVP, the system operates in strict, sequential phases. 

**CRITICAL RULE:** No agent is permitted to begin the next phase until the Verification Gate for the current phase passes with 100% success.

---

## Phase 1: Clarification & Architecture Strategy
**Goal:** Define exactly what to build and how it will be structured to handle production scale.

- **Tasks:**
  1. `clarification-agent`: Gathers requirements and defines the MVP boundaries.
  2. `planning-agent`: Drafts the technical roadmap, API contracts, and component hierarchy.
  3. `cloud-architect`: Determines the IaC required (AWS/Vercel, Database topology).
- **Verification Gate:** 
  - User reviews and approves the Plan and Architecture.
  - `memory-archivist` records the initial Architectural Decision Records (ADRs).

---

## Phase 2: Infrastructure & Data Layer
**Goal:** Establish the foundation, ensuring it is secure, observable, and scalable.

- **Tasks:**
  1. `database-architect`: Writes Prisma/Drizzle schemas and generates migrations.
  2. `cloud-architect`: Drafts Terraform/Docker compose files for the local and prod environments.
  3. `security-engineer`: Establishes the Secret Management strategy and database encryption rules.
- **Verification Gate:**
  - Database migrations run successfully (`npx prisma migrate dev`).
  - Docker containers spin up without errors (`docker-compose up -d`).

---

## Phase 3: Secure Backend API & Core Logic
**Goal:** Build the business logic and expose it via robust, validated APIs.

- **Tasks:**
  1. `backend-developer`: Implements API routes with Zod validation.
  2. `security-engineer`: Implements Auth middleware and RBAC policies.
  3. `observability-engineer`: Injects Sentry error tracking and Pino structured logging into the API layer.
- **Verification Gate:**
  - `npm run build` on the backend succeeds.
  - Postman/Supertest API Integration tests pass.
  - If it fails, `debugger-agent` is automatically triggered.

---

## Phase 4: Frontend Implementation & Design
**Goal:** Build the user interface with a focus on performance, accessibility, and pixel-perfect design.

- **Tasks:**
  1. `ui-designer`: Establishes the Tailwind v4 design tokens and ShadCN foundation.
  2. `frontend-developer`: Builds the UI components and wires them to the backend APIs using TanStack Query or Server Actions.
  3. `admin-dashboard-agent`: Builds the secure internal management tools.
- **Verification Gate:**
  - `npm run build` on the frontend succeeds (Type checking and Linting pass).
  - Component unit tests (Vitest + Testing Library) pass.
  - If it fails, `debugger-agent` is triggered.

---

## Phase 5: Production Hardening (Quality Gates)
**Goal:** Ensure the application survives contact with real users.

- **Tasks:**
  1. `qa-specialist`: Runs E2E Playwright tests and Axe-core accessibility audits.
  2. `performance-engineer`: Runs Lighthouse audits and bundle analysis.
  3. `security-engineer`: Runs a final OWASP dependency vulnerability scan.
  4. `seo-agent`: Verifies dynamic metadata and sitemap generation.
- **Verification Gate:**
  - E2E Tests: 100% Pass.
  - Lighthouse/Web Vitals: LCP < 2.5s, Accessibility Score >= 90.
  - No critical vulnerabilities found in `npm audit`.

---

## Phase 6: Documentation & Deployment
**Goal:** Ship the product and document it for future developers.

- **Tasks:**
  1. `documentation-specialist`: Generates the README, API Docs, and Setup guides.
  2. `memory-archivist`: Logs the final state of the architecture to the local RAG memory.
  3. `devops-engineer`: Triggers the CI/CD deployment pipeline.
- **Verification Gate:**
  - Deployment is successful.
  - Live production URL returns a 200 OK status on the `/health` endpoint.
