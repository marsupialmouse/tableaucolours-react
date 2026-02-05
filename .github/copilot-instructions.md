# Copilot Coding Instructions for tableaucolours-react

## Repository Overview

**tableaucolours-react** is a React/TypeScript application—a port of a Tableau colour palette editor. It provides web-based colour palette creation, management, and editing with support for colour extraction from images and palette import/export.

- **Type**: React web application
- **Language**: TypeScript (strict mode enabled)
- **Build System**: Vite
- **Test Frameworks**: Vitest (unit tests), Playwright (E2E tests)
- **Package Manager**: Yarn
- **Node.js Version**: 22.x (defined in CI/CD)

## Core Build & Validation Process

Always follow this sequence when validating changes:

1. **Install dependencies** (required before any other step):

   ```
   yarn install --immutable --immutable-cache --check-cache
   ```

   This ensures the locked dependency set in `yarn.lock` is used.

2. **Type-check and lint**:

   ```
   yarn lint
   ```

   This runs both TypeScript type-checking and ESLint. The build fails on any warning (max-warnings=0). Never proceed if this fails.

3. **Build**:

   ```
   yarn build
   ```

   Produces optimized production bundle in the `dist/` directory. Must complete without errors.

4. **Run tests**:

   ```
   yarn test
   ```

   Executes the full unit test suite in non-watch mode. All tests must pass.

5. **Run E2E tests** (optional, slower):
   ```
   yarn test:e2e
   ```
   Executes end-to-end tests with Playwright across Chromium, Firefox, and WebKit browsers. Run these when testing full user workflows or before major releases.

**These steps are defined in**:

- `package.json` — `scripts` section defines all npm tasks
- `.github/workflows/ci.yml` — GitHub Actions workflow; shows exact command sequence for CI validation
- Always consult `.github/workflows/ci.yml` as the authoritative validation pipeline

## Understanding the Codebase Structure

### Discovering Key Information

When you need to understand the project structure or configuration:

- **All npm/yarn scripts**: Check `package.json` → `scripts` section
- **Build configuration**: See `vite.config.ts`
- **TypeScript configuration**: See `tsconfig.json` and referenced configs (`tsconfig.app.json`, `tsconfig.node.json`)
- **Linting rules**: See `eslint.config.js`
- **Test setup**: See `vite.config.ts` (test config) and `src/testing/test-setup.ts`
- **Type definitions**: Look in `types/` directory and `@types/` in node_modules
- **Path aliases**: Defined in `tsconfig.app.json` under `compilerOptions.paths`—use these in imports

### Directory Organization

```
src/
├── components/        # React components (each may have corresponding .test.tsx)
├── stores/           # Redux store and slices
├── utils/            # Utility functions and helpers
├── types/            # Custom TypeScript type definitions
├── testing/          # Test utilities and setup
├── assets/           # Static assets
├── App.tsx           # Root component
├── main.tsx          # Application entry point
└── *.less            # Stylesheet files

e2e/
├── fixtures/         # Playwright test fixtures
├── pages/            # Page object models for E2E tests
├── utils/            # E2E test utilities
└── *.spec.ts         # E2E test files
```

