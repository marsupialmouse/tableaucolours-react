import {test, expect} from './fixtures/base'
import {ColourPalettePage} from './pages/ColourPalettePage'
import {fileURLToPath} from 'url'
import {dirname, join} from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

test.describe('Image File Operations', () => {
  const testImagePath = join(__dirname, 'fixtures', 'test-images', 'sample.png')

  test('should open file picker for image', async ({page}) => {
    const palettePage = new ColourPalettePage(page)
    await palettePage.goto()

    // Find the file input (usually hidden)
    const fileInput = page.locator('input[type="file"]')
    await expect(fileInput).toBeAttached()
  })

  test('should load an image file', async ({page}) => {
    const palettePage = new ColourPalettePage(page)
    await palettePage.goto()

    // Upload the image
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    // Check if image canvas is visible
    const imageCanvas = page.locator('[data-testid="ImageColourPickerImageCanvas Component"]')
    await expect(imageCanvas).toBeVisible()
  })

  test('should enable extract colours button when image is loaded', async ({page}) => {
    const palettePage = new ColourPalettePage(page)
    await palettePage.goto()

    // Initially, extract button should be disabled
    const extractButton = page.locator('button[title="Extract colours from image (magic!)"]')
    await expect(extractButton).toBeDisabled()

    // Upload the image
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    // Extract button should now be enabled
    await expect(extractButton).toBeEnabled()
  })
})

test.describe('Image Colour Extraction', () => {
  const testImagePath = join(__dirname, 'fixtures', 'test-images', 'sample.png')

  test('should open colour extraction modal', async ({page}) => {
    const palettePage = new ColourPalettePage(page)
    await palettePage.goto()

    // Upload image
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    // Click extract button
    const extractButton = page.locator('button[title="Extract colours from image (magic!)"]')
    await extractButton.click()

    // Modal should open
    const extractModal = page.locator('[data-testid="ImageColourExtractor Component"]')
    await expect(extractModal).toBeVisible()
  })

  test('should extract colours from image', async ({page}) => {
    const palettePage = new ColourPalettePage(page)
    await palettePage.goto()

    // Get initial colour count
    const initialCount = await palettePage.getColourCount()

    // Upload image
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    // Click extract button
    const extractButton = page.locator('button[title="Extract colours from image (magic!)"]')
    await extractButton.click()

    // Wait for modal
    await page.waitForSelector('[data-testid="ImageColourExtractor Component"]')

    // Click extract button in modal
    const modalExtractButton = page.getByRole('button', {name: 'Extract'})
    await modalExtractButton.click()

    // Wait for extraction to complete and modal to close
    // Should have more colours than before
    // We poll the colour count because extraction takes time
    await expect(async () => {
      const newCount = await palettePage.getColourCount()
      expect(newCount).toBeGreaterThan(initialCount)
    }).toPass()
  })

  test('should close extraction modal with cancel', async ({page}) => {
    const palettePage = new ColourPalettePage(page)
    await palettePage.goto()

    // Upload image
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    // Click extract button
    const extractButton = page.locator('button[title="Extract colours from image (magic!)"]')
    await extractButton.click()

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

  test('should show zoom slider when image is loaded', async ({page}) => {
    const palettePage = new ColourPalettePage(page)
    await palettePage.goto()

    // Upload image
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    // Zoom component should be visible
    const zoomComponent = page.locator('[data-testid="ImageZoom Component"]')
    await expect(zoomComponent).toBeVisible()
  })

  test('should have zoom slider', async ({page}) => {
    const palettePage = new ColourPalettePage(page)
    await palettePage.goto()

    // Upload image
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(testImagePath)

    // Zoom slider should exist
    const zoomSlider = page.locator('[data-testid="ImageZoom Slider"]')
    await expect(zoomSlider).toBeVisible()
  })
})
