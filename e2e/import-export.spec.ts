import {test, expect} from './fixtures/base'

test.describe('Palette Export', () => {
  test('should open export modal', async ({page, colourPalettePage}) => {
    await colourPalettePage.clickExport()

    // Wait for content inside the dialog to be visible
    const codeContainer = page.locator('[data-testid="ColourPaletteGetCode Code"]')
    await expect(codeContainer).toBeVisible()
  })

  test('should display XML code in export modal', async ({page, colourPalettePage}) => {
    await colourPalettePage.clickExport()

    // Check that code is displayed
    const codeContainer = page.locator('[data-testid="ColourPaletteGetCode Code"]')
    await expect(codeContainer).toBeVisible()

    const codeText = await codeContainer.textContent()
    expect(codeText).toContain('<color-palette')
    expect(codeText).toContain('</color-palette>')
  })

  test('should close export modal', async ({page, colourPalettePage}) => {
    await colourPalettePage.clickExport()

    const modal = page.locator('[data-testid="ColourPaletteGetCode Component"]')
    await expect(modal).toBeVisible()

    // Press Escape to close the modal
    await page.keyboard.press('Escape')

    await expect(modal).not.toBeVisible()
  })
})

test.describe('Palette Import', () => {
  test('should open import modal', async ({page, colourPalettePage}) => {
    await colourPalettePage.clickImport()

    const modal = page.locator('[data-testid="ColourPaletteImport Component"]')
    await expect(modal).toBeVisible()
  })

  test('should have import text area', async ({page, colourPalettePage}) => {
    await colourPalettePage.clickImport()

    const textarea = page.locator('[data-testid="ColourPaletteImport Code"]')
    await expect(textarea).toBeVisible()
  })

  test('should import valid XML palette', async ({page, colourPalettePage}) => {
    const validXML = `<color-palette name="Test Palette" type="regular">
  <color>#FF0000</color>
  <color>#00FF00</color>
  <color>#0000FF</color>
</color-palette>`

    await colourPalettePage.clickImport()

    const textarea = page.locator('[data-testid="ColourPaletteImport Code"]')
    await textarea.fill(validXML)

    // Wait for import button to be enabled (validation happens on change)
    const importButton = page.getByRole('button', {name: 'Import'})
    await expect(importButton).toBeEnabled()

    await importButton.click()

    // Modal should close
    const modal = page.locator('[data-testid="ColourPaletteImport Component"]')
    await expect(modal).not.toBeVisible()

    // Palette name should be updated
    const name = await colourPalettePage.getPaletteName()
    expect(name).toBe('Test Palette')

    // Should have 3 colours
    const colourCount = await colourPalettePage.getColourCount()
    expect(colourCount).toBe(3)
  })

  test('should show validation error for invalid XML', async ({page, colourPalettePage}) => {
    await colourPalettePage.clickImport()

    const textarea = page.locator('[data-testid="ColourPaletteImport Code"]')
    await textarea.fill('invalid xml content')

    // Import button should be disabled for invalid XML
    const importButton = page.getByRole('button', {name: 'Import'})
    await expect(importButton).toBeDisabled()

    // Should show validation message
    const validation = page.locator('[data-testid="ColourPaletteImport Validation Message"]')
    await expect(validation).toBeVisible()
  })

  test('should cancel import', async ({page, colourPalettePage}) => {
    await colourPalettePage.clickImport()

    const modal = page.locator('[data-testid="ColourPaletteImport Component"]')
    await expect(modal).toBeVisible()

    await page.getByRole('button', {name: 'Cancel'}).click()

    await expect(modal).not.toBeVisible()
  })
})
