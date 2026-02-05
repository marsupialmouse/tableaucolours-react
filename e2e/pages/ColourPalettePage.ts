import { Page } from '@playwright/test';

export class ColourPalettePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  getPaletteNameInput() {
    return this.page.getByRole('textbox', { name: /palette name/i });
  }

  async setPaletteName(name: string) {
    const input = this.getPaletteNameInput();
    await input.clear();
    await input.fill(name);
  }

  async getPaletteName() {
    const input = this.getPaletteNameInput();
    return input.inputValue();
  }

  async getColourItems() {
    return this.page.locator('[data-testid*="colour-list-item"]').all();
  }

  async getColourCount() {
    return this.page.locator('[data-testid*="colour-list-item"]').count();
  }

  async clickAddColour() {
    await this.page.getByRole('button', { name: /add colour/i }).click();
  }

  async clickRemoveColour(index: number) {
    const items = await this.getColourItems();
    if (items[index]) {
      await items[index].getByRole('button', { name: /remove/i }).click();
    }
  }

  async selectPaletteType(type: string) {
    await this.page.getByRole('button', { name: new RegExp(type, 'i') }).click();
  }

  async clickImport() {
    await this.page.getByRole('button', { name: /import/i }).click();
  }

  async clickExport() {
    await this.page.getByRole('button', { name: /get code/i }).click();
  }

  async isVisible() {
    return this.page.locator('[data-testid="colour-palette-editor"]').isVisible();
  }
}
