# tableaucolours-react

A partial React/TypeScript port of my Vue/JavaScript [tableaucolours](https://github.com/gentlygently/tableaucolours) web app, a Tableau colour palette editor.

## Features

- Create and edit colour palettes with support for Regular, Sequential, and Diverging types
- Import and export palettes in Tableau XML format
- Extract colours from uploaded images
- Interactive colour picker with zoom functionality
- Real-time palette preview

## Tech Stack

- **Framework**: React 19 with TypeScript (strict mode)
- **Build Tool**: Vite
- **State Management**: Redux Toolkit 2.x
- **Testing**: Vitest (unit tests) + Playwright (E2E tests)
- **Styling**: LESS
- **Package Manager**: Yarn

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- Yarn package manager

### Installation

```bash
yarn install --immutable --immutable-cache --check-cache
```

### Development

```bash
yarn dev          # Start development server at http://localhost:5173
yarn lint         # Type-check and lint code
yarn lint:fix     # Auto-fix lint and formatting issues
yarn build        # Build production bundle
yarn preview      # Preview production build locally
```

## Testing

This project has comprehensive test coverage with both unit tests and end-to-end tests.

### Unit Tests (Vitest)

Unit tests are co-located with source files (e.g., `Component.test.tsx` next to `Component.tsx`).

```bash
yarn test         # Run all unit tests once
yarn test:watch   # Run tests in watch mode during development
```

### End-to-End Tests (Playwright)

E2E tests are located in the `e2e/` directory and cover complete user workflows across three browsers (Chromium, Firefox, WebKit).

#### Running E2E Tests

```bash
# Run all E2E tests (headless, all browsers)
yarn test:e2e

# Run with visible browsers (for debugging)
yarn test:e2e:headed

# Run specific browser only
yarn test:e2e --project=chromium
yarn test:e2e --project=firefox
yarn test:e2e --project=webkit

# Open Playwright UI mode (interactive test runner)
yarn test:e2e:ui

# Run in debug mode with inspector
yarn test:e2e:debug

# View HTML test report from last run
yarn test:e2e:report
```

#### E2E Test Coverage

The E2E test suite includes 27 tests covering:

- **Smoke tests**: Basic application loading and initialization
- **Palette editing**: Creating palettes, adding/removing colours, naming
- **Import/Export**: XML import validation, export functionality, code generation
- **Palette types**: Switching between Regular, Sequential, and Diverging types
- **Image features**: Image upload, colour extraction, zoom controls

**Browser Support:**

- ✅ Chromium: 27/27 tests passing
- ✅ Firefox: 27/27 tests passing
- ⚠️ WebKit: 18/27 tests passing (9 modal tests fail due to known Playwright limitation with `<dialog>` element visibility detection)

#### Writing E2E Tests

E2E tests follow these conventions:

1. **Test files**: Place in `e2e/` directory with `*.spec.ts` naming
2. **Page objects**: Use `e2e/pages/ColourPalettePage.ts` for reusable interactions
3. **Test structure**:

   ```typescript
   import {test, expect} from './fixtures/base'

   test.describe('Feature name', () => {
     test('should do something when condition', async ({page, colourPalettePage}) => {
       await colourPalettePage.goto()
       // test steps...
       await expect(page.locator('selector')).toBeVisible()
     })
   })
   ```

4. **Selectors**: Prefer `data-testid` attributes for stable selectors
5. **Page objects**: Add reusable methods to `ColourPalettePage` class

#### Troubleshooting E2E Tests

**Browser windows opening during tests:**

- Tests run headless by default. If browsers open, check `playwright.config.ts` has `headless: true`

**Tests taking too long:**

- Run specific browser with `--project=chromium` flag
- Use `test:e2e:ui` mode to debug specific tests

**WebKit modal failures:**

- This is a known Playwright limitation with native `<dialog>` elements
- Chromium and Firefox provide full test coverage
- WebKit tests are kept for when Playwright addresses this issue

**Installation issues:**

- Run `npx playwright install --with-deps` to install/update browser binaries

## CI/CD

The project uses GitHub Actions for continuous integration. On each push:

1. Dependencies are installed
2. Code is linted and type-checked
3. Production build is created
4. Unit tests are executed
5. E2E tests run across all browsers
6. Test artifacts are uploaded on failure

See `.github/workflows/ci.yml` for the complete pipeline.

## Project Structure

```
tableaucolours-react/
├── e2e/                    # Playwright E2E tests
│   ├── fixtures/          # Test fixtures and setup
│   ├── pages/             # Page object models
│   ├── utils/             # E2E test utilities
│   └── *.spec.ts          # Test files
├── src/
│   ├── components/        # React components (with .test.tsx)
│   ├── stores/           # Redux store and slices
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── testing/          # Test setup and utilities
│   └── assets/           # Static assets
├── playwright.config.ts   # Playwright configuration
├── vite.config.ts        # Vite and Vitest configuration
└── package.json          # Dependencies and scripts
```

## License

See LICENSE file.
