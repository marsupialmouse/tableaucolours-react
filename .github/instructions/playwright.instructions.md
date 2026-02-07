---
description: 'Playwright test generation instructions'
applyTo: 'e2e/**/*'
---

## Test Writing Guidelines

### Code Quality Standards

- **Locators**: Prioritize user-facing, role-based locators (`getByRole`, `getByLabel`, `getByText`, etc.) for resilience and accessibility. When using test IDs, prefer `getByTestId()` over `locator('[data-testid="..."]')`. Use `test.step()` to group interactions and improve test readability and reporting.
- **Assertions**: Use auto-retrying web-first assertions. These assertions start with the `await` keyword (e.g., `await expect(locator).toHaveText()`). Avoid `expect(locator).toBeVisible()` unless specifically testing for visibility changes.
  - **Verify Specific Values**: Always verify specific values (colours, names, types) not just existence. For example, verify the colour is `#FF0000`, not just that a colour exists.
  - **Test Initial State**: Always verify initial state before testing changes. For example, verify there is 1 white colour before testing colour addition.
- **Timeouts**: Rely on Playwright's built-in auto-waiting mechanisms. Avoid hard-coded waits or increased default timeouts.
- **Clarity**: Use descriptive test and step titles that clearly state the intent. **Avoid obvious comments** that simply restate what the code does (e.g., `// Click the button` before `await button.click()`). Only add comments to explain complex logic, non-obvious interactions, or important context that isn't clear from the code itself. Use `test.step()` for bigger tests to break the test into logical, named steps.

### Test Structure

- **Organization**: Group related tests for a feature under a `test.describe()` block.
- **Fixtures**: Use Test Fixtures with the Page Object Pattern to encapsulate shared logic; use the Page Object Pattern for major components on a page, not just whole pages.
  - **Never manually instantiate page objects** in tests. Always use fixtures defined in `e2e/fixtures/base.ts`.
  - Add new fixtures for any new page objects to avoid repetitive setup code.
- **Titles**: Follow a clear naming convention, such as `Specific action or scenario`.
- **Test Focus**: Keep tests focused on a single scenario. Split tests that verify different behaviors (e.g., "replace colours" and "add colours" should be separate tests).

### File Organization

- **Location**: Store all test files in the `e2e/` directory; store all fixtures in the `e2e/fixtures` directory; store all page objects in the `e2e/pages` directory.
- **Naming**: Use the convention `<feature-or-page>.spec.ts` (e.g., `smoke.spec.ts`, `palette-types.spec.ts`).
- **Scope**: Aim for one test file per major application feature or page.

## Page Object Model Guidelines

### Creating Page Objects

- **Main Page Object**: Create a main page object (e.g., `ColourPaletteEditor`) that represents the primary interface.
- **Modal Encapsulation**: Create separate classes for modals and dialogs (e.g., `ImportModal`, `ExportModal`, `ImageExtractorModal`).
  - Add modal instances as properties on the main page object.
  - This avoids direct modal manipulation in tests and improves reusability.
- **Getters for Elements**: Use getters (not methods) for frequently accessed elements to keep the API clean.
- **Methods for Actions**: Create methods for user actions (e.g., `clickAddColour()`, `setType()`).
- **Methods for Queries**: Create methods for getting state (e.g., `getColours()`, `getSelectedType()`).

### File Chooser Handling

When working with hidden file inputs that are triggered by buttons:

```typescript
// GOOD: Use filechooser event
async uploadImage(imagePath: string) {
  const fileChooserPromise = this.page.waitForEvent('filechooser')
  await this.openImageButton.click()
  const fileChooser = await fileChooserPromise
  await fileChooser.setFiles(imagePath)
}

// BAD: Don't access hidden file inputs directly
async uploadImage(imagePath: string) {
  await this.fileInput.setInputFiles(imagePath)  // ❌ fileInput is hidden
}
```

### Example Page Object Structure

```typescript
import {Page} from '@playwright/test'
import {SomeModal} from './SomeModal'

export class MainPage {
  readonly someModal: SomeModal

  constructor(private page: Page) {
    this.someModal = new SomeModal(page)
  }

  async goto() {
    await this.page.goto('/')
  }

  // Getters for elements
  get addButton() {
    return this.page.locator('button[title="Add item"]')
  }

  // Action methods
  async clickAdd() {
    await this.addButton.click()
  }

  // Query methods
  async getItems() {
    return this.page.locator('[data-testid="item"]').all()
  }
}
```

## Example Test Structure

```typescript
import {test, expect} from './fixtures/base'

test.describe('Colour Palette Editing', () => {
  test('should have initial colour of white', async ({colourPaletteEditor}) => {
    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual(['#FFFFFF'])
  })

  test('should remove specific colour', async ({colourPaletteEditor}) => {
    await test.step('configure colours', async () => {
      await colourPaletteEditor.clickAddColour()
      await colourPaletteEditor.setColour(0, '#FF0000')
      await colourPaletteEditor.setColour(1, '#0000FF')
    })

    await test.step('remove first colour', async () => {
      await colourPaletteEditor.clickRemoveColour(0)
    })

    await test.step('verify correct colour was removed', async () => {
      const coloursAfterRemove = await colourPaletteEditor.getColours()
      expect(coloursAfterRemove).toEqual(['#0000FF']) // Blue remains
    })
  })
})
```

## Fixture Pattern

Define fixtures in `e2e/fixtures/base.ts` to avoid repetitive page object instantiation:

```typescript
import {test as base} from '@playwright/test'
import {ColourPaletteEditor} from '../pages/ColourPaletteEditor'

interface ColourPaletteFixtures {
  colourPaletteEditor: ColourPaletteEditor
}

export const test = base.extend<ColourPaletteFixtures>({
  colourPaletteEditor: async ({page}, use) => {
    const colourPaletteEditor = new ColourPaletteEditor(page)
    await colourPaletteEditor.goto()
    await use(colourPaletteEditor)
    // Cleanup if needed
  },
})

export {expect} from '@playwright/test'
```

Then import from fixtures in tests:

```typescript
import {test, expect} from './fixtures/base' // ✓ Use fixture
// NOT: import {test, expect} from '@playwright/test'  // ✗ Don't use base test
```

## Test Execution Strategy

1. **Initial Run**: Execute tests with `yarn test:e2e --project=chromium`
2. **Debug Failures**: Analyze test failures and identify root causes
3. **Iterate**: Refine locators, assertions, or test logic as needed
4. **Validate**: Ensure tests pass consistently and cover the intended functionality
5. **Full Run**: Execute tests and ensure they pass for for all browsers with `yarn test:e2e`
6. **Report**: Provide feedback on test results and any issues discovered

## Improving Component Testability

When components are difficult to test, consider improving the component's accessibility:

- **Add `data-testid` attributes** for key state elements (e.g., selected item indicators)
- **Use semantic HTML** and ARIA attributes where appropriate
- **Example**: If getting the "selected type" is difficult, add a `data-testid` to the selected element:

  ```typescript
  // In component
  <div data-testid="ColourPaletteTypeSelector Selected">
    <label>{selectedType}</label>
  </div>

  // In test
  async getSelectedType() {
    const selected = this.typeSelector.getByTestId('ColourPaletteTypeSelector Selected')
    return selected.textContent()
  }
  ```

This improves both test reliability and component accessibility.

## Quality Checklist

Before finalizing tests, ensure:

- [ ] All locators are accessible and specific and avoid strict mode violations
- [ ] Tests are grouped logically and follow a clear structure
- [ ] Assertions are meaningful and reflect user expectations
- [ ] Tests follow consistent naming conventions
- [ ] Code is properly formatted and commented
