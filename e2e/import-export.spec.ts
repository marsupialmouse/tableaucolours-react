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

  test('should verify clipboard feedback when copying XML', async ({colourPaletteEditor}) => {
    await test.step('open export modal', async () => {
      await colourPaletteEditor.clickExport()
      await expect(colourPaletteEditor.exportModal.modal).toBeVisible()
    })

    await test.step('verify initial button state', async () => {
      const buttonText = await colourPaletteEditor.exportModal.getCopyButtonText()
      expect(buttonText).toBe('Copy to clipboard')
    })

    await test.step('click copy and verify feedback', async () => {
      await colourPaletteEditor.exportModal.clickCopyToClipboard()
      const buttonText = await colourPaletteEditor.exportModal.getCopyButtonText()
      expect(buttonText).toContain('Copied')
    })
  })

  test('should export Regular palette with correct type', async ({colourPaletteEditor}) => {
    await test.step('configure Regular palette', async () => {
      await colourPaletteEditor.setPaletteName('Regular Palette')
      await colourPaletteEditor.setType('Regular')
      await colourPaletteEditor.clickAddColour()
      await colourPaletteEditor.setColour(0, '#FF0000')
      await colourPaletteEditor.setColour(1, '#00FF00')
    })

    await test.step('export and verify type="regular"', async () => {
      await colourPaletteEditor.clickExport()
      const xmlContent = await colourPaletteEditor.exportModal.getXMLContent()
      expect(xmlContent).toContain('type="regular"')
    })
  })

  test('should export Sequential palette with correct type', async ({colourPaletteEditor}) => {
    await test.step('configure Sequential palette', async () => {
      await colourPaletteEditor.setPaletteName('Sequential Palette')
      await colourPaletteEditor.setType('Sequential')
      await colourPaletteEditor.clickAddColour()
      await colourPaletteEditor.setColour(0, '#0000FF')
      await colourPaletteEditor.setColour(1, '#00FFFF')
    })

    await test.step('export and verify type="ordered-sequential"', async () => {
      await colourPaletteEditor.clickExport()
      const xmlContent = await colourPaletteEditor.exportModal.getXMLContent()
      expect(xmlContent).toContain('type="ordered-sequential"')
    })
  })

  test('should export Diverging palette with correct type', async ({colourPaletteEditor}) => {
    await test.step('configure Diverging palette', async () => {
      await colourPaletteEditor.setPaletteName('Diverging Palette')
      await colourPaletteEditor.setType('Diverging')
      await colourPaletteEditor.clickAddColour()
      await colourPaletteEditor.setColour(0, '#FF0000')
      await colourPaletteEditor.setColour(1, '#0000FF')
    })

    await test.step('export and verify type="ordered-diverging"', async () => {
      await colourPaletteEditor.clickExport()
      const xmlContent = await colourPaletteEditor.exportModal.getXMLContent()
      expect(xmlContent).toContain('type="ordered-diverging"')
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

  test('should import Regular palette type correctly', async ({colourPaletteEditor}) => {
    const regularXML = `<color-palette name="Regular Test" type="regular">
  <color>#FF0000</color>
  <color>#00FF00</color>
</color-palette>`

    await test.step('import Regular palette', async () => {
      await colourPaletteEditor.clickImport()
      await colourPaletteEditor.importModal.fillXML(regularXML)
      await colourPaletteEditor.importModal.clickImport()
    })

    await test.step('verify type is Regular', async () => {
      const selectedType = await colourPaletteEditor.getSelectedType()
      expect(selectedType).toBe('Regular')
    })
  })

  test('should import Sequential palette type correctly', async ({colourPaletteEditor}) => {
    const sequentialXML = `<color-palette name="Sequential Test" type="ordered-sequential">
  <color>#0000FF</color>
  <color>#00FFFF</color>
</color-palette>`

    await test.step('import Sequential palette', async () => {
      await colourPaletteEditor.clickImport()
      await colourPaletteEditor.importModal.fillXML(sequentialXML)
      await colourPaletteEditor.importModal.clickImport()
    })

    await test.step('verify type is Sequential', async () => {
      const selectedType = await colourPaletteEditor.getSelectedType()
      expect(selectedType).toBe('Sequential')
    })
  })

  test('should import Diverging palette type correctly', async ({colourPaletteEditor}) => {
    const divergingXML = `<color-palette name="Diverging Test" type="ordered-diverging">
  <color>#FF0000</color>
  <color>#FFFFFF</color>
  <color>#0000FF</color>
</color-palette>`

    await test.step('import Diverging palette', async () => {
      await colourPaletteEditor.clickImport()
      await colourPaletteEditor.importModal.fillXML(divergingXML)
      await colourPaletteEditor.importModal.clickImport()
    })

    await test.step('verify type is Diverging', async () => {
      const selectedType = await colourPaletteEditor.getSelectedType()
      expect(selectedType).toBe('Diverging')
    })
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
