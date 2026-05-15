# Global AI Agent Skills

## 🎨 UI/UX Design System Skill
- Use **Vanilla CSS** or **Tailwind CSS v4** for styling.
- **Rule 1:** Maintain consistent 4px/8px grid spacing.
- **Rule 2:** Use a "Premium SaaS" palette: Deep grays (#1f2937), primary indigo (#6366f1), and semantic status colors.
- **Rule 3:** All interactive elements must have clear hover/active states.
- **Rule 4:** Implement full responsive design using container queries where possible.

## 🛠 React Best Practices Skill
- **Rule 1:** Prefer functional components with hooks.
- **Rule 2:** Use **Zod** for all form and API validation.
- **Rule 3:** Implement "Skeleton Screens" for all loading states.
- **Rule 4:** Strict TypeScript usage (no `any`, use proper interfaces).

## 🔒 Security First Skill
- **Rule 1:** Never hardcode secrets. Use `.env` with validation.
- **Rule 2:** Implement RBAC (Role-Based Access Control) at the middleware level.
- **Rule 3:** Sanitize all user inputs before database entry.
- **Rule 4:** Use secure headers (CORS, CSP, etc.).

## 📊 Database Optimization Skill
- **Rule 1:** Always use indexes for frequently queried columns.
- **Rule 2:** Use Prisma/Drizzle transactions for multi-row updates.
- **Rule 3:** Implement soft-deletes where data history is important.
- **Rule 4:** Automated migrations with rollbacks.
