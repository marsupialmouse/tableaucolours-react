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
    const fileChooser = await colourPaletteEditor.clickOpenImageButton()
    expect(fileChooser).toBeTruthy()
  })

  test('should load an image file and display it', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.uploadImage(testImagePath)

    await expect(colourPaletteEditor.imageCanvas).toBeVisible()
    await expect(colourPaletteEditor.imageCanvasElement).toBeVisible()

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
    await expect(colourPaletteEditor.extractButton).toBeDisabled()

    await colourPaletteEditor.uploadImage(testImagePath)

    await expect(colourPaletteEditor.extractButton).toBeEnabled()
  })
})

test.describe('Image Colour Extraction', () => {
  const testImagePath = join(__dirname, 'fixtures', 'test-images', 'sample.png')

  test('should open colour extraction modal', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.uploadImage(testImagePath)
    await colourPaletteEditor.extractButton.click()

    await expect(colourPaletteEditor.imageExtractorModal.modal).toBeVisible()
  })

  test('should replace colours when extracting from image', async ({colourPaletteEditor}) => {
    await test.step('setup initial colours', async () => {
      await colourPaletteEditor.clickAddColour()
      await colourPaletteEditor.clickAddColour()
      const initialCount = await colourPaletteEditor.getColourCount()
      expect(initialCount).toBeGreaterThan(1)
    })

    await test.step('extract colours with replace option', async () => {
      await colourPaletteEditor.uploadImage(testImagePath)
      await colourPaletteEditor.extractButton.click()
      await expect(colourPaletteEditor.imageExtractorModal.modal).toBeVisible()

      const numberOfColoursToExtract =
        await colourPaletteEditor.imageExtractorModal.getNumberOfColoursToExtract()

      await colourPaletteEditor.imageExtractorModal.selectReplaceColours()
      await colourPaletteEditor.imageExtractorModal.clickExtract()

      await expect(colourPaletteEditor.imageExtractorModal.modal).not.toBeVisible()

      await expect(async () => {
        const newCount = await colourPaletteEditor.getColourCount()
        expect(newCount).toBe(numberOfColoursToExtract)
      }).toPass()
    })
  })

  test('should add colours when extracting from image with add option', async ({
    colourPaletteEditor,
  }) => {
    await test.step('verify initial state', async () => {
      const initialCount = await colourPaletteEditor.getColourCount()
      expect(initialCount).toBe(1)
    })

    await test.step('extract colours with add option', async () => {
      await colourPaletteEditor.uploadImage(testImagePath)
      await colourPaletteEditor.extractButton.click()
      await expect(colourPaletteEditor.imageExtractorModal.modal).toBeVisible()

      const numberOfColoursToExtract =
        await colourPaletteEditor.imageExtractorModal.getNumberOfColoursToExtract()

      await colourPaletteEditor.imageExtractorModal.selectAddToExistingColours()
      await colourPaletteEditor.imageExtractorModal.clickExtract()

      await expect(colourPaletteEditor.imageExtractorModal.modal).not.toBeVisible()
      const newCount = await colourPaletteEditor.getColourCount()
      expect(newCount).toBe(1 + numberOfColoursToExtract)
    })
  })

  test('should close extraction modal with cancel', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.uploadImage(testImagePath)
    await colourPaletteEditor.extractButton.click()
    await expect(colourPaletteEditor.imageExtractorModal.modal).toBeVisible()

    await colourPaletteEditor.imageExtractorModal.clickCancel()

    await expect(colourPaletteEditor.imageExtractorModal.modal).not.toBeVisible()
  })
})

test.describe('Image Zoom', () => {
  const testImagePath = join(__dirname, 'fixtures', 'test-images', 'sample.png')

  test('should show zoom slider when image is loaded', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.uploadImage(testImagePath)
    await expect(colourPaletteEditor.imageZoomComponent).toBeVisible()
  })

  test('should have zoom slider', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.uploadImage(testImagePath)
    await expect(colourPaletteEditor.imageZoomSlider).toBeVisible()
  })
})
