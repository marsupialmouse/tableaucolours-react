import {test, expect} from './fixtures/base'

test.describe('Palette Export', () => {
  test('should open export modal', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.clickExport()
    await expect(colourPaletteEditor.exportModal.codeContainer).toBeVisible()
  })

  test('should display XML code with correct palette data in export modal', async ({
    colourPaletteEditor,
  }) => {
    await test.step('configure palette', async () => {
      await colourPaletteEditor.setPaletteName('Test Export Palette')
      await colourPaletteEditor.setType('Sequential')
      await colourPaletteEditor.clickAddColour()
      await colourPaletteEditor.clickAddColour()
      await colourPaletteEditor.setColour(0, '#FF0000')
      await colourPaletteEditor.setColour(1, '#00FF00')
      await colourPaletteEditor.setColour(2, '#0000FF')
    })

    await test.step('export and verify XML', async () => {
      await colourPaletteEditor.clickExport()

      await expect(colourPaletteEditor.exportModal.codeContainer).toBeVisible()
      const codeText = await colourPaletteEditor.exportModal.getXMLContent()
      expect(codeText?.trim())
        .toBe(`<color-palette name="Test Export Palette" type="ordered-sequential">
    <color>#ff0000</color>
    <color>#00ff00</color>
    <color>#0000ff</color>
</color-palette>`)
    })
  })

  test('should close export modal', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.clickExport()
    await expect(colourPaletteEditor.exportModal.modal).toBeVisible()

    await colourPaletteEditor.exportModal.close()

    await expect(colourPaletteEditor.exportModal.modal).not.toBeVisible()
  })
})

test.describe('Palette Import', () => {
  test('should open import modal', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.clickImport()
    await expect(colourPaletteEditor.importModal.modal).toBeVisible()
  })

  test('should have import text area', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.clickImport()
    await expect(colourPaletteEditor.importModal.textarea).toBeVisible()
  })

  test('should import valid XML palette with correct colours', async ({colourPaletteEditor}) => {
    const validXML = `<color-palette name="Test Palette" type="regular">
  <color>#FF0000</color>
  <color>#00FF00</color>
  <color>#0000FF</color>
</color-palette>`

    await colourPaletteEditor.clickImport()
    await colourPaletteEditor.importModal.fillXML(validXML)
    await expect(colourPaletteEditor.importModal.importButton).toBeEnabled()

    await colourPaletteEditor.importModal.clickImport()

    await expect(colourPaletteEditor.importModal.modal).not.toBeVisible()
    const name = await colourPaletteEditor.getPaletteName()
    expect(name).toBe('Test Palette')
    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual(['#FF0000', '#00FF00', '#0000FF'])
  })

  test('should show validation error for invalid XML', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.clickImport()

    await colourPaletteEditor.importModal.fillXML('invalid xml content')

    await expect(colourPaletteEditor.importModal.importButton).toBeDisabled()
    await expect(colourPaletteEditor.importModal.validationMessage).toBeVisible()
  })

  test('should cancel import', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.clickImport()
    await expect(colourPaletteEditor.importModal.modal).toBeVisible()

    await colourPaletteEditor.importModal.clickCancel()

    await expect(colourPaletteEditor.importModal.modal).not.toBeVisible()
  })
})
