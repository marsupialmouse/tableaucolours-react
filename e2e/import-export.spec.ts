import {test, expect} from './fixtures/base'

test.describe('Palette Export', () => {
  test('should open export modal', async ({colourPalettePage}) => {
    await colourPalettePage.clickExport()

    // Wait for content inside the dialog to be visible
    await expect(colourPalettePage.exportModal.codeContainer).toBeVisible()
  })

  test('should display XML code with correct palette data in export modal', async ({
    colourPalettePage,
  }) => {
    // Set up a known palette state with non-white colours
    await colourPalettePage.setPaletteName('Test Export Palette')
    await colourPalettePage.setType('Sequential')

    // Add some colours and set them to non-white values
    await colourPalettePage.clickAddColour()
    await colourPalettePage.clickAddColour()
    await colourPalettePage.setColour(0, '#FF0000')
    await colourPalettePage.setColour(1, '#00FF00')
    await colourPalettePage.setColour(2, '#0000FF')

    // Wait for colours to be set by verifying them
    await expect(async () => {
      const colours = await colourPalettePage.getColours()
      expect(colours).toEqual(['#FF0000', '#00FF00', '#0000FF'])
    }).toPass()

    await colourPalettePage.clickExport()

    // Check that code is displayed
    await expect(colourPalettePage.exportModal.codeContainer).toBeVisible()

    const codeText = await colourPalettePage.exportModal.getXMLContent()

    // Build expected XML structure
    const expectedXML = `<color-palette name="Test Export Palette" type="ordered-sequential">
  <color>#FF0000</color>
  <color>#00FF00</color>
  <color>#0000FF</color>
</color-palette>`

    // Compare actual XML to expected XML
    expect(codeText?.trim()).toBe(expectedXML)
  })

  test('should close export modal', async ({colourPalettePage}) => {
    await colourPalettePage.clickExport()

    await expect(colourPalettePage.exportModal.modal).toBeVisible()

    // Press Escape to close the modal
    await colourPalettePage.exportModal.close()

    await expect(colourPalettePage.exportModal.modal).not.toBeVisible()
  })
})

test.describe('Palette Import', () => {
  test('should open import modal', async ({colourPalettePage}) => {
    await colourPalettePage.clickImport()

    await expect(colourPalettePage.importModal.modal).toBeVisible()
  })

  test('should have import text area', async ({colourPalettePage}) => {
    await colourPalettePage.clickImport()

    await expect(colourPalettePage.importModal.textarea).toBeVisible()
  })

  test('should import valid XML palette with correct colours', async ({colourPalettePage}) => {
    const validXML = `<color-palette name="Test Palette" type="regular">
  <color>#FF0000</color>
  <color>#00FF00</color>
  <color>#0000FF</color>
</color-palette>`

    await colourPalettePage.clickImport()

    await colourPalettePage.importModal.fillXML(validXML)

    // Wait for import button to be enabled (validation happens on change)
    await expect(colourPalettePage.importModal.importButton).toBeEnabled()

    await colourPalettePage.importModal.clickImport()

    // Modal should close
    await expect(colourPalettePage.importModal.modal).not.toBeVisible()

    // Palette name should be updated
    const name = await colourPalettePage.getPaletteName()
    expect(name).toBe('Test Palette')

    // Should have 3 colours
    const colourCount = await colourPalettePage.getColourCount()
    expect(colourCount).toBe(3)

    // Verify the colours are correct
    const colours = await colourPalettePage.getColours()
    expect(colours).toEqual(['#FF0000', '#00FF00', '#0000FF'])
  })

  test('should show validation error for invalid XML', async ({colourPalettePage}) => {
    await colourPalettePage.clickImport()

    await colourPalettePage.importModal.fillXML('invalid xml content')

    // Import button should be disabled for invalid XML
    await expect(colourPalettePage.importModal.importButton).toBeDisabled()

    // Should show validation message
    await expect(colourPalettePage.importModal.validationMessage).toBeVisible()
  })

  test('should cancel import', async ({colourPalettePage}) => {
    await colourPalettePage.clickImport()

    await expect(colourPalettePage.importModal.modal).toBeVisible()

    await colourPalettePage.importModal.clickCancel()

    await expect(colourPalettePage.importModal.modal).not.toBeVisible()
  })
})
