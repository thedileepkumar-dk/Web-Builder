# Master AI Commands

## 🏗 Planning Commands
- `/clarify [prompt]` - Analyze prompt and trigger Clarification Agent.
- `/plan` - Generate a technical roadmap after clarification is complete.
- `/approve` - Confirm the plan and trigger multi-agent orchestration.

## 💻 Development Commands
- `/gen-component [name]` - Generate a specialized ShadCN UI component.
- `/gen-api [route]` - Create a secure backend route with validation.
- `/gen-schema [table]` - Add a new table to the Prisma schema.

## 🔍 Quality Commands
- `/lint` - Run the linter and fix errors.
- `/test` - Run all automated tests.
- `/audit` - Run a security scan of dependencies and code.

## 🛠 Orchestration Commands
- `/status` - Get a summary of all running agents and their progress.
- `/fix-errors` - Trigger the Debugger Agent to scan build logs and apply fixes.
- `/deploy-preview` - Prepare the app for a Vercel/Render preview deployment.
