import {Page} from '@playwright/test'

export class ExportModal {
  constructor(private page: Page) {}

  get modal() {
    return this.page.getByTestId('ColourPaletteGetCode Component')
  }

  get codeContainer() {
    return this.page.getByTestId('ColourPaletteGetCode Code')
  }

  get copyButton() {
    return this.page.getByTestId('ColourPaletteGetCode Button')
  }

  async isVisible() {
    return this.modal.isVisible()
  }

  async getXMLContent() {
    return this.codeContainer.textContent()
  }

  async clickCopyToClipboard() {
    await this.copyButton.click()
  }

  async getCopyButtonText() {
    return this.copyButton.textContent()
  }

  async close() {
    await this.page.keyboard.press('Escape')
  }
}
