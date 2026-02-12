import {test, expect} from './fixtures/base'

test.describe('Keyboard Shortcuts', () => {
  test.describe('Color Grid Navigation', () => {
    test.describe('Standard Navigation', () => {
      test('should move selection down with ArrowDown', async ({page, colourPaletteEditor}) => {
        await test.step('setup: create 6 colors', async () => {
          await colourPaletteEditor.addColoursWithKeyboard(5)
        })

        await test.step('select first color', async () => {
          await colourPaletteEditor.selectColour(0)
        })

        await test.step('press ArrowDown and verify selection moved to index 1', async () => {
          await page.keyboard.press('ArrowDown')
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(1)
        })
      })

      test('should move selection up with ArrowUp', async ({page, colourPaletteEditor}) => {
        await test.step('setup: create 6 colors', async () => {
          await colourPaletteEditor.addColoursWithKeyboard(5)
        })

        await test.step('select third color (index 2)', async () => {
          await colourPaletteEditor.selectColour(2)
        })

        await test.step('press ArrowUp and verify selection moved to index 1', async () => {
          await page.keyboard.press('ArrowUp')
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(1)
        })
      })

      test('should move selection right to next column with ArrowRight', async ({
        page,
        colourPaletteEditor,
      }) => {
        await test.step('setup: create 7 colors (indexes 0-4 in col 1, 5-6 in col 2)', async () => {
          await colourPaletteEditor.addColoursWithKeyboard(6)
        })

        await test.step('select first color (index 0)', async () => {
          await colourPaletteEditor.selectColour(0)
        })

        await test.step('press ArrowRight and verify selection moved to index 5 (next column)', async () => {
          await page.keyboard.press('ArrowRight')
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(5)
        })
      })

      test('should move selection left to previous column with ArrowLeft', async ({
        page,
        colourPaletteEditor,
      }) => {
        await test.step('setup: create 11 colors (indexes 0-4 in col 1, 5-9 in col 2, 10 in col 3)', async () => {
          await colourPaletteEditor.addColoursWithKeyboard(10)
        })

        await test.step('select color at index 7 (row 2, col 2)', async () => {
          await colourPaletteEditor.selectColour(7)
        })

        await test.step('press ArrowLeft and verify selection moved to index 2 (row 2, col 1)', async () => {
          await page.keyboard.press('ArrowLeft')
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(2)
        })
      })
    })

    test.describe('Boundary/Edge Cases (No-Op)', () => {
      test('should not change selection when at top-left and pressing ArrowUp', async ({
        page,
        colourPaletteEditor,
      }) => {
        await test.step('setup: create 6 colors', async () => {
          await colourPaletteEditor.addColoursWithKeyboard(5)
        })

        await test.step('select first color (index 0)', async () => {
          await colourPaletteEditor.selectColour(0)
        })

        await test.step('press ArrowUp and verify no change', async () => {
          await page.keyboard.press('ArrowUp')
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(0)
        })
      })

      test('should not change selection when at top-left and pressing ArrowLeft', async ({
        page,
        colourPaletteEditor,
      }) => {
        await test.step('setup: create 6 colors', async () => {
          await colourPaletteEditor.addColoursWithKeyboard(5)
        })

        await test.step('select first color (index 0)', async () => {
          await colourPaletteEditor.selectColour(0)
        })

        await test.step('press ArrowLeft and verify no change', async () => {
          await page.keyboard.press('ArrowLeft')
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(0)
        })
      })

      test('should not change selection when at last item and pressing ArrowDown', async ({
        page,
        colourPaletteEditor,
      }) => {
        await test.step('setup: create 6 colors', async () => {
          await colourPaletteEditor.addColoursWithKeyboard(5)
        })

        await test.step('select last color (index 5)', async () => {
          await colourPaletteEditor.selectColour(5)
        })

        await test.step('press ArrowDown and verify no change', async () => {
          await page.keyboard.press('ArrowDown')
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(5)
        })
      })

      test('should not change selection when at last item and pressing ArrowRight', async ({
        page,
        colourPaletteEditor,
      }) => {
        await test.step('setup: create 6 colors', async () => {
          await colourPaletteEditor.addColoursWithKeyboard(5)
        })

        await test.step('select last color (index 5)', async () => {
          await colourPaletteEditor.selectColour(5)
        })

        await test.step('press ArrowRight and verify no change', async () => {
          await page.keyboard.press('ArrowRight')
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(5)
        })
      })
    })

    test.describe('Partial Grid Navigation (Mid-list gaps)', () => {
      test('should not change selection when at middle of column and pressing ArrowRight to empty slot', async ({
        page,
        colourPaletteEditor,
      }) => {
        await test.step('setup: create 6 colors (indexes 0-4 in col 1, index 5 in col 2)', async () => {
          await colourPaletteEditor.addColoursWithKeyboard(5)
        })

        await test.step('select middle color (index 2)', async () => {
          await colourPaletteEditor.selectColour(2)
        })

        await test.step('press ArrowRight and verify no change (no item at index 7)', async () => {
          await page.keyboard.press('ArrowRight')
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(2)
        })
      })

      test('should not change selection when at middle of column and pressing ArrowLeft to empty slot', async ({
        page,
        colourPaletteEditor,
      }) => {
        await test.step('setup: create 6 colors', async () => {
          await colourPaletteEditor.addColoursWithKeyboard(5)
        })

        await test.step('select middle color (index 2)', async () => {
          await colourPaletteEditor.selectColour(2)
        })

        await test.step('press ArrowLeft and verify no change (no item at index -3)', async () => {
          await page.keyboard.press('ArrowLeft')
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(2)
        })
      })

      test('should not wrap to next column when at bottom of column and pressing ArrowDown', async ({
        page,
        colourPaletteEditor,
      }) => {
        await test.step('setup: create 6 colors', async () => {
          await colourPaletteEditor.addColoursWithKeyboard(5)
        })

        await test.step('select bottom of first column (index 4)', async () => {
          await colourPaletteEditor.selectColour(4)
        })

        await test.step('press ArrowDown and verify no change (no wrap to next column)', async () => {
          await page.keyboard.press('ArrowDown')
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(4)
        })
      })
    })
  })

  test.describe('Color Reordering', () => {
    test.describe('Standard Reordering', () => {
      test('should move color down with Shift+ArrowDown', async ({page, colourPaletteEditor}) => {
        await test.step('setup: create 6 colors with distinct colors', async () => {
          await colourPaletteEditor.setColours([
            '#FF0000',
            '#00FF00',
            '#0000FF',
            '#FFFF00',
            '#FF00FF',
            '#00FFFF',
          ])
        })

        await test.step('select first color', async () => {
          await colourPaletteEditor.clickColour(0)
        })

        await test.step('press Shift+ArrowDown and verify color moved to index 1', async () => {
          await page.keyboard.press('Shift+ArrowDown')
          const colours = await colourPaletteEditor.getColours()
          expect(colours).toEqual([
            '#00FF00',
            '#FF0000',
            '#0000FF',
            '#FFFF00',
            '#FF00FF',
            '#00FFFF',
          ])
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(1)
        })
      })

      test('should move color up with Shift+ArrowUp', async ({page, colourPaletteEditor}) => {
        await test.step('setup: create 6 colors with distinct colors', async () => {
          await colourPaletteEditor.setColours([
            '#FF0000',
            '#00FF00',
            '#0000FF',
            '#FFFF00',
            '#FF00FF',
            '#00FFFF',
          ])
        })

        await test.step('select third color (index 2)', async () => {
          await colourPaletteEditor.clickColour(2)
        })

        await test.step('press Shift+ArrowUp and verify color moved to index 1', async () => {
          await page.keyboard.press('Shift+ArrowUp')
          const colours = await colourPaletteEditor.getColours()
          expect(colours).toEqual([
            '#FF0000',
            '#0000FF',
            '#00FF00',
            '#FFFF00',
            '#FF00FF',
            '#00FFFF',
          ])
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(1)
        })
      })

      test('should move color right to next column with Shift+ArrowRight', async ({
        page,
        colourPaletteEditor,
      }) => {
        await test.step('setup: create 6 colors with distinct colors', async () => {
          await colourPaletteEditor.setColours([
            '#FF0000',
            '#00FF00',
            '#0000FF',
            '#FFFF00',
            '#FF00FF',
            '#00FFFF',
          ])
        })

        await test.step('select first color (index 0)', async () => {
          await colourPaletteEditor.clickColour(0)
        })

        await test.step('press Shift+ArrowRight and verify color moved to index 5', async () => {
          await page.keyboard.press('Shift+ArrowRight')
          const colours = await colourPaletteEditor.getColours()
          expect(colours).toEqual([
            '#00FF00',
            '#0000FF',
            '#FFFF00',
            '#FF00FF',
            '#00FFFF',
            '#FF0000',
          ])
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(5)
        })
      })

      test('should move color left to previous column with Shift+ArrowLeft', async ({
        page,
        colourPaletteEditor,
      }) => {
        await test.step('setup: create 7 colors with distinct colors', async () => {
          await colourPaletteEditor.setColours([
            '#FF0000',
            '#00FF00',
            '#0000FF',
            '#FFFF00',
            '#FF00FF',
            '#00FFFF',
            '#808080',
          ])
        })

        await test.step('select color at index 6 (row 1, col 2)', async () => {
          await colourPaletteEditor.clickColour(6)
        })

        await test.step('press Shift+ArrowLeft and verify color moved to index 1 (row 1, col 1)', async () => {
          await page.keyboard.press('Shift+ArrowLeft')
          const colours = await colourPaletteEditor.getColours()
          expect(colours).toEqual([
            '#FF0000',
            '#808080',
            '#00FF00',
            '#0000FF',
            '#FFFF00',
            '#FF00FF',
            '#00FFFF',
          ])
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(1)
        })
      })
    })

    test.describe('Boundary Reordering (No-Op)', () => {
      test('should not move color when at top-left and pressing Shift+ArrowUp', async ({
        page,
        colourPaletteEditor,
      }) => {
        await test.step('setup: create 3 colors with distinct colors', async () => {
          await colourPaletteEditor.setColours(['#FF0000', '#00FF00', '#0000FF'])
        })

        await test.step('select first color (index 0)', async () => {
          await colourPaletteEditor.clickColour(0)
        })

        await test.step('press Shift+ArrowUp and verify no change', async () => {
          await page.keyboard.press('Shift+ArrowUp')
          const colours = await colourPaletteEditor.getColours()
          expect(colours).toEqual(['#FF0000', '#00FF00', '#0000FF'])
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(0)
        })
      })

      test('should not move color when at top-left and pressing Shift+ArrowLeft', async ({
        page,
        colourPaletteEditor,
      }) => {
        await test.step('setup: create 3 colors with distinct colors', async () => {
          await colourPaletteEditor.setColours(['#FF0000', '#00FF00', '#0000FF'])
        })

        await test.step('select first color (index 0)', async () => {
          await colourPaletteEditor.clickColour(0)
        })

        await test.step('press Shift+ArrowLeft and verify no change', async () => {
          await page.keyboard.press('Shift+ArrowLeft')
          const colours = await colourPaletteEditor.getColours()
          expect(colours).toEqual(['#FF0000', '#00FF00', '#0000FF'])
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(0)
        })
      })

      test('should not move color when at last item and pressing Shift+ArrowDown', async ({
        page,
        colourPaletteEditor,
      }) => {
        await test.step('setup: create 3 colors with distinct colors', async () => {
          await colourPaletteEditor.setColours(['#FF0000', '#00FF00', '#0000FF'])
        })

        await test.step('select last color (index 2)', async () => {
          await colourPaletteEditor.clickColour(2)
        })

        await test.step('press Shift+ArrowDown and verify no change', async () => {
          await page.keyboard.press('Shift+ArrowDown')
          const colours = await colourPaletteEditor.getColours()
          expect(colours).toEqual(['#FF0000', '#00FF00', '#0000FF'])
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(2)
        })
      })

      test('should not move color when at last item and pressing Shift+ArrowRight', async ({
        page,
        colourPaletteEditor,
      }) => {
        await test.step('setup: create 3 colors with distinct colors', async () => {
          await colourPaletteEditor.setColours(['#FF0000', '#00FF00', '#0000FF'])
        })

        await test.step('select last color (index 2)', async () => {
          await colourPaletteEditor.clickColour(2)
        })

        await test.step('press Shift+ArrowRight and verify no change', async () => {
          await page.keyboard.press('Shift+ArrowRight')
          const colours = await colourPaletteEditor.getColours()
          expect(colours).toEqual(['#FF0000', '#00FF00', '#0000FF'])
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(2)
        })
      })

      test('should not move color when at middle of column and pressing Shift+ArrowRight to empty slot', async ({
        page,
        colourPaletteEditor,
      }) => {
        await test.step('setup: create 6 colors with distinct colors', async () => {
          await colourPaletteEditor.setColours([
            '#FF0000',
            '#00FF00',
            '#0000FF',
            '#FFFF00',
            '#FF00FF',
            '#00FFFF',
          ])
        })

        await test.step('select middle color (index 2)', async () => {
          await colourPaletteEditor.clickColour(2)
        })

        await test.step('press Shift+ArrowRight and verify no change (cannot move to empty slot)', async () => {
          await page.keyboard.press('Shift+ArrowRight')
          const colours = await colourPaletteEditor.getColours()
          expect(colours).toEqual([
            '#FF0000',
            '#00FF00',
            '#0000FF',
            '#FFFF00',
            '#FF00FF',
            '#00FFFF',
          ])
          const selectedIndex = await colourPaletteEditor.getSelectedColourIndex()
          expect(selectedIndex).toBe(2)
        })
      })
    })
  })

  test.describe('Color Deletion', () => {
    test('should delete selected color with Delete key', async ({page, colourPaletteEditor}) => {
      await test.step('setup: create 3 colors with distinct colors', async () => {
        await colourPaletteEditor.setColours(['#FF0000', '#00FF00', '#0000FF'])
      })

      await test.step('select middle color (index 1)', async () => {
        await colourPaletteEditor.clickColour(1)
      })

      await test.step('press Delete and verify color was removed', async () => {
        await page.keyboard.press('Delete')
        const colours = await colourPaletteEditor.getColours()
        expect(colours).toEqual(['#FF0000', '#0000FF'])
      })
    })

    test('should delete selected color with Backspace key', async ({page, colourPaletteEditor}) => {
      await test.step('setup: create 3 colors with distinct colors', async () => {
        await colourPaletteEditor.setColours(['#FF0000', '#00FF00', '#0000FF'])
      })

      await test.step('select middle color (index 1)', async () => {
        await colourPaletteEditor.clickColour(1)
      })

      await test.step('press Backspace and verify color was removed', async () => {
        await page.keyboard.press('Backspace')
        const colours = await colourPaletteEditor.getColours()
        expect(colours).toEqual(['#FF0000', '#0000FF'])
      })
    })
  })

  test.describe('Type Selector Navigation', () => {
    test('should focus type selector and navigate with ArrowDown', async ({
      page,
      colourPaletteEditor,
    }) => {
      await test.step('verify initial type is Regular', async () => {
        const initialType = await colourPaletteEditor.getSelectedType()
        expect(initialType).toBe('Regular')
      })

      await test.step('focus type selector', async () => {
        await colourPaletteEditor.focusTypeSelector()
      })

      await test.step('press ArrowDown and verify type changed to Sequential', async () => {
        await page.keyboard.press('ArrowDown')
        const newType = await colourPaletteEditor.getSelectedType()
        expect(newType).toBe('Sequential')
      })
    })

    test('should navigate with ArrowUp', async ({page, colourPaletteEditor}) => {
      await test.step('setup: set type to Sequential', async () => {
        await colourPaletteEditor.setType('sequential')
        const currentType = await colourPaletteEditor.getSelectedType()
        expect(currentType).toBe('Sequential')
      })

      await test.step('focus type selector', async () => {
        await colourPaletteEditor.focusTypeSelector()
      })

      await test.step('press ArrowUp and verify type changed to Regular', async () => {
        await page.keyboard.press('ArrowUp')
        const newType = await colourPaletteEditor.getSelectedType()
        expect(newType).toBe('Regular')
      })
    })

    test('should toggle type selector with Enter', async ({page, colourPaletteEditor}) => {
      await test.step('focus type selector', async () => {
        await colourPaletteEditor.focusTypeSelector()
      })

      await test.step('press Enter to open selector', async () => {
        await page.keyboard.press('Enter')
        const selector = colourPaletteEditor.typeSelectorList
        await expect(selector).toBeVisible()
      })

      await test.step('press Enter again to close selector', async () => {
        await page.keyboard.press('Enter')
        const selector = colourPaletteEditor.typeSelectorList
        await expect(selector).not.toBeVisible()
      })
    })
  })

  test.describe('Add Color Shortcut', () => {
    test('should add new color with + key', async ({page, colourPaletteEditor}) => {
      const initialCount = await colourPaletteEditor.getColourCount()

      await page.keyboard.press('+')

      const newCount = await colourPaletteEditor.getColourCount()
      expect(newCount).toBe(initialCount + 1)
      const colours = await colourPaletteEditor.getColours()
      expect(colours[newCount - 1]).toBe('#FFFFFF')
    })

    test('should not add color when at maximum limit (20 colors)', async ({
      colourPaletteEditor,
      page,
    }) => {
      await test.step('setup: create 20 colors (maximum)', async () => {
        await colourPaletteEditor.addColoursWithKeyboard(19)
        const count = await colourPaletteEditor.getColourCount()
        expect(count).toBe(20)
      })

      const colorsBeforeAdd = await colourPaletteEditor.getColours()

      await page.keyboard.press('+')

      const count = await colourPaletteEditor.getColourCount()
      expect(count).toBe(20)
      const colorsAfterAdd = await colourPaletteEditor.getColours()
      expect(colorsAfterAdd).toEqual(colorsBeforeAdd)
    })
  })
})
