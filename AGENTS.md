# Repository Guidelines

## Project Structure & Module Organization
This is a Vite React application written in TypeScript. Application entry points live in `src/main.tsx` and `src/App.tsx`. Global styles are in `src/index.css`; component-level styles are currently in `src/App.css`. Static public files such as icons and favicons belong in `public/`, while imported React assets belong in `src/assets/`. Design and planning references are kept in `DESIGN.md` and `docs/`; avoid mixing generated documentation with runtime source files.

## Build, Test, and Development Commands
Install dependencies with:

```sh
npm install
```

Run the local development server with hot reload:

```sh
npm run dev
```

Create a production build:

```sh
npm run build
```

Run lint checks:

```sh
npm run lint
```

Preview the production build locally:

```sh
npm run preview
```

## Coding Style & Naming Conventions
Use TypeScript, React function components, and ES modules. Match the existing style: two-space indentation, single quotes, no semicolons, and trailing commas where TypeScript formatting already uses them. Name React components in `PascalCase`, hooks and helper functions in `camelCase`, and CSS classes or ids with clear descriptive names. Keep route or feature code grouped under `src/` as the app grows.

## Testing Guidelines
No test runner is configured yet. Before adding tests, choose a Vite-compatible setup such as Vitest with React Testing Library. Place tests beside the code they cover using names like `Component.test.tsx` or under `src/__tests__/`. Until tests exist, run `npm run lint` and `npm run build` before submitting changes.

## Commit & Pull Request Guidelines
No local git history was available to infer an existing commit convention. Use short, imperative commit subjects such as `Add donation event hero` or conventional prefixes such as `feat:`, `fix:`, and `docs:` when useful. Pull requests should include a concise description, validation steps, linked issues when relevant, and screenshots or screen recordings for visible UI changes.

## Security & Configuration Tips
The project includes `@supabase/supabase-js`; keep Supabase URLs, anon keys, and service keys out of source files. Store environment-specific values in local `.env` files and document required variable names without committing secrets.

## Agent-Specific Instructions
After completing meaningful UI, feature, documentation, build, or deployment work, update the single daily report file at `docs/nippo.md`. Keep one consolidated NIPPO document, add the work date inside the file, and summarize completed work, validation commands, changed files, and remaining tasks. Do not create separate NIPPO files unless explicitly requested.
