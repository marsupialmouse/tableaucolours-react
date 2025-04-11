import {describe, expect, it, test} from 'vitest'
import {screen} from '@testing-library/react'
import ColourPaletteColourList from './ColourPaletteColourList'
import {ColourPaletteTypes} from 'src/types/ColourPaletteTypes'
import {createColours, renderWithProviders, userEvent} from 'src/testing/test-utils'
import classes from '../ColourPaletteColourListItem/ColourPaletteColourListItem.module.less'

function renderListWithColours({
  numberOfColours,
  selectedIndex,
}: {
  numberOfColours: number
  selectedIndex: number
}) {
  const colours = Array.from(Array(numberOfColours).keys()).map((x) => '#0' + (10 + x).toString())
  renderWithProviders(<ColourPaletteColourList />, {
    preloadedState: {
      colourPalette: {
        name: '',
        type: ColourPaletteTypes.regular,
        colours: createColours(colours, selectedIndex),
        isOpen: true,
        hasChanges: false,
      },
    },
  })
}

interface TestProps {
  key: string
  numberOfColours: number
  selectedIndex: number
  expectedIndex: number
}

const getItemColour = (index: number): string => {
  const colours = getItemColours()
  if (index > colours.length - 1)
    throw new Error(`Expcted at least ${index + 1} colours, found ${colours.length}`)

  return colours[index]
}

