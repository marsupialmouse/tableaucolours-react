import {Page} from '@playwright/test'
import {ImportModal} from './ImportModal'
import {ExportModal} from './ExportModal'
import {ImageExtractorModal} from './ImageExtractorModal'

export class ColourPaletteEditor {
  readonly importModal: ImportModal
  readonly exportModal: ExportModal
  readonly imageExtractorModal: ImageExtractorModal

  constructor(private page: Page) {
    this.importModal = new ImportModal(page)
    this.exportModal = new ExportModal(page)
    this.imageExtractorModal = new ImageExtractorModal(page)
  }

  async goto() {
    await this.page.goto('/')
  }

  getPaletteNameInput() {
    return this.page.locator('input#name')
  }

  async setPaletteName(name: string) {
    const input = this.getPaletteNameInput()
    await input.clear()
    await input.fill(name)
  }

  async getPaletteName() {
    const input = this.getPaletteNameInput()
    return input.inputValue()
  }

  async getColourItems() {
    return this.page.getByTestId('ColourPaletteColourListItem Component').all()
  }

  async getColourCount() {
    return this.page.getByTestId('ColourPaletteColourListItem Component').count()
  }

  async clickAddColour() {
    await this.page.locator('button[title="Add colour (+)"]').click()
  }

  async clickRemoveColour(index: number) {
    const items = await this.getColourItems()
    if (items[index]) {
      await items[index].hover()
      await items[index].getByTestId('ColourPaletteColourListItem Remove Button').click()
    }
  }

  async setType(type: string) {
    // Open type selector
    await this.typeSelector.click()
    // Click the type in the selector list
    await this.typeSelectorList.getByText(type).click()
  }

  async getSelectedType() {
    const selectedElement = this.typeSelector.getByTestId('ColourPaletteTypeSelector Selected')
    const label = selectedElement.locator('label')
    return label.textContent()
  }

  async clickImport() {
    await this.page.locator('button[title="Import XML"]').click()
  }

  async clickExport() {
    await this.page.locator('button[title="Get XML"]').click()
  }

  async isVisible() {
    return this.page.getByTestId('ColourPaletteEditor Component').isVisible()
  }

  // Type selector getters
  get typeSelector() {
    return this.page.getByTestId('ColourPaletteTypeSelector Component')
  }

  get typeSelectorList() {
    return this.page.getByTestId('ColourPaletteTypeSelector Selector')
  }

  // Image-related getters and methods
  get fileInput() {
    return this.page.locator('input[type="file"]')
  }

  get imageCanvas() {
    return this.page.getByTestId('ImageColourPickerImageCanvas Component')
  }

  get imageCanvasElement() {
    return this.page.getByTestId('ImageColourPickerImage Canvas')
  }

  get extractButton() {
    return this.page.locator('button[title="Extract colours from image (magic!)"]')
  }

  get imageZoomComponent() {
    return this.page.getByTestId('ImageZoom Component')
  }

  get imageZoomSlider() {
    return this.page.getByTestId('ImageZoom Slider')
  }

  get openImageButton() {
    return this.page.locator('button[title="Open image..."]')
  }

  async uploadImage(imagePath: string) {
    // Set up file chooser listener before clicking the button
    const fileChooserPromise = this.page.waitForEvent('filechooser')
    await this.openImageButton.click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(imagePath)
  }

  async clickOpenImageButton() {
    const fileChooserPromise = this.page.waitForEvent('filechooser', {timeout: 5000})
    await this.openImageButton.click()
    return await fileChooserPromise
  }

  async getColours() {
    const items = await this.getColourItems()
    const colours: string[] = []
    for (const item of items) {
      const swatch = item.getByTestId('ColourPaletteColourListItem Swatch')
      /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any */
      const backgroundColor: string = await swatch.evaluate((el: any) => {
        return el.ownerDocument.defaultView.getComputedStyle(el).backgroundColor
      })
      /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any */
      // Convert RGB to hex
      const rgbMatch = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(backgroundColor)
      if (rgbMatch) {
        const r = parseInt(rgbMatch[1], 10)
        const g = parseInt(rgbMatch[2], 10)
        const b = parseInt(rgbMatch[3], 10)
        const hex =
          '#' +
          [r, g, b]
            .map((x) => {
              const hex = x.toString(16)
              return hex.length === 1 ? '0' + hex : hex
            })
            .join('')
            .toUpperCase()
        colours.push(hex)
      }
    }
    return colours
  }

  async setColour(index: number, hex: string) {
    const items = await this.getColourItems()
    if (items[index]) {
      const swatch = items[index].getByTestId('ColourPaletteColourListItem Swatch')
      await swatch.dblclick()

      const colourPicker = items[index].getByTestId('ColourPaletteColourListItem Colour Picker')
      await colourPicker.waitFor({state: 'visible'})

      const hexInput = colourPicker.locator('input').nth(0)
      await hexInput.clear()
      await hexInput.fill(hex.replace('#', ''))
      await hexInput.press('Enter')
    }
  }
}
