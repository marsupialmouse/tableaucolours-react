import {test, expect} from './fixtures/base'
import {ColourPalettePage} from './pages/ColourPalettePage'

test.describe('Smoke Tests', () => {
  test('should load the application', async ({page}) => {
    const palettePage = new ColourPalettePage(page)
    await palettePage.goto()

    await expect(page).toHaveTitle('Colours')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should display palette editor', async ({page}) => {
    const palettePage = new ColourPalettePage(page)
    await palettePage.goto()

    // Wait for the app to load
    await page.waitForLoadState('networkidle')

    // Check if palette name input is visible
    const nameInput = palettePage.getPaletteNameInput()
    await expect(nameInput).toBeVisible()
  })
})