const getItemColours = (): string[] =>
  screen.queryAllByRole('listitem').map((x) => x.title.match(/#[0-9a-z]+/i)?.[0] ?? '')

const isSelected = (item: HTMLElement) => item.className.includes(classes['colour--selected'])

const getSelectedIndex = (): number => {
  const numberSelected = screen.queryAllByRole('listitem').filter(isSelected).length

  if (numberSelected > 1) return -numberSelected

  return screen.queryAllByRole('listitem').findIndex(isSelected)
}

describe('Colour palette colour list', () => {
  describe('selected color', () => {
    const testSelectionChange = async ({
      key,
      numberOfColours,
      selectedIndex,
      expectedIndex,
    }: TestProps) => {
      renderListWithColours({numberOfColours, selectedIndex})
      const originColour = getItemColour(selectedIndex)
      const targetColour = getItemColour(expectedIndex)

      await userEvent.keyboard('{' + key + '}')

      expect(getSelectedIndex(), 'Wrong colour selected').toBe(expectedIndex)
      expect(getItemColour(selectedIndex), 'Origin colour moved unexpectedly').toBe(originColour)
      expect(getItemColour(expectedIndex), 'Target colour moved unexpectedly').toBe(targetColour)
    }

    it('is previous colour when Up is pressed', () =>
      testSelectionChange({
        key: 'arrowup',
        numberOfColours: 4,
        selectedIndex: 2,
        expectedIndex: 1,
      }))

    it('is next colour when Down is pressed', () =>
      testSelectionChange({
        key: 'arrowdown',
        numberOfColours: 4,
        selectedIndex: 2,
        expectedIndex: 3,
      }))

    it('does not change when first colour selected and Up is pressed', () =>
      testSelectionChange({
        key: 'arrowup',
        numberOfColours: 4,
        selectedIndex: 0,
        expectedIndex: 0,
      }))

    test.for([{index: 0}, {index: 5}, {index: 10}, {index: 15}])(
      'does not change when first colour in column selected and Up is pressed (selected index: $index)',
      ({index}) =>
        testSelectionChange({
          key: 'arrowup',
          numberOfColours: 20,
          selectedIndex: index,
          expectedIndex: index,
        })
    )

    it('does not change when last colour selected and Down is pressed', () =>
      testSelectionChange({
        key: 'arrowdown',
        numberOfColours: 4,
        selectedIndex: 3,
        expectedIndex: 3,
      }))

    test.for([{index: 4}, {index: 9}, {index: 14}, {index: 19}])(
      'does not change when last colour in column selected and Down is pressed (selected index: $index)',
      async ({index}) =>
        testSelectionChange({
          key: 'arrowdown',
          numberOfColours: 20,
          selectedIndex: index,
          expectedIndex: index,
        })
    )

    it('is five colours down when Right is pressed', () =>
      testSelectionChange({
        key: 'arrowright',
        numberOfColours: 8,
        selectedIndex: 1,
        expectedIndex: 6,
      }))

    it('does not change when when no colours to the right and Right is pressed', () =>
      testSelectionChange({
        key: 'arrowright',
        numberOfColours: 8,
        selectedIndex: 3,
        expectedIndex: 3,
      }))

    it('is five colours up when Left is pressed', () =>
      testSelectionChange({
        key: 'arrowleft',
        numberOfColours: 8,
        selectedIndex: 6,
        expectedIndex: 1,
      }))

    it('does not change when when no colours to the left and Left is pressed', () =>
      testSelectionChange({
        key: 'arrowleft',
        numberOfColours: 8,
        selectedIndex: 2,
        expectedIndex: 2,
      }))
  })

  describe('colour moves', () => {
    const testColourMove = async ({
      key,
      numberOfColours,
      selectedIndex,
      expectedIndex,
    }: TestProps) => {
      renderListWithColours({numberOfColours, selectedIndex})
      const originColour = getItemColour(selectedIndex)
      const expectedColours = getItemColours()
      expectedColours.splice(expectedIndex, 0, expectedColours.splice(selectedIndex, 1)[0])

      await userEvent.keyboard('{Shift>}{' + key + '}{/Shift}')

      const message = expectedIndex == selectedIndex ? 'Colour moved' : 'Colour has not moved'
      expect(getItemColour(expectedIndex), message).toBe(originColour)
      expect(getItemColours(), 'Colours changed unexpectedly').toEqual(expectedColours)
    }

    it('down one place when Shift + Down is pressed', () =>
      testColourMove({key: 'arrowdown', numberOfColours: 4, selectedIndex: 1, expectedIndex: 2}))

    it('up one place when Shift + Up is pressed', () =>
      testColourMove({key: 'arrowup', numberOfColours: 4, selectedIndex: 1, expectedIndex: 0}))

    it('up five places when Shift + Left is pressed', () =>
      testColourMove({key: 'arrowleft', numberOfColours: 13, selectedIndex: 11, expectedIndex: 6}))

    it('down five places when Shift + Right is pressed', () =>
      testColourMove({key: 'arrowright', numberOfColours: 13, selectedIndex: 5, expectedIndex: 10}))

    test.for([{index: 0}, {index: 5}, {index: 10}, {index: 15}])(
      'nowhere when selection is at top of column and Shift + Up is pressed (selected index: $index)',
      ({index}) =>
        testColourMove({
          key: 'arrowup',
          numberOfColours: 20,
          selectedIndex: index,
          expectedIndex: index,
        })
    )

    test.for([{index: 4}, {index: 9}, {index: 14}, {index: 19}])(
      'nowhere when selection is at bottom of column and Shift + Down is pressed (selected index: $index)',
      ({index}) =>
        testColourMove({
          key: 'arrowdown',
          numberOfColours: 20,
          selectedIndex: index,
          expectedIndex: index,
        })
    )

    test.for([{index: 0}, {index: 1}, {index: 2}, {index: 3}, {index: 4}])(
      'nowhere when selection is in left column and Shift + Left is pressed (selected index: $index)',
      ({index}) =>
        testColourMove({
          key: 'arrowleft',
          numberOfColours: 20,
          selectedIndex: index,
          expectedIndex: index,
        })
    )

    test.for([
      {numberOfColours: 5, index: 0},
      {numberOfColours: 8, index: 6},
      {numberOfColours: 14, index: 13},
      {numberOfColours: 18, index: 16},
    ])(
      'nowhere when selection is in last column and Shift + Right is pressed (selected index: $index)',
      ({numberOfColours, index}) =>
        testColourMove({
          key: 'arrowright',
          numberOfColours: numberOfColours,
          selectedIndex: index,
          expectedIndex: index,
        })
    )
  })

  test.for([{key: 'Alt'}, {key: 'Control'}, {key: 'Meta'}])(
    'does not move or select colours when $key is pressed',
    async ({key}) => {
      renderListWithColours({numberOfColours: 3, selectedIndex: 1})
      const expectedColours = getItemColours()

      await userEvent.keyboard('{' + key + '>}{arrowup}{/' + key + '}')

      expect(getSelectedIndex(), 'Wrong colour selected').toBe(1)
      expect(getItemColours(), 'Colours moved').toEqual(expectedColours)
    }
  )

  test.for([{key: 'arrowup'}, {key: 'arrowright'}, {key: 'arrowdown'}, {key: 'arrowleft'}])(
    'does not select colours when no colour selected and $key pressed',
    async ({key}) => {
      renderListWithColours({numberOfColours: 15, selectedIndex: -1})

      await userEvent.keyboard('{' + key + '}')

      expect(getSelectedIndex(), 'Colour selected').toBe(-1)
    }
  )

  test.for([{key: 'arrowup'}, {key: 'arrowright'}, {key: 'arrowdown'}, {key: 'arrowleft'}])(
    'does not move colours when no colour selected and $key pressed',
    async ({key}) => {
      renderListWithColours({numberOfColours: 15, selectedIndex: -1})
      const expectedColours = getItemColours()

      await userEvent.keyboard('{Shift>}{' + key + '}{/Shift}')

      expect(getItemColours(), 'Colours moved').toEqual(expectedColours)
    }
  )

  test.for([{key: 'delete'}, {key: 'backspace'}])(
    'deletes selected colour when $key is pressed',
    async ({key}) => {
      renderListWithColours({numberOfColours: 4, selectedIndex: 1})
      const expectedColours = getItemColours()
      expectedColours.splice(1, 1)

      await userEvent.keyboard('{' + key + '}')

      expect(getItemColours(), 'Colour not removed').toEqual(expectedColours)
    }
  )

  it('retains selected index when colour deleted', async () => {
    renderListWithColours({numberOfColours: 5, selectedIndex: 2})

    await userEvent.keyboard('{backspace}')

    expect(getSelectedIndex(), 'Wrong colour selected').toBe(2)
  })

  it('selects last colour when last colour deleted', async () => {
    renderListWithColours({numberOfColours: 5, selectedIndex: 4})

    await userEvent.keyboard('{backspace}')

    expect(getSelectedIndex(), 'Wrong colour selected').toBe(3)
  })

  it('does nothing when no colour selected and backspace pressed', async () => {
    renderListWithColours({numberOfColours: 4, selectedIndex: -1})
    const expectedColours = getItemColours()

    await userEvent.keyboard('{backspace}')

    expect(getItemColours(), 'Colours changed').toEqual(expectedColours)
  })

  it('does nothing when palette has one colour', async () => {
    renderListWithColours({numberOfColours: 1, selectedIndex: 0})
    const expectedColours = getItemColours()

    await userEvent.keyboard('{backspace}')

    expect(getItemColours(), 'Colour deleted').toEqual(expectedColours)
  })
})
