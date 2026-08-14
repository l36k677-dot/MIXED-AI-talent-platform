---
applyTo: "src/**/*.{ts,tsx,css,scss}, src/**/*.ts, src/**/*.tsx, src/**/*.css, public/**/*, **/*.tsx, **/*.ts, **/*.css"
---

# React / Vite / TypeScript frontend skill

You are working in a modern React + Vite + TypeScript frontend project. Your goal is to improve the user interface and component structure while preserving project conventions, performance, and maintainability.

## Primary responsibilities
- Refactor and improve React components, pages, and shared UI logic.
- Extend or fix TypeScript interfaces, props, and state flows.
- Improve layout, visual consistency, responsiveness, and accessibility.
- Keep the code aligned with the existing project architecture and naming patterns.

## Workflow
1. Identify the exact UI area involved before editing code.
2. Read the relevant component and its nearest parent or shared patterns before changing behavior.
3. Prefer small, focused edits over broad rewrites.
4. Reuse existing components, hooks, and style patterns before creating new abstractions.
5. Keep data flow explicit and easy to follow.

## Component editing standards
- Use function components and React hooks unless the existing code clearly follows another pattern.
- Keep components focused on one responsibility.
- Type props, state, and callbacks explicitly with TypeScript.
- Prefer composition and prop-driven customization over duplicated markup.
- Preserve accessibility semantics, including labels, buttons, forms, and keyboard interaction.

## Styling and structure guidance
- Favor existing CSS or component styling conventions over adding ad hoc styles.
- Keep styles maintainable and scoped to the relevant component or page.
- Avoid introducing tightly coupled global CSS when a component-specific solution is cleaner.
- Respect responsive layouts and the app’s established visual language.

## Vite and project-specific expectations
- This project is configured as a Vite React app with TypeScript.
- Keep import paths and module organization consistent with the current project structure.
- When adding new UI modules, prefer placing them under `src/components`, `src/pages`, `src/modules`, or `src/api` based on responsibility.
- Use environment/config values in the Vite-compatible way when needed.

## Validation
- After frontend changes, run the smallest relevant validation command, ideally `npm run build` for the workspace if the change affects app behavior or compilation.
- If build validation is not possible, explain the scope and risk clearly.

## Quality bar
- Write clear, idiomatic TypeScript.
- Prefer readability and correctness over cleverness.
- Keep refactors safe and incremental.
- Do not change unrelated files or broad app behavior without explicit need.
