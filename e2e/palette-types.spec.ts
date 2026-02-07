import {test, expect} from './fixtures/base'

test.describe('Palette Type Switching', () => {
  test('should show current palette type', async ({colourPaletteEditor}) => {
    // Default type should be visible
    await expect(colourPaletteEditor.typeSelector).toBeVisible()

    // Should show the default type (Regular)
    const selectedType = await colourPaletteEditor.getSelectedType()
    expect(selectedType).toBe('Regular')
  })

  test('should display available palette types when clicked', async ({colourPaletteEditor}) => {
    // Click to open type selector
    await colourPaletteEditor.typeSelector.click()

    // Should show type options in the selector list
    await expect(colourPaletteEditor.typeSelectorList).toBeVisible()

    // Check types are in the list
    await expect(colourPaletteEditor.typeSelectorList.getByText('Regular')).toBeVisible()
    await expect(colourPaletteEditor.typeSelectorList.getByText('Sequential')).toBeVisible()
    await expect(colourPaletteEditor.typeSelectorList.getByText('Diverging')).toBeVisible()
  })

  test('should switch to Sequential palette type', async ({colourPaletteEditor}) => {
    // Switch to Sequential type
    await colourPaletteEditor.setType('Sequential')

    // Verify the type was changed
    const selectedType = await colourPaletteEditor.getSelectedType()
    expect(selectedType).toBe('Sequential')
  })

  test('should switch to Diverging palette type', async ({colourPaletteEditor}) => {
    // Switch to Diverging type
    await colourPaletteEditor.setType('Diverging')

    // Verify the type was changed
    const selectedType = await colourPaletteEditor.getSelectedType()
    expect(selectedType).toBe('Diverging')
  })
})
