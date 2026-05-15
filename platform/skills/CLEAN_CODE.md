# Pragmatic Clean Code Standards

All agents must adhere to these pragmatic coding standards. We value readability, simplicity, and maintainability over cleverness.

## 1. Core Principles
- **SRP (Single Responsibility):** Each function, component, or class must do exactly *one* thing.
- **DRY (Don't Repeat Yourself):** Extract duplicates and reuse code.
- **KISS (Keep It Simple):** Choose the simplest solution that works. Avoid premature abstraction.
- **YAGNI (You Aren't Gonna Need It):** Do not build "just in case" features or helpers that aren't currently used.
- **Boy Scout Rule:** Always leave the codebase cleaner than you found it.

## 2. Naming Conventions
- **Variables:** Must reveal intent (e.g., `activeUserCount` instead of `n` or `count`).
- **Functions:** Use **Verb + Noun** format (e.g., `fetchUserProfile()` instead of `profile()`).
- **Booleans:** Use question forms (e.g., `isActive`, `hasPermission`, `canEdit`).
- **Constants:** Use `SCREAMING_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`).
- **The Golden Rule:** If you need a comment to explain a variable or function, rename it until the comment is obsolete.

## 3. Function Anatomy
- **Size:** Maximum 20 lines; ideally **5–10 lines**.
- **Abstraction:** Maintain exactly one level of abstraction per function.
- **Arguments:** Maximum 3 arguments; prefer **0–2**. Use options objects for 3+ arguments.
- **Side Effects:** Functions must not mutate inputs unexpectedly. Prefer pure functions.

## 4. Code Structure
- **Guard Clauses:** Use early returns (`if (!user) return;`) for edge cases to keep the "happy path" logic flat.
- **Flat > Nested:** Avoid deep nesting. Maximum **2 levels** of indentation.
- **Composition:** Compose small functions together rather than building god-functions.
- **Colocation:** Keep related code (types, styles, tests) physically close to the component that uses them.

## 5. AI Anti-Patterns (What NOT to do)
- **Direct Action:** Write features directly and fix bugs immediately without lengthy explanations.
- **Self-Documentation:** Delete obvious or redundant comments. Let the code document itself.
- **Over-Engineering:** 
  - Don't create helpers for one-liners. Inline them.
  - Don't use factories for only 2 objects.
  - Don't create a `utils.ts` file for a single function. Put it where it's used.
- **No Magic Numbers:** Use named constants for literal values.

## 6. Mandatory Self-Check
Before saving a file or completing a task, verify:
1. **What imports this file?** (Did I break dependents?)
2. **What does this file import?** (Are interfaces maintained?)
3. **Is it tested?** (Does this need a new test case?)
4. **Is it strict?** (Are there any lint or type errors?)
