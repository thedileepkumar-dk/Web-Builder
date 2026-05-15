# Webapp Testing Skill

## Overview
A testing-focused toolkit for interacting with and verifying local web applications using Playwright and Vitest.

## Core Rules & Principles
- **Verification:** Verify frontend functionality and debug complex UI behavior.
- **Evidence:** Capture browser screenshots and view browser logs for error diagnosis.
- **Environment:** Primarily used for end-to-end (E2E) testing in local or CI/CD environments.

## Execution Guidelines
1. Always write tests focusing on user behavior rather than implementation details (use ARIA roles).
2. Automate visual regression testing for critical UI components.
3. Fail the build if test coverage drops below the required threshold (e.g., 85%).
