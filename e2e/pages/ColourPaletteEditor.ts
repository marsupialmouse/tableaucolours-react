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
    await this.page.locator('button[title="Add colour (+)"]').click({force: true})
  }

  async clickRemoveColour(index: number) {
    const items = await this.getColourItems()
    if (items[index]) {
      // Hover to make remove button visible
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

  async getSelectedColourIndex() {
    const items = await this.getColourItems()
    let selectedIndex = -1
    let selectedCount = 0

    for (let index = 0; index < items.length; index++) {
      const classList = await items[index].getAttribute('class')
      if (classList?.includes('colour--selected')) {
        selectedIndex = index
        selectedCount++
      }
    }

    if (selectedCount > 1) {
      throw new Error(
        `Expected exactly one selected color, but found ${String(selectedCount)} selected colors`
      )
    }

    return selectedIndex
  }

  async clickColour(index: number) {
    const items = await this.getColourItems()
    if (items[index]) {
      await items[index].click()
    }
  }

  async focusTypeSelector() {
    const selectedElement = this.typeSelector.getByTestId('ColourPaletteTypeSelector Selected')
    await selectedElement.focus()
  }

  async addColoursWithKeyboard(count: number) {
    const initialCount = await this.getColourCount()
    for (let colorIndex = 0; colorIndex < count; colorIndex++) {
      await this.page.keyboard.press('+')
    }
    // Wait for the last color to be added (unless we're at max)
    const expectedCount = Math.min(initialCount + count, 20)
    if (expectedCount > initialCount) {
      await this.page
        .getByTestId('ColourPaletteColourListItem Component')
        .nth(expectedCount - 1)
        .waitFor({state: 'attached', timeout: 5000})
    }
  }

  async setColours(hexColors: string[]) {
    const initialCount = await this.getColourCount()

    // Delete all existing colors if there are any
    if (initialCount > 0) {
      // Set up dialog handler
      this.page.once('dialog', async (dialog) => {
        await dialog.accept()
      })

      // The "Delete all colours" button is hidden in the DOM (display:none or visibility:hidden)
      // when setColours() is called. Playwright correctly refuses to click hidden elements.
      // Use JavaScript evaluation to click it directly, bypassing visibility checks.
      await this.page.evaluate(`
        const button = document.querySelector('button[title="Delete all colours"]');
        if (button) button.click();
      `)

      // Wait for colors to be deleted (should have 0 colors)
      await this.page.waitForFunction(
        `document.querySelectorAll('[data-testid="ColourPaletteColourListItem Component"]').length === 0`,
        {timeout: 5000}
      )
    }

    // Add all the colors needed
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < hexColors.length; i++) {
      await this.page.keyboard.press('+')
    }

    // Wait for colors to be added
    if (hexColors.length > 0) {
      await this.page
        .getByTestId('ColourPaletteColourListItem Component')
        .nth(hexColors.length - 1)
        .waitFor({state: 'attached', timeout: 5000})
    }

    // Set each color to the specified hex value
    for (let i = 0; i < hexColors.length; i++) {
      await this.setColour(i, hexColors[i])
    }
  }

  async getSelectedColourCount() {
    const items = await this.getColourItems()
    let count = 0
    for (const item of items) {
      const classList = await item.getAttribute('class')
      if (classList?.includes('colour--selected')) {
        count++
      }
    }
    return count
  }
}
