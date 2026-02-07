import {test, expect} from './fixtures/base'
import {fileURLToPath} from 'url'
import {dirname, join} from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

test.describe('Image File Operations', () => {
  const testImagePath = join(__dirname, 'fixtures', 'test-images', 'sample.png')

  test('should open file chooser when Open Image button is clicked', async ({
    colourPaletteEditor,
  }) => {
    // Click the button and verify file chooser opens
    const fileChooser = await colourPaletteEditor.clickOpenImageButton()

    // Verify file chooser was opened
    expect(fileChooser).toBeTruthy()
  })

  test('should load an image file and display it', async ({colourPaletteEditor}) => {
    // Upload the image
    await colourPaletteEditor.uploadImage(testImagePath)

    // Verify the image canvas container is visible
    await expect(colourPaletteEditor.imageCanvas).toBeVisible()

    // Verify the actual canvas element with the image is visible
    await expect(colourPaletteEditor.imageCanvasElement).toBeVisible()

    // Verify the canvas has actual content (dimensions > 0)
    const canvasElement = colourPaletteEditor.imageCanvasElement
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
    const width = await canvasElement.evaluate((canvas: any) => canvas.width)
    const height = await canvasElement.evaluate((canvas: any) => canvas.height)
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
    expect(width).toBeGreaterThan(0)
    expect(height).toBeGreaterThan(0)
  })

  test('should enable extract colours button when image is loaded', async ({
    colourPaletteEditor,
  }) => {
    // Initially, extract button should be disabled
    await expect(colourPaletteEditor.extractButton).toBeDisabled()

    // Upload the image
    await colourPaletteEditor.uploadImage(testImagePath)

    // Extract button should now be enabled
    await expect(colourPaletteEditor.extractButton).toBeEnabled()
  })
})

test.describe('Image Colour Extraction', () => {
  const testImagePath = join(__dirname, 'fixtures', 'test-images', 'sample.png')

  test('should open colour extraction modal', async ({colourPaletteEditor}) => {
    // Upload image
    await colourPaletteEditor.uploadImage(testImagePath)

    // Click extract button
    await colourPaletteEditor.extractButton.click()

    // Modal should open
    await expect(colourPaletteEditor.imageExtractorModal.modal).toBeVisible()
  })

  test('should replace colours when extracting from image', async ({colourPaletteEditor}) => {
    // Add some initial colours to be replaced
    await colourPaletteEditor.clickAddColour()
    await colourPaletteEditor.clickAddColour()
    const initialCount = await colourPaletteEditor.getColourCount()
    expect(initialCount).toBeGreaterThan(1)

    // Upload image
    await colourPaletteEditor.uploadImage(testImagePath)

    // Click extract button
    await colourPaletteEditor.extractButton.click()

    // Wait for modal
    await expect(colourPaletteEditor.imageExtractorModal.modal).toBeVisible()

    // Get the number of colours to extract from the modal
    const numberOfColoursToExtract =
      await colourPaletteEditor.imageExtractorModal.getNumberOfColoursToExtract()

    // Click extract button in modal (default should replace colours)
    await colourPaletteEditor.imageExtractorModal.clickExtract()

    // Wait for extraction to complete and modal to close
    await expect(colourPaletteEditor.imageExtractorModal.modal).not.toBeVisible()

    // Should have exactly the number of colours that were requested
    await expect(async () => {
      const newCount = await colourPaletteEditor.getColourCount()
      expect(newCount).toBe(numberOfColoursToExtract)
    }).toPass()
  })

  test('should add colours when extracting from image with add option', async ({
    page,
    colourPaletteEditor,
  }) => {
    // Start with known initial state
    const initialCount = await colourPaletteEditor.getColourCount()
    expect(initialCount).toBe(1)

    // Upload image
    await colourPaletteEditor.uploadImage(testImagePath)

    // Click extract button
    await colourPaletteEditor.extractButton.click()

    // Wait for modal
    await expect(colourPaletteEditor.imageExtractorModal.modal).toBeVisible()

    // Select "Add to existing colours" option
    const addRadio = page.getByLabel('Add to existing colours')
    await addRadio.check()

    // Get the number of colours to extract from the modal
    const numberOfColoursToExtract =
      await colourPaletteEditor.imageExtractorModal.getNumberOfColoursToExtract()

    // Click extract button in modal
    await colourPaletteEditor.imageExtractorModal.clickExtract()

    // Wait for extraction to complete and modal to close
    await expect(colourPaletteEditor.imageExtractorModal.modal).not.toBeVisible()

    // Should have initial colours + extracted colours
    await expect(async () => {
      const newCount = await colourPaletteEditor.getColourCount()
      expect(newCount).toBe(initialCount + numberOfColoursToExtract)
    }).toPass()
  })

  test('should close extraction modal with cancel', async ({colourPaletteEditor}) => {
    // Upload image
    await colourPaletteEditor.uploadImage(testImagePath)

    // Click extract button
    await colourPaletteEditor.extractButton.click()

    // Wait for modal
    await expect(colourPaletteEditor.imageExtractorModal.modal).toBeVisible()

    // Click cancel
    await colourPaletteEditor.imageExtractorModal.clickCancel()

    // Modal should close
    await expect(colourPaletteEditor.imageExtractorModal.modal).not.toBeVisible()
  })
})

test.describe('Image Zoom', () => {
  const testImagePath = join(__dirname, 'fixtures', 'test-images', 'sample.png')

  test('should show zoom slider when image is loaded', async ({colourPaletteEditor}) => {
    // Upload image
    await colourPaletteEditor.uploadImage(testImagePath)

    // Zoom component should be visible
    await expect(colourPaletteEditor.imageZoomComponent).toBeVisible()
  })

  test('should have zoom slider', async ({colourPaletteEditor}) => {
    // Upload image
    await colourPaletteEditor.uploadImage(testImagePath)

    // Zoom slider should exist
    await expect(colourPaletteEditor.imageZoomSlider).toBeVisible()
  })
})
