# React Best Practices Skill

## Overview
A performance-centric guide for React and Next.js development.

## Core Rules & Principles
- **Performance:** Enforce 40+ rules specifically designed to eliminate "waterfalls" and optimize rendering.
- **Bundle Management:** Focus on reducing bundle sizes and improving Core Web Vitals (LCP, CLS, INP).
- **Refactoring:** Apply strict patterns when reviewing performance or refactoring legacy React components.

## Execution Guidelines
1. Avoid layout thrashing by explicitly defining image dimensions.
2. Use dynamic imports (`next/dynamic` or `React.lazy`) for heavy components below the fold.
3. Minimize client-side JavaScript by maximizing the use of Server Components.
