import {test, expect} from './fixtures/base'

test.describe('Palette Type Switching', () => {
  test('should show default palette type of Regular', async ({colourPaletteEditor}) => {
    await expect(colourPaletteEditor.typeSelector).toBeVisible()
    const selectedType = await colourPaletteEditor.getSelectedType()
    expect(selectedType).toBe('Regular')
  })

  test('should display available palette types when clicked', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.typeSelector.click()

    await expect(colourPaletteEditor.typeSelectorList).toBeVisible()
    await expect(colourPaletteEditor.typeSelectorList.getByText('Regular')).toBeVisible()
    await expect(colourPaletteEditor.typeSelectorList.getByText('Sequential')).toBeVisible()
    await expect(colourPaletteEditor.typeSelectorList.getByText('Diverging')).toBeVisible()
  })

  test('should switch to Sequential palette type', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.setType('Sequential')

    const selectedType = await colourPaletteEditor.getSelectedType()
    expect(selectedType).toBe('Sequential')
  })

  test('should switch to Diverging palette type', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.setType('Diverging')

    const selectedType = await colourPaletteEditor.getSelectedType()
    expect(selectedType).toBe('Diverging')
  })
})
