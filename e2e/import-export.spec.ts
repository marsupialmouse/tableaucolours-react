import {test, expect} from './fixtures/base'

test.describe('Palette Export', () => {
  test('should open export modal', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.clickExport()

    // Wait for content inside the dialog to be visible
    await expect(colourPaletteEditor.exportModal.codeContainer).toBeVisible()
  })

  test('should display XML code with correct palette data in export modal', async ({
    colourPaletteEditor,
  }) => {
    // Set up a known palette state with non-white colours
    await colourPaletteEditor.setPaletteName('Test Export Palette')
    await colourPaletteEditor.setType('Sequential')

    // Add some colours and set them to non-white values
    await colourPaletteEditor.clickAddColour()
    await colourPaletteEditor.clickAddColour()
    await colourPaletteEditor.setColour(0, '#FF0000')
    await colourPaletteEditor.setColour(1, '#00FF00')
    await colourPaletteEditor.setColour(2, '#0000FF')

    // Wait for colours to be set by verifying them
    await expect(async () => {
      const colours = await colourPaletteEditor.getColours()
      expect(colours).toEqual(['#FF0000', '#00FF00', '#0000FF'])
    }).toPass()

    await colourPaletteEditor.clickExport()

    // Check that code is displayed
    await expect(colourPaletteEditor.exportModal.codeContainer).toBeVisible()

    const codeText = await colourPaletteEditor.exportModal.getXMLContent()

    // Ensure we got the XML content
    expect(codeText).toBeTruthy()

    // Build expected XML structure
    const expectedXML = `<color-palette name="Test Export Palette" type="ordered-sequential">
  <color>#FF0000</color>
  <color>#00FF00</color>
  <color>#0000FF</color>
</color-palette>`

    // Compare actual XML to expected XML
    expect(codeText?.trim()).toBe(expectedXML)
  })

  test('should close export modal', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.clickExport()

    await expect(colourPaletteEditor.exportModal.modal).toBeVisible()

    // Press Escape to close the modal
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

    // Wait for import button to be enabled (validation happens on change)
    await expect(colourPaletteEditor.importModal.importButton).toBeEnabled()

    await colourPaletteEditor.importModal.clickImport()

    // Modal should close
    await expect(colourPaletteEditor.importModal.modal).not.toBeVisible()

    // Palette name should be updated
    const name = await colourPaletteEditor.getPaletteName()
    expect(name).toBe('Test Palette')

    // Should have 3 colours
    const colourCount = await colourPaletteEditor.getColourCount()
    expect(colourCount).toBe(3)

    // Verify the colours are correct
    const colours = await colourPaletteEditor.getColours()
    expect(colours).toEqual(['#FF0000', '#00FF00', '#0000FF'])
  })

  test('should show validation error for invalid XML', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.clickImport()

    await colourPaletteEditor.importModal.fillXML('invalid xml content')

    // Import button should be disabled for invalid XML
    await expect(colourPaletteEditor.importModal.importButton).toBeDisabled()

    // Should show validation message
    await expect(colourPaletteEditor.importModal.validationMessage).toBeVisible()
  })

  test('should cancel import', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.clickImport()

    await expect(colourPaletteEditor.importModal.modal).toBeVisible()

    await colourPaletteEditor.importModal.clickCancel()

    await expect(colourPaletteEditor.importModal.modal).not.toBeVisible()
  })
})
