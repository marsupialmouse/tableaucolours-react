import {test, expect} from './fixtures/base'
import {fileURLToPath} from 'url'
import {dirname, join} from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

test.describe('Image File Operations', () => {
  const testImagePath = join(__dirname, 'fixtures', 'test-images', 'sample.png')

  test('should open file chooser when Open Image button is clicked', async ({
    colourPalettePage,
  }) => {
    // Click the button and verify file chooser opens
    const fileChooser = await colourPalettePage.clickOpenImageButton()

    // Verify file chooser was opened
    expect(fileChooser).toBeTruthy()
  })

  test('should load an image file and display it', async ({colourPalettePage}) => {
    // Upload the image
    await colourPalettePage.uploadImage(testImagePath)

    // Check if image canvas is visible (verifies image is displayed)
    await expect(colourPalettePage.imageCanvas).toBeVisible()
  })

  test('should enable extract colours button when image is loaded', async ({colourPalettePage}) => {
    // Initially, extract button should be disabled
    await expect(colourPalettePage.extractButton).toBeDisabled()

    // Upload the image
    await colourPalettePage.uploadImage(testImagePath)

    // Extract button should now be enabled
    await expect(colourPalettePage.extractButton).toBeEnabled()
  })
})

test.describe('Image Colour Extraction', () => {
  const testImagePath = join(__dirname, 'fixtures', 'test-images', 'sample.png')

  test('should open colour extraction modal', async ({colourPalettePage}) => {
    // Upload image
    await colourPalettePage.uploadImage(testImagePath)

    // Click extract button
    await colourPalettePage.extractButton.click()

    // Modal should open
    await expect(colourPalettePage.imageExtractorModal.modal).toBeVisible()
  })

  test('should replace colours when extracting from image', async ({colourPalettePage}) => {
    // Add some initial colours to be replaced
    await colourPalettePage.clickAddColour()
    await colourPalettePage.clickAddColour()
    const initialCount = await colourPalettePage.getColourCount()
    expect(initialCount).toBeGreaterThan(1)

    // Upload image
    await colourPalettePage.uploadImage(testImagePath)

    // Click extract button
    await colourPalettePage.extractButton.click()

    // Wait for modal
    await expect(colourPalettePage.imageExtractorModal.modal).toBeVisible()

    // Click extract button in modal (default should replace colours)
    await colourPalettePage.imageExtractorModal.clickExtract()

    // Wait for extraction to complete and modal to close
    await expect(colourPalettePage.imageExtractorModal.modal).not.toBeVisible()

    // Should have the default number of extracted colours (not initial + extracted)
    // The default extraction typically extracts 10 colours
    await expect(async () => {
      const newCount = await colourPalettePage.getColourCount()
      // Verify colours were replaced, not added
      expect(newCount).toBeGreaterThan(0)
      expect(newCount).toBeLessThanOrEqual(10)
    }).toPass()
  })

  test('should add colours when extracting from image with add option', async ({
    page,
    colourPalettePage,
  }) => {
    // Start with known initial state
    const initialCount = await colourPalettePage.getColourCount()
    expect(initialCount).toBe(1)

    // Upload image
    await colourPalettePage.uploadImage(testImagePath)

    // Click extract button
    await colourPalettePage.extractButton.click()

    // Wait for modal
    await expect(colourPalettePage.imageExtractorModal.modal).toBeVisible()

    // Select "Add to existing colours" option
    const addRadio = page.getByLabel('Add to existing colours')
    await addRadio.check()

    // Click extract button in modal
    await colourPalettePage.imageExtractorModal.clickExtract()

    // Wait for extraction to complete and modal to close
    await expect(colourPalettePage.imageExtractorModal.modal).not.toBeVisible()

    // Should have initial colours + extracted colours
    await expect(async () => {
      const newCount = await colourPalettePage.getColourCount()
      expect(newCount).toBeGreaterThan(initialCount)
    }).toPass()
  })

  test('should close extraction modal with cancel', async ({colourPalettePage}) => {
    // Upload image
    await colourPalettePage.uploadImage(testImagePath)

    // Click extract button
    await colourPalettePage.extractButton.click()

    // Wait for modal
    await expect(colourPalettePage.imageExtractorModal.modal).toBeVisible()

    // Click cancel
    await colourPalettePage.imageExtractorModal.clickCancel()

    // Modal should close
    await expect(colourPalettePage.imageExtractorModal.modal).not.toBeVisible()
  })
})

test.describe('Image Zoom', () => {
  const testImagePath = join(__dirname, 'fixtures', 'test-images', 'sample.png')

  test('should show zoom slider when image is loaded', async ({colourPalettePage}) => {
    // Upload image
    await colourPalettePage.uploadImage(testImagePath)

    // Zoom component should be visible
    await expect(colourPalettePage.imageZoomComponent).toBeVisible()
  })

  test('should have zoom slider', async ({colourPalettePage}) => {
    // Upload image
    await colourPalettePage.uploadImage(testImagePath)

    // Zoom slider should exist
    await expect(colourPalettePage.imageZoomSlider).toBeVisible()
  })
})
