import {Page} from '@playwright/test'

export class ImportModal {
  constructor(private page: Page) {}

  get modal() {
    return this.page.locator('[data-testid="ColourPaletteImport Component"]')
  }

  get textarea() {
    return this.page.locator('[data-testid="ColourPaletteImport Code"]')
  }

  get importButton() {
    return this.page.getByRole('button', {name: 'Import'})
  }

  get cancelButton() {
    return this.page.getByRole('button', {name: 'Cancel'})
  }

  get validationMessage() {
    return this.page.locator('[data-testid="ColourPaletteImport Validation Message"]')
  }

  async isVisible() {
    return this.modal.isVisible()
  }

  async fillXML(xml: string) {
    await this.textarea.fill(xml)
  }

  async clickImport() {
    await this.importButton.click()
  }

  async clickCancel() {
    await this.cancelButton.click()
  }
}
