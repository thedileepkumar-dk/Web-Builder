# AI Automation Hooks

## 🏗 Pre-Task Hooks
- **`sync-dashboard`:** Before starting any agent task, update the dashboard status to "Running".
- **`context-refresh`:** Read the latest `GEMINI.md` and `BUILDER.md` to ensure project alignment.
- **`secret-scan`:** Scan the current directory for leaked API keys before writing new code.

## 🚀 Post-Task Hooks
- **`lint-on-save`:** Run `npm run lint` after generating new code files.
- **`type-check`:** Run `tsc --noEmit` to verify type safety.
- **`auto-test`:** If a test file exists for the modified code, run `npm test`.
- **`commit-summary`:** Generate a concise summary of changes for the project log.

## ⚠️ Error Hooks
- **`fallback-debugger`:** If a build fails, automatically trigger the `DEBUGGER_AGENT` to analyze the log.
- **`revert-on-fail`:** If a critical test fails, suggest reverting the latest file change.
