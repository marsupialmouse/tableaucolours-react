import {test, expect} from './fixtures/base'

test.describe('Palette Type Switching', () => {
  test('should show current palette type', async ({page, colourPalettePage}) => {
    // Verify palette is visible
    await expect(colourPalettePage.isVisible()).resolves.toBe(true)

    // Default type should be visible
    const typeSelector = page.locator('[data-testid="ColourPaletteTypeSelector Component"]')
    await expect(typeSelector).toBeVisible()
  })

  test('should display available palette types when clicked', async ({page, colourPalettePage}) => {
    // Verify palette is visible
    await expect(colourPalettePage.isVisible()).resolves.toBe(true)

    // Click to open type selector
    const typeSelector = page.locator('[data-testid="ColourPaletteTypeSelector Component"]')
    await typeSelector.click()

    // Should show type options in the selector list
    const selectorList = page.locator('[data-testid="ColourPaletteTypeSelector Selector"]')
    await expect(selectorList).toBeVisible()

    // Check types are in the list
    await expect(selectorList.getByText('Regular')).toBeVisible()
    await expect(selectorList.getByText('Sequential')).toBeVisible()
    await expect(selectorList.getByText('Diverging')).toBeVisible()
  })

  test('should switch to Sequential palette type', async ({page, colourPalettePage}) => {
    // Open type selector
    const typeSelector = page.locator('[data-testid="ColourPaletteTypeSelector Component"]')
    await typeSelector.click()

    // Click Sequential in the selector list
    const selectorList = page.locator('[data-testid="ColourPaletteTypeSelector Selector"]')
    await selectorList.getByText('Sequential').click()

    // Verify by checking export contains sequential type
    await colourPalettePage.clickExport()
    const codeContainer = page.locator('[data-testid="ColourPaletteGetCode Code"]')
    const codeText = await codeContainer.textContent()
    expect(codeText).toContain('type="ordered-sequential"')
  })

  test('should switch to Diverging palette type', async ({page, colourPalettePage}) => {
    // Open type selector
    const typeSelector = page.locator('[data-testid="ColourPaletteTypeSelector Component"]')
    await typeSelector.click()

    // Click Diverging
    await page.getByText('Diverging').click()

    // Verify by checking export contains diverging type
    await colourPalettePage.clickExport()
    const codeContainer = page.locator('[data-testid="ColourPaletteGetCode Code"]')
    const codeText = await codeContainer.textContent()
    expect(codeText).toContain('type="ordered-diverging"')
  })
})
