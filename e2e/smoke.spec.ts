import {test, expect} from './fixtures/base'

test.describe('Smoke Tests', () => {
  test('should load the application', async ({page, colourPalettePage: _colourPalettePage}) => {
    await expect(page).toHaveTitle('Colours')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should display palette editor', async ({page, colourPalettePage}) => {
    // Wait for the app to load
    await page.waitForLoadState('networkidle')

    // Check if palette name input is visible
    const nameInput = colourPalettePage.getPaletteNameInput()
    await expect(nameInput).toBeVisible()
  })
})
