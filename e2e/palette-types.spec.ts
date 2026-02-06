import {test, expect} from './fixtures/base'

test.describe('Palette Type Switching', () => {
  test('should show current palette type', async ({colourPalettePage}) => {
    // Default type should be visible
    await expect(colourPalettePage.typeSelector).toBeVisible()

    // Should show the default type (Regular)
    const selectedType = await colourPalettePage.getSelectedType()
    expect(selectedType).toBe('Regular')
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

  test('should switch to Sequential palette type', async ({colourPalettePage}) => {
    // Switch to Sequential type
    await colourPalettePage.setType('Sequential')

    // Verify the type was changed
    const selectedType = await colourPalettePage.getSelectedType()
    expect(selectedType).toBe('Sequential')
  })

  test('should switch to Diverging palette type', async ({colourPalettePage}) => {
    // Switch to Diverging type
    await colourPalettePage.setType('Diverging')

    // Verify the type was changed
    const selectedType = await colourPalettePage.getSelectedType()
    expect(selectedType).toBe('Diverging')
  })
})
