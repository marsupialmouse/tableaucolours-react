import {test as base} from '@playwright/test'
import {ColourPaletteEditor} from '../pages/ColourPaletteEditor'

// Declare the types of your fixtures.
interface ColourPaletteFixtures {
  colourPaletteEditor: ColourPaletteEditor
}

// Extend base test by providing "colourPaletteEditor".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<ColourPaletteFixtures>({
  colourPaletteEditor: async ({page}, use) => {
    // Set up the fixture.
    const colourPaletteEditor = new ColourPaletteEditor(page)
    await colourPaletteEditor.goto()

    // Use the fixture value in the test.
    await use(colourPaletteEditor)

    // Clean up the fixture (if needed).
    // No cleanup needed for this fixture.
  },
})

export {expect} from '@playwright/test'
