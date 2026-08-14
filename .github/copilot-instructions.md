# Frontend workspace guidance

This workspace contains a Vite + React + TypeScript frontend. Prioritize UI correctness, component reuse, and maintainable structure when changing screens, layout, or interactions.

## Project conventions
- Keep feature code under `src/components`, `src/pages`, `src/modules`, `src/api`, and `src/assets`.
- Prefer small, composable components over large monolithic screens.
- Use typed props and explicit interfaces for shared UI components.
- Preserve existing design patterns and naming conventions before introducing new abstractions.
- Keep styles colocated or consistent with existing CSS/Tailwind patterns already used in the app.

## React/Vite workflow
- Prefer functional components and hooks for stateful logic.
- Keep state as local as possible; lift it only when multiple components need it.
- Avoid unnecessary re-renders and prefer memoization only when the code clearly benefits from it.
- Prefer clean, declarative rendering over imperative DOM manipulation.
- Keep forms, event handlers, and data-fetch logic readable and typed.

## UI quality and safety
- Validate that changes still work with the app’s routing, layout, and responsive behavior.
- Preserve accessibility: labels, keyboard interactions, focus states, and semantic HTML.
- Do not introduce brittle CSS selectors or global styles unless the current pattern requires it.
- Anticipate reusability and maintainability when refactoring components.

## Validation
- For frontend changes, prefer running the project’s relevant validation command, such as `npm run build` or a targeted Vite check, before concluding work.
- If a change only affects a single component or page, keep the implementation scoped and explain the impact clearly.

## Working style
- Make the smallest safe change that satisfies the task.
- If a refactor is needed, isolate it to the specific UI area and keep imports, props, and state changes consistent.
- Favor explicit, simple code over clever abstractions.
