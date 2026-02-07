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

  test('should remove colour', async ({colourPaletteEditor}) => {
    await test.step('configure colours', async () => {
      await colourPaletteEditor.clickAddColour()
      await colourPaletteEditor.setColour(0, '#FF0000')
      await colourPaletteEditor.setColour(1, '#0000FF')
    })
    await test.step('remove colour', async () => {
      await colourPaletteEditor.clickRemoveColour(0)
    })
    await test.step('check colour was removed', async () => {
      const coloursAfterRemove = await colourPaletteEditor.getColours()
      expect(coloursAfterRemove).toEqual(['#0000F'])
    })
  })
})
