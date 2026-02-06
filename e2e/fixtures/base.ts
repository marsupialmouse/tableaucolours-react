import {test as base} from '@playwright/test'
import {ColourPalettePage} from '../pages/ColourPalettePage'

// Declare the types of your fixtures.
interface ColourPaletteFixtures {
  colourPalettePage: ColourPalettePage
}

// Extend base test by providing "colourPalettePage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
// The fixture runs automatically for every test (auto: true), ensuring the page is always navigated.
export const test = base.extend<ColourPaletteFixtures>({
  colourPalettePage: [
    async ({page}, use) => {
      // Set up the fixture.
      const colourPalettePage = new ColourPalettePage(page)
      await colourPalettePage.goto()

      // Use the fixture value in the test.
      await use(colourPalettePage)

      // Clean up the fixture (if needed).
      // No cleanup needed for this fixture.
    },
    {auto: true},
  ],
})

export {expect} from '@playwright/test'
