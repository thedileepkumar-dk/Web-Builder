# 🚀 Web Builder: The Ultimate Website Builder Agent

Web Builder is a **Powerful Website Builder Agent** that seamlessly integrates into your existing AI coding assistant (Cursor, Claude Code, Gemini CLI, Codex). 

Unlike SaaS platforms (such as Lovable or v0) that require you to build within a proprietary browser window, Web Builder installs directly into your local editor. It transforms your basic AI into an elite, 21-agent web development team capable of building anything from a simple landing page to an incredibly complex, production-ready web application from a single prompt.

**Note:** This is an open-source agent framework, not a SaaS project. There is no web dashboard. The orchestration happens entirely within your AI assistant and your terminal.

---

## 🌟 Key Features

### 🤯 Simple to Complex Websites from One Prompt
Give your AI a single prompt. Web Builder's orchestrator takes over, automatically breaking the prompt down, clarifying requirements, and delegating the work to specialized agents (Frontend, Backend, Database, SEO) to build the entire site locally.

### 🧠 21 "Super Powered" Elite Agents
Instead of a single AI trying to do everything, Web Builder provides specialized Markdown Instruction Sets for 21 distinct roles:
- **`agents-orchestrator`**: The Mastermind. Runs the Dev ↔ QA continuous loop.
- **`cloud-architect`**: Designs high-availability AWS/Vercel infrastructure.
- **`ui-designer`**: Generates stunning UI layouts and Tailwind v4 design tokens.
- **`frontend-developer`**: Builds robust React/Vue/Angular components.
- **`memory-archivist`**: Maintains Long-Term RAG memory to prevent architecture drift on complex sites.
- *...and 16 more domain experts.*

### ⚡ "God Mode" Capabilities
- **Autonomous Task Queue:** A serverless Node.js/Prisma CLI orchestrates tasks directly via a local SQLite database. Agents pull work, execute, and pass data to the next agent autonomously without needing a background server running.
- **Visual Self-Healing:** The platform integrates **Playwright**. If a UI test fails or layout breaks, the QA agent captures a screenshot and hands it to the Designer agent to autonomously fix CSS and layout bugs.

### 🛡️ Strict Quality Gates
Code is never accepted just because the AI generated it. Every task goes through a strict **[Dev ↔ EvidenceQA] Loop**. No task advances until automated tests, linting, and accessibility audits (WCAG 2.2) pass with 100% success.

---

## 📦 One-Command Installation

To install the framework, dependencies, database, and platform-specific configurations (`.cursorrules`, `.claudecode`, etc.), navigate to the project directory and run the installation script:

```bash
cd path/to/Web-Builder
sh install.sh
```

---

## 🚀 How to Use

You don't need a separate API key or a web dashboard. Forge AI uses the AI assistant you are already running in your editor. It runs 100% serverless on top of a local SQLite database.

1. **Call the Orchestrator in your AI Chat:**
   Open your AI Chat (e.g., in Cursor, Claude Code, or Gemini CLI) and call the orchestrator using your platform's native mention syntax (usually `/`, `$`, or `@`). For example, type `@agents-orchestrator` and paste the following command:

   > *"Execute the complete development pipeline for [Your Website Idea]. Run the autonomous workflow: Planning → ArchitectUX → [Developer ↔ EvidenceQA task-by-task loop] → Final Validation. Each task must pass QA before advancing."*

The AI will immediately read the instruction files, adopt the Orchestrator persona, and begin delegating tasks to the other 20 agents, building your website autonomously.

---

## 📂 Directory Structure

- `/agents`: The 21 Markdown instruction sets that define the personas and rules for the AI team.
- `/platform/skills`: Global rulebooks (Clean Code, React Best Practices, UI/UX Design Systems).
- `/platform/commands`: Master slash-commands for manual AI control.
- `/platform/hooks`: Automated scripts (Lint-on-save, security scans).
- `/server`: The local CLI logic and Prisma database schemas.
- `BUILDER.md`: The master manual for the host AI.
- `PHASED_IMPLEMENTATION_PLAN.md`: The strict 6-phase verification logic.

---

*Built for the era of Autonomous Website Building.*