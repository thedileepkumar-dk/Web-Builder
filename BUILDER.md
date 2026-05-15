# Web Builder: Website Builder Agent (Production Powered)

This platform uses a **Compound AI System** architecture designed to build full-scale, simple to complex websites through **Verification-Driven Development**. It operates entirely within your AI assistant—there is no SaaS layer and no web dashboard.

## 🚀 The Production Power Stack

### 1. Verification-Driven Execution Loop
Agents no longer "write and hope." They operate under a strict Verification-Driven loop.
Read the `PHASED_IMPLEMENTATION_PLAN.md` to see the 6 strict phases. **No agent can move to the next phase until the Verification Gate (tests, builds, security scans) passes 100%.**

### 2. God Mode Capabilities (Full Autonomy)
- **Autonomous Task Queue:** Agents pull work from the `server/src/cli.ts` bridge directly connected to the local database, allowing multi-agent parallel execution without a background server.
- **Visual Self-Healing:** Agents run Playwright to capture screenshots (`run-visual-audit`) and automatically fix CSS/layout bugs.
- **Infinite Context (RAG):** The `memory-archivist` automatically writes ADRs and updates the `PROJECT_FACT_SHEET.md` to prevent "Architecture Drift" on massive websites.

### 3. The 21 Elite Agents (`/agents`)
We have expanded the website building team to include Enterprise Security, Cloud Architecture, Observability, RAG Memory, TypeScript Architecture, and an autonomous Agents Orchestrator.

#### Core Orchestration & Planning
1.  **`agents-orchestrator`**: The Supreme Conductor. Runs the entire pipeline autonomously with strict QA loops.
2.  **`project-manager`**: Task Decomposition & Backlog Grooming.
3.  **`clarification-agent`**: Requirements & MVP Risk Discovery.
4.  **`planning-agent`**: Technical Architecture & Micro-Tasks.
5.  **`memory-archivist`**: Long-Term RAG Memory & ADRs (Prevents Architecture Drift).

#### Infrastructure & Operations
6.  **`cloud-architect`**: IaC, Terraform, AWS/GCP, and High Availability.
7.  **`devops-engineer`**: Docker, CI/CD, and Automated Pipelines.
8.  **`observability-engineer`**: Telemetry, Sentry, Datadog, and Structured Logging.
9.  **`security-engineer`**: Enterprise Security, Penetration Testing, IAM, and KMS.
10. **`database-architect`**: Schema Integrity & Zero-Downtime Migrations.

#### Development & Product
11. **`ui-designer`**: Design Systems & Accessible UX for beautiful websites.
12. **`frontend-developer`**: React 19 / Next.js 15 / Vue 3.5.
13. **`backend-developer`**: Scalable APIs & Secure Logic.
14. **`admin-dashboard-agent`**: Powerful Internal Tools & CRUD.

#### Quality, Marketing & Polish
15. **`seo-agent`**: Crawlability & Semantic Rich Snippets for website ranking.
16. **`qa-specialist`**: E2E Testing & Quality Gates.
17. **`code-reviewer`**: Architectural Auditing & Bar-Raising.
18. **`debugger-agent`**: RCA & Surgical Repair.
19. **`documentation-specialist`**: Clear, Searchable References.
20. **`performance-engineer`**: Core Web Vitals & Query Tuning.
21. **`typescript-pro`**: Type-First Development & Zero Runtime Gaps.

### 4. Global Platform Registry (`/platform`)
- **Skills (`/platform/skills`)**: Shared knowledge base for consistent code and design quality. Includes:
  - `CORE_SKILLS.md` & `CLEAN_CODE.md` (SRP, DRY, KISS, no over-engineering).
  - `REACT_BEST_PRACTICES.md` (Performance & Bundle Management).
  - `SENIOR_FRONTEND.md` & `SENIOR_BACKEND.md` (Expert implementation guidelines).
  - `UI_UX_PRO_MAX.md` & `FRONTEND_DESIGN.md` (Advanced aesthetics & design tokens).
  - `CODE_REVIEWER.md` & `WEBAPP_TESTING.md` (Quality assurance standards).
  - `SENIOR_ARCHITECT.md` (High-level system design).
- **Automation Hooks**: Self-healing and quality triggers (linting, type-checks).
- **Master Commands**: Unified slash-command language for the build process.

---

## 🛠 Usage Instructions (Autonomous Mode)

### For Host AI (Cursor, Codex, Gemini CLI)
You are part of a continuous, autonomous execution loop. Instead of waiting for user prompts, you pull work directly from the local SQLite database via the CLI and can operate in parallel with other agents.

1. **Check Status**: Run `npx ts-node server/src/cli.ts task-status [projectId]` to view all active and pending tasks, including their dependencies.
2. **Check for Work**: Run `npx ts-node server/src/cli.ts claim-task [projectId] "[Your Agent Name]"`. *Note: The system automatically prevents you from claiming tasks whose dependencies are not yet 'Done'.*
3. **Execute**: If you receive a task, read the description, adopt the persona defined in `/agents`, and execute the work following the `PHASED_IMPLEMENTATION_PLAN.md`.
4. **Verify**: You MUST run the build/test commands before completing the task.
5. **Complete or Fail**: 
   - Success: `npx ts-node server/src/cli.ts complete-task [taskId] "Code generated successfully" "[optional JSON handoff data]"`
   - Failure: `npx ts-node server/src/cli.ts fail-task [taskId] "Build failed with error: ..."` (This automatically triggers the Debugger Agent).
6. **Loop & Parallelize**: Multiple agents (e.g., `frontend-developer` and `backend-developer`) can run this loop simultaneously, claiming independent tasks from the queue. Repeat Step 1 until no tasks remain.

### 🚀 Supreme Autonomy Launch Command
To trigger the entire pipeline to build a website, the user will send this exact prompt to you:

> *"Please spawn an `agents-orchestrator` to execute the complete development pipeline for [Website Idea]. Run the autonomous workflow: Planning → ArchitectUX → [Developer ↔ EvidenceQA task-by-task loop] → Final Validation. Each task must pass QA before advancing."*
