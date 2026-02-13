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

      await colourPaletteEditor.imageExtractorModal.setNumberOfColoursToExtract(5)
      await colourPaletteEditor.imageExtractorModal.selectReplaceColours()
      await colourPaletteEditor.imageExtractorModal.clickExtract()

      await expect(colourPaletteEditor.imageExtractorModal.modal).not.toBeVisible()
    })

    await test.step('verify extracted colours', async () => {
      const newCount = await colourPaletteEditor.getColourCount()
      expect(newCount).toBe(5)
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

      await colourPaletteEditor.imageExtractorModal.setNumberOfColoursToExtract(5)
      await colourPaletteEditor.imageExtractorModal.selectAddToExistingColours()
      await colourPaletteEditor.imageExtractorModal.clickExtract()

      await expect(colourPaletteEditor.imageExtractorModal.modal).not.toBeVisible()
    })

    await test.step('verify extracted colours', async () => {
      const newCount = await colourPaletteEditor.getColourCount()
      expect(newCount).toBe(6)
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

  test('should zoom in with Shift+Wheel', async ({colourPaletteEditor, page}) => {
    await test.step('setup colour and image', async () => {
      await colourPaletteEditor.setColour(0, '#FF0000')
      await colourPaletteEditor.selectColour(0)
      await colourPaletteEditor.uploadImage(testImagePath)
    })

    const initialZoom = await colourPaletteEditor.getZoomPercentage()
    const initialDimensions = await colourPaletteEditor.getImageDimensions()

    await test.step('perform zoom in with Shift+Wheel', async () => {
      await colourPaletteEditor.imageCanvasImage.hover()
      await page.keyboard.down('Shift')

      await colourPaletteEditor.imageCanvasImage.evaluate((el) => {
        el.dispatchEvent(new WheelEvent('wheel', {deltaY: -100, shiftKey: true, bubbles: true}))
      })

      await page.keyboard.up('Shift')
    })

    await test.step('verify zoom increased', async () => {
      const newZoom = await colourPaletteEditor.getZoomPercentage()
      expect(newZoom).toBeGreaterThan(initialZoom)

      const newDimensions = await colourPaletteEditor.getImageDimensions()
      expect(newDimensions.width).toBeGreaterThan(initialDimensions.width)
      expect(newDimensions.height).toBeGreaterThan(initialDimensions.height)
    })
  })

  test('should zoom out with Shift+Wheel', async ({colourPaletteEditor, page}) => {
    await test.step('setup colour and image', async () => {
      await colourPaletteEditor.setColour(0, '#FF0000')
      await colourPaletteEditor.selectColour(0)
      await colourPaletteEditor.uploadImage(testImagePath)
    })

    const initialZoom = await colourPaletteEditor.getZoomPercentage()
    const initialDimensions = await colourPaletteEditor.getImageDimensions()

    await test.step('perform zoom out with Shift+Wheel', async () => {
      await colourPaletteEditor.imageCanvasImage.hover()
      await page.keyboard.down('Shift')

      await colourPaletteEditor.imageCanvasImage.evaluate((el) => {
        el.dispatchEvent(new WheelEvent('wheel', {deltaY: 100, shiftKey: true, bubbles: true}))
      })

      await page.keyboard.up('Shift')
    })

    await test.step('verify zoom decreased', async () => {
      const newZoom = await colourPaletteEditor.getZoomPercentage()
      expect(newZoom).toBeLessThan(initialZoom)

      const newDimensions = await colourPaletteEditor.getImageDimensions()
      expect(newDimensions.width).toBeLessThan(initialDimensions.width)
      expect(newDimensions.height).toBeLessThan(initialDimensions.height)
    })
  })

  test('should zoom in with zoom in button', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.uploadImage(testImagePath)
    const initialZoom = await colourPaletteEditor.getZoomPercentage()
    const initialDimensions = await colourPaletteEditor.getImageDimensions()

    await colourPaletteEditor.imageZoomInButton.click()

    const newZoom = await colourPaletteEditor.getZoomPercentage()
    expect(newZoom).toBeGreaterThan(initialZoom)

    const newDimensions = await colourPaletteEditor.getImageDimensions()
    expect(newDimensions.width).toBeGreaterThan(initialDimensions.width)
    expect(newDimensions.height).toBeGreaterThan(initialDimensions.height)
  })

  test('should zoom out with zoom out button', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.uploadImage(testImagePath)
    const initialZoom = await colourPaletteEditor.getZoomPercentage()
    const initialDimensions = await colourPaletteEditor.getImageDimensions()

    await colourPaletteEditor.imageZoomOutButton.click()

    const newZoom = await colourPaletteEditor.getZoomPercentage()
    expect(newZoom).toBeLessThan(initialZoom)

    const newDimensions = await colourPaletteEditor.getImageDimensions()
    expect(newDimensions.width).toBeLessThan(initialDimensions.width)
    expect(newDimensions.height).toBeLessThan(initialDimensions.height)
  })

  test('should zoom with slider', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.uploadImage(testImagePath)
    const initialZoom = await colourPaletteEditor.getZoomPercentage()
    const initialDimensions = await colourPaletteEditor.getImageDimensions()

    // Move slider to the right (higher value = more zoom)
    await colourPaletteEditor.imageZoomSlider.fill('75')

    const newZoom = await colourPaletteEditor.getZoomPercentage()
    expect(newZoom).toBeGreaterThan(initialZoom)

    const newDimensions = await colourPaletteEditor.getImageDimensions()
    expect(newDimensions.width).toBeGreaterThan(initialDimensions.width)
    expect(newDimensions.height).toBeGreaterThan(initialDimensions.height)
  })
})

