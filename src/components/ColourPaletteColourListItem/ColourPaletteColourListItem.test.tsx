import {describe, it, expect, test} from 'vitest'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {userEvent} from '../../test-utils.ts'
import ColourPaletteColourListItem from './ColourPaletteColourListItem'
import {default as TestIds} from './ColourPaletteColourListItemTestIds'
import ColourPickerTestIds from '../ColourPicker/ColourPickerTestIds'
import classes from './ColourPaletteColourListItem.module.less'

describe('Colour palette colour list item: renders correctly', () => {
  it('is list item', () => {
    const colour = {id: 0, hex: '#f0b', isSelected: false}

    render(<ColourPaletteColourListItem colour={colour} />)

    expect(screen.getByTestId(TestIds.Self)).toBeInstanceOf(HTMLLIElement)
  })

  it('has colour hex in title', () => {
    const colour = {id: 0, hex: '#AA5F10', isSelected: false}

    render(<ColourPaletteColourListItem colour={colour} />)

    expect(screen.getByTestId(TestIds.Self)).toHaveAttribute(
      'title',
      colour.hex + ' (double click to edit)'
    )
  })

  test.each([
    {index: 0, row: 1, column: 1},
    {index: 4, row: 5, column: 1},
    {index: 5, row: 1, column: 2},
    {index: 13, row: 4, column: 3},
  ])(
    'has row $row and column $column for index $index',
    ({index, row, column}) => {
      const colour = {id: 0, hex: '#f0b', isSelected: false}

      render(<ColourPaletteColourListItem colour={colour} index={index} />)

      expect(screen.getByTestId(TestIds.Self)).toHaveStyle(
        `grid-row: ${row}; grid-column: ${column}`
      )
    }
  )

  it('has one class by default', () => {
    const colour = {id: 0, hex: '#f0b', isSelected: false}

    render(<ColourPaletteColourListItem colour={colour} />)

    expect(screen.getByTestId(TestIds.Self)).toHaveClass(classes.colour, {
      exact: true,
    })
  })

  it('has selected class when selected', () => {
    const colour = {id: 0, hex: '#f0b', isSelected: true}

    render(<ColourPaletteColourListItem colour={colour} />)

    expect(screen.getByTestId(TestIds.Self)).toHaveClass(
      classes.colour + ' ' + classes['colour--selected'],
      {
        exact: true,
      }
    )
  })

  it('has dragging class when dragging', () => {
    const colour = {id: 0, hex: '#f0b', isSelected: false}

    render(<ColourPaletteColourListItem colour={colour} isDragging={true} />)

    expect(screen.getByTestId(TestIds.Self)).toHaveClass(
      classes.colour + ' ' + classes['colour--dragging'],
      {
        exact: true,
      }
    )
  })

  it('has the background colour matching the colour', () => {
    const colour = {id: 0, hex: '#f0b', isSelected: false}

    render(<ColourPaletteColourListItem colour={colour} />)

    expect(screen.getByTestId(TestIds.Swatch)).toHaveStyle(
      'background-color: ' + colour.hex
    )
  })

  it('does not show a colour picker', () => {
    const colour = {id: 0, hex: '#f0b', isSelected: false}

    render(<ColourPaletteColourListItem colour={colour} />)

    expect(screen.queryByTestId(TestIds.ColourPicker)).not.toBeInTheDocument()
    expect(
      screen.queryByTestId(ColourPickerTestIds.Self)
    ).not.toBeInTheDocument()
  })
})

describe('Colour palette colour list item: colour picker', () => {
  it('opens picker when swatch double clicked', async () => {
    const colour = {id: 0, hex: '#f0b', isSelected: false}

    render(<ColourPaletteColourListItem colour={colour} />)

    await userEvent.dblClick(screen.getByTestId(TestIds.Swatch))

    expect(await screen.findByTestId(TestIds.ColourPicker)).toBeInTheDocument()
    expect(
      await screen.findByTestId(ColourPickerTestIds.Self)
    ).toBeInTheDocument()
  })

  it('has picker open class when picker is open', async () => {
    const colour = {id: 0, hex: '#f0b', isSelected: false}

    render(<ColourPaletteColourListItem colour={colour} />)

    await userEvent.dblClick(screen.getByTestId(TestIds.Swatch))
    await screen.findByTestId(TestIds.ColourPicker)

    expect(screen.getByTestId(TestIds.Self)).toHaveClass(
      classes.colour + ' ' + classes['colour--pickeropen'],
      {
        exact: true,
      }
    )
  })

  it('calls onChange when colour is picked', async () => {
    const colour = {id: 0, hex: '#000', isSelected: false}
    const newHex = '#f0e0d0'
    let changedColour = null
    let changedHex = ''

    render(
      <ColourPaletteColourListItem
        colour={colour}
        onChange={(c, h) => {
          changedColour = c
          changedHex = h
        }}
      />
    )

    await userEvent.dblClick(screen.getByTestId(TestIds.Swatch))
    const picker = await screen.findByTestId(TestIds.ColourPicker)
    const pickerInput = picker.querySelector('.w-color-editable-input input')
    await userEvent.type(
      pickerInput!,
      '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}' +
        newHex
    )

    expect(changedHex).toBe(newHex)
    expect(changedColour).toBe(colour)
  })

  it('closes picker when picking is done', async () => {
    const colour = {id: 0, hex: '#f0b', isSelected: false}

    render(<ColourPaletteColourListItem colour={colour} />)

    await userEvent.dblClick(screen.getByTestId(TestIds.Swatch))
    await userEvent.click(screen.getByTestId(ColourPickerTestIds.Done))

    expect(screen.queryByTestId(TestIds.ColourPicker)).not.toBeInTheDocument()
  })
})

describe('Colour palette colour list item: colour is selected', () => {
  it('when item is clicked', async () => {
    let selectedColour = null
    const colour = {id: 0, hex: '#f0b', isSelected: false}

    render(
      <ColourPaletteColourListItem
        colour={colour}
        onSelect={(c) => (selectedColour = c)}
      />
    )

    await userEvent.click(screen.getByTestId(TestIds.Self))

    expect(selectedColour).toBe(colour)
  })
})

describe('Colour palette colour list item: colour is removed', () => {
  it('when remove button is clicked', async () => {
    let removedColour = null
    const colour = {id: 0, hex: '#f0b', isSelected: false}

    render(
      <ColourPaletteColourListItem
        colour={colour}
        onRemove={(c) => (removedColour = c)}
      />
    )

    await userEvent.click(screen.getByTestId(TestIds.Remove))

    expect(removedColour).toBe(colour)
  })
})
