# AI Web App Builder Platform (Cross-Platform Edition)

This platform is designed to work with **any AI assistant** (Cursor, Codex, Gemini CLI, etc.) using the user's **existing AI subscription**.

## 🏗 Architecture

### 1. Dashboard (The UI)
A React-based workspace where the user can see:
- Phase progress (Clarify -> Plan -> Build -> Verify)
- AI Clarification questions and their answers.
- The detailed development plan.
- Real-time agent activity monitor.
- Live preview and console.

### 2. Instruction Layer (The Agents)
The `/agents` folder contains Markdown files for all 16 specialized agents. These files are **Instruction Sets** that tell the host AI exactly how to behave during each phase.

### 3. Sync Layer (The CLI/API)
The host AI uses the `orchestration.ts` commands or the CLI tool to "report" its progress to the dashboard while it writes the actual code for the target application.

## 🚀 How to use in any AI Platform

### In Cursor / Codex / Claude Code
1. Start the platform's local server (`cd server && npm run dev`).
2. Open the platform's dashboard in your browser.
3. In your AI chat, use the `@` symbol or file selection to reference `agents/CLARIFICATION_AGENT.md`.
4. Tell the AI: "Adopt the Clarification Agent role and help me build [Project Name]. Record your questions to the dashboard using the sync commands."

### In Gemini CLI (YOLO)
1. I (Gemini CLI) can adopt these roles automatically by reading the agent files.
2. I will build the app and keep the dashboard updated for you.

## ✅ Benefits
- **Cost Effective:** No separate API keys needed; uses your existing AI tool.
- **Privacy:** Everything runs locally on your machine.
- **Portability:** The same project can be built using different AI models or platforms.
