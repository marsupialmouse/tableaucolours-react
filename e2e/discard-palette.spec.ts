import {test, expect} from './fixtures/base'

test.describe('Discard Palette', () => {
  test('should show confirmation dialog when clicking discard', async ({
    colourPaletteEditor,
    page,
  }) => {
    await colourPaletteEditor.setColours(['#FF0000'])

    const dialogPromise = page.waitForEvent('dialog')
    // Don't await the click - it blocks until dialog is handled
    void colourPaletteEditor.clickDiscardPalette()
    const dialog = await dialogPromise

    expect(dialog.type()).toBe('confirm')
    expect(dialog.message()).toContain('delete')
    await dialog.dismiss()
  })

  test('should keep colours when dismissing confirmation dialog', async ({
    colourPaletteEditor,
    page,
  }) => {
    await colourPaletteEditor.setColours(['#FF0000', '#00FF00'])

    page.once('dialog', (dialog) => dialog.dismiss())
    await colourPaletteEditor.clickDiscardPalette()

    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual(['#FF0000', '#00FF00'])
  })

  test('should remove all colours when accepting confirmation dialog', async ({
    colourPaletteEditor,
    page,
  }) => {
    await colourPaletteEditor.setColours(['#FF0000', '#00FF00'])

    page.once('dialog', (dialog) => dialog.accept())
    await colourPaletteEditor.clickDiscardPalette()

    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual([])
  })

  test('should have disabled discard button when palette is empty', async ({
    colourPaletteEditor,
    page,
  }) => {
    await colourPaletteEditor.setColours(['#FF0000'])

    page.once('dialog', (dialog) => dialog.accept())
    await colourPaletteEditor.clickDiscardPalette()

    await expect(colourPaletteEditor.discardPaletteButton).toBeDisabled()
  })
})
