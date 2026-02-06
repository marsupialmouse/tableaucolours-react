import {test, expect} from './fixtures/base'

test.describe('Colour Palette Creation', () => {
  test('should have palette name input', async ({colourPalettePage}) => {
    const input = colourPalettePage.getPaletteNameInput()
    await expect(input).toBeVisible()
    await expect(input).toHaveAttribute('placeholder', 'Enter a palette name')
  })

  test('should allow changing palette name', async ({colourPalettePage}) => {
    const newName = 'My Custom Palette'
    await colourPalettePage.setPaletteName(newName)

    const savedName = await colourPalettePage.getPaletteName()
    expect(savedName).toBe(newName)
  })
})

test.describe('Colour Palette Editing', () => {
  test('should have initial colours', async ({colourPalettePage}) => {
    const initialCount = await colourPalettePage.getColourCount()
    expect(initialCount).toBeGreaterThan(0)
  })

  test('should add a new colour', async ({colourPalettePage}) => {
    const initialCount = await colourPalettePage.getColourCount()

    await colourPalettePage.clickAddColour()

    const newCount = await colourPalettePage.getColourCount()
    expect(newCount).toBe(initialCount + 1)
  })

  test('should remove a colour', async ({colourPalettePage}) => {
    // Ensure we have at least 2 colours
    const initialCount = await colourPalettePage.getColourCount()
    if (initialCount < 2) {
      await colourPalettePage.clickAddColour()
    }

    const countBeforeRemove = await colourPalettePage.getColourCount()

    await colourPalettePage.clickRemoveColour(0)

    const countAfterRemove = await colourPalettePage.getColourCount()
    expect(countAfterRemove).toBe(countBeforeRemove - 1)
  })
})
