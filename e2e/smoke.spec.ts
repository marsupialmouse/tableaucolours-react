import {test, expect} from './fixtures/base'

test.describe('Smoke Tests', () => {
  test('should load the application', async ({page, colourPaletteEditor}) => {
    await expect(page).toHaveTitle('Colours')
    await expect(page.locator('body')).toBeVisible()
    await expect(colourPaletteEditor.getPaletteNameInput()).toBeVisible()
  })

  test('should display palette editor', async ({page, colourPaletteEditor}) => {
    await page.waitForLoadState('networkidle')
    const nameInput = colourPaletteEditor.getPaletteNameInput()
    await expect(nameInput).toBeVisible()
  })
})
