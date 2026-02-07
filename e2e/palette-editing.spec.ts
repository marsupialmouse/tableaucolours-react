import {test, expect} from './fixtures/base'

test.describe('Colour Palette Creation', () => {
  test('should have palette name input', async ({colourPaletteEditor}) => {
    const input = colourPaletteEditor.getPaletteNameInput()
    await expect(input).toBeVisible()
    await expect(input).toHaveAttribute('placeholder', 'Enter a palette name')
  })

  test('should allow changing palette name', async ({colourPaletteEditor}) => {
    const newName = 'My Custom Palette'
    await colourPaletteEditor.setPaletteName(newName)

    const savedName = await colourPaletteEditor.getPaletteName()
    expect(savedName).toBe(newName)
  })
})

test.describe('Colour Palette Editing', () => {
  test('should have initial colour of white', async ({colourPaletteEditor}) => {
    // Should have exactly one colour initially
    const initialCount = await colourPaletteEditor.getColourCount()
    expect(initialCount).toBe(1)

    // The initial colour should be white
    const colours = await colourPaletteEditor.getColours()
    expect(colours[0]).toBe('#FFFFFF')
  })

  test('should add a new colour', async ({colourPaletteEditor}) => {
    const initialCount = await colourPaletteEditor.getColourCount()

    await colourPaletteEditor.clickAddColour()

    const newCount = await colourPaletteEditor.getColourCount()
    expect(newCount).toBe(initialCount + 1)
  })

  test('should remove the correct colour', async ({colourPaletteEditor}) => {
    // Set up known colours for testing
    // Add a second colour
    await colourPaletteEditor.clickAddColour()

    // Set the first colour to red to differentiate from white
    await colourPaletteEditor.setColour(0, '#FF0000')

    // Wait for the colour to be set by verifying the background color
    await expect(async () => {
      const colours = await colourPaletteEditor.getColours()
      expect(colours[0]).toBe('#FF0000')
    }).toPass()

    // Get the colours before removal
    const coloursBeforeRemove = await colourPaletteEditor.getColours()
    expect(coloursBeforeRemove.length).toBe(2)
    expect(coloursBeforeRemove[0]).toBe('#FF0000')
    expect(coloursBeforeRemove[1]).toBe('#FFFFFF')

    // Remove the first colour (index 0)
    await colourPaletteEditor.clickRemoveColour(0)

    // Get the colours after removal
    const coloursAfterRemove = await colourPaletteEditor.getColours()
    expect(coloursAfterRemove.length).toBe(1)

    // The remaining colour should be white (the second one from before)
    expect(coloursAfterRemove[0]).toBe('#FFFFFF')
  })
})
