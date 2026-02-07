---
description: 'Playwright test generation instructions'
applyTo: 'e2e/**/*'
---

## Test Writing Guidelines

### Code Quality Standards

- **Locators**: Prioritize user-facing, role-based locators (`getByRole`, `getByLabel`, `getByText`, etc.) for resilience and accessibility. Use `test.step()` to group interactions and improve test readability and reporting.
- **Assertions**: Use auto-retrying web-first assertions. These assertions start with the `await` keyword (e.g., `await expect(locator).toHaveText()`). Avoid `expect(locator).toBeVisible()` unless specifically testing for visibility changes.
- **Timeouts**: Rely on Playwright's built-in auto-waiting mechanisms. Avoid hard-coded waits or increased default timeouts.
- **Clarity**: Use descriptive test and step titles that clearly state the intent. Add comments only to explain complex logic or non-obvious interactions. Use `test.step()` for bigger tests to break the test into logical, named steps.

### Test Structure

- **Organization**: Group related tests for a feature under a `test.describe()` block.
- **Fixtures**: Use Test Fixtures with the Page Object Pattern to encapsulate shared logic; use the Page Object Pattern for major components on a page, not just whole pages.
- **Titles**: Follow a clear naming convention, such as `Specific action or scenario`.

### File Organization

- **Location**: Store all test files in the `e2e/` directory; store all fixtures in the `e2e/fixtures` directory; store all page objects in the `e2e/pages` directory.
- **Naming**: Use the convention `<feature-or-page>.spec.ts` (e.g., `smoke.spec.ts`, `palette-types.spec.ts`).
- **Scope**: Aim for one test file per major application feature or page.

## Example Test Structure

```typescript
import {test, expect} from './fixtures/base'

test.describe('Colour Palette Editing', () => {
  test('should have initial colour of white', async ({colourPaletteEditor}) => {
    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual(['#FFFFFF'])
  })

  test('should remove colour', async ({colourPaletteEditor}) => {
    await test.step('configure colours', async () => {
      await colourPaletteEditor.clickAddColour()
      await colourPaletteEditor.setColour(0, '#FF0000')
      await colourPaletteEditor.setColour(1, '#0000FF')
    })
    await test.step('remove colour', async () => {
      await colourPaletteEditor.clickRemoveColour(0)
    })
    await test.step('check colour was removed', async () => {
      const coloursAfterRemove = await colourPaletteEditor.getColours()
      expect(coloursAfterRemove).toEqual(['#0000F'])
    })
  })
})
```

## Test Execution Strategy

1. **Initial Run**: Execute tests with `yarn test:e2e --project=chromium`
2. **Debug Failures**: Analyze test failures and identify root causes
3. **Iterate**: Refine locators, assertions, or test logic as needed
4. **Validate**: Ensure tests pass consistently and cover the intended functionality
5. **Full Run**: Execute tests and ensure they pass for for all browsers with `yarn test:e2e`
6. **Report**: Provide feedback on test results and any issues discovered

## Quality Checklist

Before finalizing tests, ensure:

- [ ] All locators are accessible and specific and avoid strict mode violations
- [ ] Tests are grouped logically and follow a clear structure
- [ ] Assertions are meaningful and reflect user expectations
- [ ] Tests follow consistent naming conventions
- [ ] Code is properly formatted and commented
