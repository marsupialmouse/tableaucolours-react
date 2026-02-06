import {Page, FileChooser} from '@playwright/test'
import {ImportModal} from './ImportModal'
import {ExportModal} from './ExportModal'
import {ImageExtractorModal} from './ImageExtractorModal'

export class ColourPalettePage {
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
    return this.page.locator('[data-testid="ColourPaletteColourListItem Component"]').all()
  }

  async getColourCount() {
    return this.page.locator('[data-testid="ColourPaletteColourListItem Component"]').count()
  }

  async clickAddColour() {
    await this.page.locator('button[title="Add colour (+)"]').click()
  }

  async clickRemoveColour(index: number) {
    const items = await this.getColourItems()
    if (items[index]) {
      // Hover to make remove button visible
      await items[index].hover()
      await items[index]
        .locator('[data-testid="ColourPaletteColourListItem Remove Button"]')
        .click()
    }
  }

  async selectPaletteType(type: string) {
    await this.page.locator(`button[title*="${type}"]`).click()
  }

  async setType(type: string) {
    // Open type selector
    await this.typeSelector.click()
    // Click the type in the selector list
    await this.typeSelectorList.getByText(type).click()
  }

  async getSelectedType() {
    const selectedElement = this.page.locator('[data-testid="ColourPaletteTypeSelector Selected"]')
    return selectedElement.getAttribute('data-selected-type')
  }

  async clickImport() {
    await this.page.locator('button[title="Import XML"]').click()
  }

  async clickExport() {
    await this.page.locator('button[title="Get XML"]').click()
  }

  async isVisible() {
    return this.page.locator('[data-testid="ColourPaletteEditor Component"]').isVisible()
  }

  // Type selector getters
  get typeSelector() {
    return this.page.locator('[data-testid="ColourPaletteTypeSelector Component"]')
  }

  get typeSelectorList() {
    return this.page.locator('[data-testid="ColourPaletteTypeSelector Selector"]')
  }

  // Image-related getters and methods
  get fileInput() {
    return this.page.locator('input[type="file"]')
  }

  get imageCanvas() {
    return this.page.locator('[data-testid="ImageColourPickerImageCanvas Component"]')
  }

  get extractButton() {
    return this.page.locator('button[title="Extract colours from image (magic!)"]')
  }

  get imageZoomComponent() {
    return this.page.locator('[data-testid="ImageZoom Component"]')
  }

  get imageZoomSlider() {
    return this.page.locator('[data-testid="ImageZoom Slider"]')
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

  async clickOpenImageButton(): Promise<FileChooser> {
    const fileChooserPromise = this.page.waitForEvent('filechooser')
    await this.openImageButton.click()
    return fileChooserPromise
  }

  async getColours() {
    const items = await this.getColourItems()
    const colours: string[] = []
    for (const item of items) {
      const title = await item.getAttribute('title')
      if (title) {
        // Title is in format "#FFFFFF (double click to edit)"
        const regex = /^(#[0-9A-Fa-f]{6})/
        const match = regex.exec(title)
        if (match) {
          colours.push(match[1].toUpperCase())
        }
      }
    }
    return colours
  }
}
