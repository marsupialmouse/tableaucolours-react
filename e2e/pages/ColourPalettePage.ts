import {Page} from '@playwright/test'

export class ColourPalettePage {
  constructor(private page: Page) {}

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

  async clickImport() {
    await this.page.locator('button[title="Import XML"]').click()
  }

  async clickExport() {
    await this.page.locator('button[title="Get XML"]').click()
  }

  async isVisible() {
    return this.page.locator('[data-testid="ColourPaletteEditor Component"]').isVisible()
  }
}
