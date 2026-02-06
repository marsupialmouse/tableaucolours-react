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
  test('should have initial colour of white', async ({colourPalettePage}) => {
    // Should have exactly one colour initially
    const initialCount = await colourPalettePage.getColourCount()
    expect(initialCount).toBe(1)

    // The initial colour should be white
    const colours = await colourPalettePage.getColours()
    expect(colours[0]).toBe('#FFFFFF')
  })

  test('should add a new colour', async ({colourPalettePage}) => {
    const initialCount = await colourPalettePage.getColourCount()

    await colourPalettePage.clickAddColour()

    const newCount = await colourPalettePage.getColourCount()
    expect(newCount).toBe(initialCount + 1)
  })

  test('should remove the correct colour', async ({colourPalettePage}) => {
    // Set up known colours for testing
    // Add a second colour
    await colourPalettePage.clickAddColour()

    // Get the colours before removal
    const coloursBeforeRemove = await colourPalettePage.getColours()
    expect(coloursBeforeRemove.length).toBe(2)

    // Remove the first colour (index 0)
    await colourPalettePage.clickRemoveColour(0)

    // Get the colours after removal
    const coloursAfterRemove = await colourPalettePage.getColours()
    expect(coloursAfterRemove.length).toBe(1)

    // The remaining colour should be the second one from before
    expect(coloursAfterRemove[0]).toBe(coloursBeforeRemove[1])
  })
})
