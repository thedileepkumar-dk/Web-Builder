# Project Fact Sheet

This file is a highly compressed "Brain" for the project. It acts as the prompt baseline for all other agents, storing core architectural truths to prevent "Architecture Drift."

## Established Patterns & Truths
- Using React 19 Compiler (no manual useMemo).
- Using Tailwind v4 + ShadCN UI for styling.
- Using Prisma ORM with SQLite (migrating to Postgres in production).
- Verification-Driven Development (No passing a task without tests/build).