test.describe('Canvas Hints', () => {
  const testImagePath = join(__dirname, 'fixtures', 'test-images', 'sample.png')

  test('should show initial hint to open, paste or drop an image', async ({
    colourPaletteEditor,
  }) => {
    const hintText = await colourPaletteEditor.getHintText()
    expect(hintText).toBe('Open, paste or drop an image to get started')
  })

  test('should show hint to select colour after image loaded', async ({colourPaletteEditor}) => {
    await colourPaletteEditor.uploadImage(testImagePath)
    await expect(colourPaletteEditor.imageCanvasElement).toBeVisible()

    await expect(colourPaletteEditor.imageCanvasHint).toHaveText(
      'Select a colour in the palette to pick colours from the image'
    )
  })

  test('should hide hint when colour is selected and image is loaded', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.setColour(0, '#FF0000')
    await colourPaletteEditor.selectColour(0)
    await colourPaletteEditor.uploadImage(testImagePath)

    await expect(colourPaletteEditor.imageCanvasHint).not.toBeVisible()
  })
})

test.describe('Drag and Drop', () => {
  const testImagePath = join(__dirname, 'fixtures', 'test-images', 'sample.png')

  test('should show drop target overlay when dragging image over canvas', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.imageCanvas.evaluate((el) => {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(new File([''], 'test.png', {type: 'image/png'}))
      el.dispatchEvent(new DragEvent('dragenter', {dataTransfer, bubbles: true}))
    })

    await expect(colourPaletteEditor.imageDropTarget).toBeVisible()
  })

  test('should hide drop target overlay when drag leaves canvas', async ({colourPaletteEditor}) => {
    await test.step('trigger dragenter to show overlay', async () => {
      await colourPaletteEditor.imageCanvas.evaluate((el) => {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(new File([''], 'test.png', {type: 'image/png'}))
        el.dispatchEvent(new DragEvent('dragenter', {dataTransfer, bubbles: true}))
      })

      await expect(colourPaletteEditor.imageDropTarget).toBeVisible()
    })

    await test.step('trigger dragleave on drop target to hide overlay', async () => {
      await colourPaletteEditor.imageDropTarget.evaluate((el) => {
        el.dispatchEvent(new DragEvent('dragleave', {bubbles: true}))
      })

      await expect(colourPaletteEditor.imageDropTarget).not.toBeVisible()
    })
  })

  test('should load image when dropped on canvas', async ({colourPaletteEditor, page}) => {
    const fs = await import('fs')
    const imageBuffer = fs.readFileSync(testImagePath)
    const base64Image = imageBuffer.toString('base64')

    await page.evaluate(
      ({base64, canvasSelector}) => {
        const canvas = document.querySelector(canvasSelector)
        if (!canvas) throw new Error('Canvas not found')

        const byteCharacters = atob(base64)
        const byteArray = new Uint8Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i)
        }
        const blob = new Blob([byteArray], {type: 'image/png'})
        const file = new File([blob], 'test.png', {type: 'image/png'})

        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)

        canvas.dispatchEvent(new DragEvent('drop', {dataTransfer, bubbles: true}))
      },
      {
        base64: base64Image,
        canvasSelector: '[data-testid="ImageColourPickerImageCanvas Component"]',
      }
    )

    await expect(colourPaletteEditor.imageCanvasElement).toBeVisible()
    await expect(colourPaletteEditor.extractButton).toBeEnabled()
  })

  test('should replace existing image when new image is dropped', async ({
    colourPaletteEditor,
    page,
  }) => {
    await colourPaletteEditor.uploadImage(testImagePath)
    await expect(colourPaletteEditor.extractButton).toBeEnabled()

    const fs = await import('fs')
    const imageBuffer = fs.readFileSync(testImagePath)
    const base64Image = imageBuffer.toString('base64')

    await page.evaluate(
      ({base64, canvasSelector}) => {
        const canvas = document.querySelector(canvasSelector)
        if (!canvas) throw new Error('Canvas not found')

        const byteCharacters = atob(base64)
        const byteArray = new Uint8Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i)
        }
        const blob = new Blob([byteArray], {type: 'image/png'})
        const file = new File([blob], 'replacement.png', {type: 'image/png'})

        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)

        canvas.dispatchEvent(new DragEvent('drop', {dataTransfer, bubbles: true}))
      },
      {
        base64: base64Image,
        canvasSelector: '[data-testid="ImageColourPickerImageCanvas Component"]',
      }
    )

    await expect(colourPaletteEditor.imageCanvasElement).toBeVisible()
    await expect(colourPaletteEditor.extractButton).toBeEnabled()
  })

  test('should ignore non-image files dropped on canvas', async ({colourPaletteEditor, page}) => {
    await page.evaluate((canvasSelector) => {
      const canvas = document.querySelector(canvasSelector)
      if (!canvas) throw new Error('Canvas not found')

      const file = new File(['hello world'], 'test.txt', {type: 'text/plain'})
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      canvas.dispatchEvent(new DragEvent('drop', {dataTransfer, bubbles: true}))
    }, '[data-testid="ImageColourPickerImageCanvas Component"]')

    await expect(colourPaletteEditor.extractButton).toBeDisabled()
  })
})
