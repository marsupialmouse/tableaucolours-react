import {Page} from '@playwright/test'

export class ExportModal {
  constructor(private page: Page) {}

  get modal() {
    return this.page.locator('[data-testid="ColourPaletteGetCode Component"]')
  }

  get codeContainer() {
    return this.page.locator('[data-testid="ColourPaletteGetCode Code"]')
  }

  async isVisible() {
    return this.modal.isVisible()
  }

  async getXMLContent() {
    return this.codeContainer.textContent()
  }

  async close() {
    await this.page.keyboard.press('Escape')
  }
}
