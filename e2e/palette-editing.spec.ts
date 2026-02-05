import { test, expect } from './fixtures/base';
import { ColourPalettePage } from './pages/ColourPalettePage';

test.describe('Colour Palette Creation', () => {
  test('should have palette name input', async ({ page }) => {
    const palettePage = new ColourPalettePage(page);
    await palettePage.goto();

    const input = palettePage.getPaletteNameInput();
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder', 'Enter a palette name');
  });

  test('should allow changing palette name', async ({ page }) => {
    const palettePage = new ColourPalettePage(page);
    await palettePage.goto();

    const newName = 'My Custom Palette';
    await palettePage.setPaletteName(newName);

    const savedName = await palettePage.getPaletteName();
    expect(savedName).toBe(newName);
  });
});

test.describe('Colour Palette Editing', () => {
  test('should have initial colours', async ({ page }) => {
    const palettePage = new ColourPalettePage(page);
    await palettePage.goto();

    const initialCount = await palettePage.getColourCount();
    expect(initialCount).toBeGreaterThan(0);
  });

  test('should add a new colour', async ({ page }) => {
    const palettePage = new ColourPalettePage(page);
    await palettePage.goto();

    const initialCount = await palettePage.getColourCount();
    
    await palettePage.clickAddColour();
    
    const newCount = await palettePage.getColourCount();
    expect(newCount).toBe(initialCount + 1);
  });

  test('should remove a colour', async ({ page }) => {
    const palettePage = new ColourPalettePage(page);
    await palettePage.goto();

    // Ensure we have at least 2 colours
    const initialCount = await palettePage.getColourCount();
    if (initialCount < 2) {
      await palettePage.clickAddColour();
    }

    const countBeforeRemove = await palettePage.getColourCount();
    
    await palettePage.clickRemoveColour(0);
    
    const countAfterRemove = await palettePage.getColourCount();
    expect(countAfterRemove).toBe(countBeforeRemove - 1);
  });
});
