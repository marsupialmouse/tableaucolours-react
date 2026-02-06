import {test, expect} from './fixtures/base'

test.describe('Palette Type Switching', () => {
  test('should show current palette type', async ({colourPalettePage}) => {
    // Default type should be visible
    await expect(colourPalettePage.typeSelector).toBeVisible()
  })

  test('should display available palette types when clicked', async ({colourPalettePage}) => {
    // Click to open type selector
    await colourPalettePage.typeSelector.click()

    // Should show type options in the selector list
    await expect(colourPalettePage.typeSelectorList).toBeVisible()

    // Check types are in the list
    await expect(colourPalettePage.typeSelectorList.getByText('Regular')).toBeVisible()
    await expect(colourPalettePage.typeSelectorList.getByText('Sequential')).toBeVisible()
    await expect(colourPalettePage.typeSelectorList.getByText('Diverging')).toBeVisible()
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
