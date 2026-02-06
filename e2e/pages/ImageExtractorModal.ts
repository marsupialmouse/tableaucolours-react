import {Page} from '@playwright/test'

export class ImageExtractorModal {
  constructor(private page: Page) {}

  get modal() {
    return this.page.locator('[data-testid="ImageColourExtractor Component"]')
  }

  get extractButton() {
    return this.page.getByRole('button', {name: 'Extract'})
  }

  get cancelButton() {
    return this.page.getByRole('button', {name: 'Cancel'})
  }

  get numberInput() {
    return this.page.locator('[data-testid="ImageColourExtractor Number Input"]')
  }

  async isVisible() {
    return this.modal.isVisible()
  }

  async clickExtract() {
    await this.extractButton.click()
  }

  async clickCancel() {
    await this.cancelButton.click()
  }

  async getNumberOfColoursToExtract() {
    return parseInt(await this.numberInput.inputValue(), 10)
  }

  async setNumberOfColoursToExtract(count: number) {
    await this.numberInput.clear()
    await this.numberInput.fill(count.toString())
  }
}
