import {test, expect} from './fixtures/base'
import {fileURLToPath} from 'url'
import {dirname, join} from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

test.describe('Image File Operations', () => {
  const testImagePath = join(__dirname, 'fixtures', 'test-images', 'sample.png')

  test('should open file picker for image', async ({colourPalettePage}) => {
    // Find the file input (usually hidden)
    await expect(colourPalettePage.fileInput).toBeAttached()
  })

  test('should load an image file', async ({colourPalettePage}) => {
    // Upload the image
    await colourPalettePage.uploadImage(testImagePath)

    // Check if image canvas is visible
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

  test('should open colour extraction modal', async ({page, colourPalettePage}) => {
    // Upload image
    await colourPalettePage.uploadImage(testImagePath)

    // Click extract button
    await colourPalettePage.extractButton.click()

    // Modal should open
    const extractModal = page.locator('[data-testid="ImageColourExtractor Component"]')
    await expect(extractModal).toBeVisible()
  })

  test('should extract colours from image', async ({page, colourPalettePage}) => {
    // Get initial colour count
    const initialCount = await colourPalettePage.getColourCount()

    // Upload image
    await colourPalettePage.uploadImage(testImagePath)

    // Click extract button
    await colourPalettePage.extractButton.click()

    // Wait for modal
    await page.waitForSelector('[data-testid="ImageColourExtractor Component"]')

    // Click extract button in modal
    const modalExtractButton = page.getByRole('button', {name: 'Extract'})
    await modalExtractButton.click()

    // Wait for extraction to complete and modal to close
    // Should have more colours than before
    // We poll the colour count because extraction takes time
    await expect(async () => {
      const newCount = await colourPalettePage.getColourCount()
      expect(newCount).toBeGreaterThan(initialCount)
    }).toPass()
  })

  test('should close extraction modal with cancel', async ({page, colourPalettePage}) => {
    // Upload image
    await colourPalettePage.uploadImage(testImagePath)

    // Click extract button
    await colourPalettePage.extractButton.click()

    // Wait for modal
    const extractModal = page.locator('[data-testid="ImageColourExtractor Component"]')
    await expect(extractModal).toBeVisible()

    // Click cancel
    await page.getByRole('button', {name: 'Cancel'}).click()

    // Modal should close
    await expect(extractModal).not.toBeVisible()
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
