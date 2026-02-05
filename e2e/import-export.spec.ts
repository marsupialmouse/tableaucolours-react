import {test, expect} from './fixtures/base'
import {ColourPalettePage} from './pages/ColourPalettePage'

test.describe('Palette Export', () => {
  test('should open export modal', async ({page}) => {
    const palettePage = new ColourPalettePage(page)
    await palettePage.goto()

    await palettePage.clickExport()

    // Wait for content inside the dialog to be visible (more reliable than dialog itself)
    const codeContainer = page.locator('[data-testid="ColourPaletteGetCode Code"]')
    await expect(codeContainer).toBeVisible({timeout: 15000})
  })

  test('should display XML code in export modal', async ({page}) => {
    const palettePage = new ColourPalettePage(page)
    await palettePage.goto()

    await palettePage.clickExport()

    // Check that code is displayed
    const codeContainer = page.locator('[data-testid="ColourPaletteGetCode Code"]')
    await expect(codeContainer).toBeVisible({timeout: 10000})

    const codeText = await codeContainer.textContent()
    expect(codeText).toContain('<color-palette')
    expect(codeText).toContain('</color-palette>')
  })

  test('should close export modal', async ({page}) => {
    const palettePage = new ColourPalettePage(page)
    await palettePage.goto()

    await palettePage.clickExport()

    const modal = page.locator('[data-testid="ColourPaletteGetCode Component"]')
    await expect(modal).toBeVisible({timeout: 10000})

    // Press Escape to close the modal
    await page.keyboard.press('Escape')

    await expect(modal).not.toBeVisible()
  })
})

test.describe('Palette Import', () => {
  test('should open import modal', async ({page}) => {
    const palettePage = new ColourPalettePage(page)
    await palettePage.goto()

    await palettePage.clickImport()

    const modal = page.locator('[data-testid="ColourPaletteImport Component"]')
    await expect(modal).toBeVisible({timeout: 10000})
  })

  test('should have import text area', async ({page}) => {
    const palettePage = new ColourPalettePage(page)
    await palettePage.goto()

    await palettePage.clickImport()

    const textarea = page.locator('[data-testid="ColourPaletteImport Code"]')
    await expect(textarea).toBeVisible({timeout: 10000})
  })

  test('should import valid XML palette', async ({page}) => {
    const palettePage = new ColourPalettePage(page)
    await palettePage.goto()

    const validXML = `<color-palette name="Test Palette" type="regular">
  <color>#FF0000</color>
  <color>#00FF00</color>
  <color>#0000FF</color>
</color-palette>`

    await palettePage.clickImport()

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
    const name = await palettePage.getPaletteName()
    expect(name).toBe('Test Palette')

    // Should have 3 colours
    const colourCount = await palettePage.getColourCount()
    expect(colourCount).toBe(3)
  })

  test('should show validation error for invalid XML', async ({page}) => {
    const palettePage = new ColourPalettePage(page)
    await palettePage.goto()

    await palettePage.clickImport()

    const textarea = page.locator('[data-testid="ColourPaletteImport Code"]')
    await textarea.fill('invalid xml content')

    // Import button should be disabled for invalid XML
    const importButton = page.getByRole('button', {name: 'Import'})
    await expect(importButton).toBeDisabled()

    // Should show validation message
    const validation = page.locator('[data-testid="ColourPaletteImport Validation Message"]')
    await expect(validation).toBeVisible({timeout: 10000})
  })

  test('should cancel import', async ({page}) => {
    const palettePage = new ColourPalettePage(page)
    await palettePage.goto()

    await palettePage.clickImport()

    const modal = page.locator('[data-testid="ColourPaletteImport Component"]')
    await expect(modal).toBeVisible({timeout: 10000})

    await page.getByRole('button', {name: 'Cancel'}).click()

    await expect(modal).not.toBeVisible()
  })
})