**Use path aliases when importing from src/**:  
Prefer `import { Component } from 'components/...'` over `import { Component } from '../../components/...'`

### Configuration Files

- `vite.config.ts` — Vite build config and Vitest test config
- `playwright.config.ts` — Playwright E2E test configuration
- `eslint.config.js` — ESLint rules (strict TypeScript, React/Hooks rules, Prettier integration)
- `.prettierrc` — Code formatting rules (integrated with ESLint)
- `.github/workflows/ci.yml` — CI validation steps

### Testing Organization

**Unit Tests (Vitest):**

- Test files are co-located with source files: `ComponentName.tsx` has `ComponentName.test.tsx`
- All tests use Vitest configured in `vite.config.ts`
- Test environment is jsdom (browser-like environment)
- Setup file: `src/testing/test-setup.ts` runs before all tests

**E2E Tests (Playwright):**

- Test files are in `e2e/` directory with `*.spec.ts` naming convention
- Configured in `playwright.config.ts`
- Run on 3 browsers: Chromium, Firefox, WebKit (headless by default)
- Page object models in `e2e/pages/` for reusable interactions
- Test fixtures in `e2e/fixtures/` for setup/teardown

## Language & Framework Standards

### TypeScript

- **Strict mode is enabled**: `strict: true`
- **Unused variables/parameters are errors**: `noUnusedLocals` and `noUnusedParameters` enabled
- **Target**: ES2020 for app code, ES2022 for build tools
- **Module format**: ESNext
- Do not suppress TypeScript errors unless absolutely necessary and documented

### React

- React 19 with modern hooks API
- Functional components only
- Use Redux Toolkit (via `@reduxjs/toolkit`) for state management
- Use Redux hooks: `useSelector`, `useDispatch` (not connect HOC)

### State Management

- Redux Toolkit 2.x with `createSlice` pattern
- Immer middleware enabled automatically; use mutable update patterns in reducers
- Use `use-immer` hook where appropriate for component state

### Styling

- LESS preprocessor used for stylesheets
- Global styles in `src/App.less`
- Variables in `src/variables.less`

## Commands & Utilities

| Command                                                    | Purpose                                                |
| ---------------------------------------------------------- | ------------------------------------------------------ |
| `yarn install --immutable --immutable-cache --check-cache` | Install locked dependencies (always use this flag set) |
| `yarn lint`                                                | Type-check and lint code                               |
| `yarn lint:fix`                                            | Auto-fix lint/format issues                            |
| `yarn build`                                               | Create production build                                |
| `yarn test`                                                | Run unit tests once                                    |
| `yarn test:watch`                                          | Run unit tests in watch mode                           |
| `yarn test:e2e`                                            | Run E2E tests (headless, all browsers)                 |
| `yarn test:e2e:headed`                                     | Run E2E tests with visible browsers (debugging)        |
| `yarn test:e2e:ui`                                         | Open Playwright UI mode for interactive test running   |
| `yarn test:e2e:debug`                                      | Run E2E tests in debug mode with inspector             |
| `yarn test:e2e:report`                                     | Open HTML test report from last E2E run                |
| `yarn dev`                                                 | Start dev server                                       |
| `yarn preview`                                             | Preview production build locally                       |

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) is the source of truth for validation steps. It:

1. Checks out code
2. Sets up Node.js 22.x
3. Installs dependencies
4. Runs linting
5. Builds the application
6. Runs the test suite

**Your PRs must pass this exact sequence.** Validate locally using the commands in the [Core Build & Validation Process](#core-build--validation-process) section before pushing.

## Code Change Guidelines

- **Always run `yarn install` first** when you modify dependencies
- **Run `yarn lint:fix`** to auto-correct formatting before testing
- **Run `yarn test`** to verify unit tests pass before committing
- **Run `yarn test:e2e`** before major releases or when changing critical user flows
- **Keep type safety high**: Never use `any` unless unavoidable; TypeScript errors are intentional barriers
- **Update tests** when modifying components or utilities
- **Follow existing patterns**: Look at similar components/utilities in the codebase for style and structure
- **No console.log in production code**: Use logging utilities if needed

### Testing Strategy

**When to write unit tests (Vitest):**

- Component rendering logic
- User interactions (clicks, inputs, form submissions)
- State management and Redux slices
- Utility functions and helpers
- Edge cases and error handling

**When to write E2E tests (Playwright):**

- Complete user workflows (create palette → add colours → export)
- Multi-step processes
- Integration between multiple components
- Browser-specific behavior
- Visual regression testing needs

**E2E Test Conventions:**

- Use page object models for reusable component interactions
- Name tests descriptively: "should [action] when [condition]"
- Tests run headless by default (no browser windows)
- Use `--headed` flag to see browsers during development
- E2E tests are slower—keep the suite focused on critical paths

---

**Trust these instructions.** They describe how to discover and validate information in the codebase rather than hardcoding current state. If you need to understand how something works or where to find something, refer to the sections above. Only perform searches if the guidance here doesn't lead you to the answer.
