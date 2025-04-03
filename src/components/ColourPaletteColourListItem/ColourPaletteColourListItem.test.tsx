import {describe, it, expect, test} from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithContext, userEvent} from '../../test-utils.tsx'
import ColourPaletteColourListItem from './ColourPaletteColourListItem'
import {default as TestIds} from './ColourPaletteColourListItemTestIds'
import ColourPickerTestIds from '../ColourPicker/ColourPickerTestIds'
import classes from './ColourPaletteColourListItem.module.less'
import {
  createColours,
  initialPaletteState,
} from 'src/state/ColourPalettes/PaletteReducer.ts'
import {usePalette} from 'src/state/ColourPalettes/PaletteContext.tsx'

interface WrapperProps {
  index?: number
  isDragging?: boolean
}

interface RenderProps extends WrapperProps {
  colour: string
  isSelected?: boolean
}

function render({colour, index, isSelected, isDragging}: RenderProps) {
  const palette = {
    ...initialPaletteState,
    colours: createColours([colour], isSelected),
  }
  renderWithContext({
    initialPaletteContext: palette,
    children: <StateWrapper index={index} isDragging={isDragging} />,
  })
}

function StateWrapper({index, isDragging}: WrapperProps) {
  const state = usePalette()

  return (
    <>
      <ColourPaletteColourListItem
        colour={state.colours[0]}
        index={index}
        isDragging={isDragging}
      />
    </>
  )
}

describe('Colour palette colour list item: renders correctly', () => {
  it('is list item', () => {
    render({colour: '#f0b'})

    expect(screen.getByTestId(TestIds.Self)).toBeInstanceOf(HTMLLIElement)
  })

  it('has colour hex in title', () => {
    render({colour: '#AA5F10'})

    expect(screen.getByTestId(TestIds.Self)).toHaveAttribute(
      'title',
      '#AA5F10 (double click to edit)'
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
      render({colour: '#f0b', index: index})

      expect(screen.getByTestId(TestIds.Self)).toHaveStyle(
        `grid-row: ${row}; grid-column: ${column}`
      )
    }
  )

  it('has one class by default', () => {
    render({colour: '#f0b'})

    expect(screen.getByTestId(TestIds.Self)).toHaveClass(classes.colour, {
      exact: true,
    })
  })

  it('has selected class when selected', () => {
    render({colour: '#f0b', isSelected: true})

    expect(screen.getByTestId(TestIds.Self)).toHaveClass(
      classes.colour + ' ' + classes['colour--selected'],
      {
        exact: true,
      }
    )
  })

  it('has dragging class when dragging', () => {
    render({colour: '#f0b', isDragging: true})

    expect(screen.getByTestId(TestIds.Self)).toHaveClass(
      classes.colour + ' ' + classes['colour--dragging'],
      {
        exact: true,
      }
    )
  })

  it('has the background colour matching the colour', () => {
    render({colour: '#FF0FA0'})

    expect(screen.getByTestId(TestIds.Swatch)).toHaveStyle(
      'background-color: #FF0FA0'
    )
  })

  it('does not show a colour picker', () => {
    render({colour: '#f0b'})

    expect(screen.queryByTestId(TestIds.ColourPicker)).not.toBeInTheDocument()
    expect(
      screen.queryByTestId(ColourPickerTestIds.Self)
    ).not.toBeInTheDocument()
  })
})

describe('Colour palette colour list item: colour picker', () => {
  it('opens picker when swatch double clicked', async () => {
    render({colour: '#f0b'})

    await userEvent.dblClick(screen.getByTestId(TestIds.Swatch))

    expect(await screen.findByTestId(TestIds.ColourPicker)).toBeInTheDocument()
    expect(
      await screen.findByTestId(ColourPickerTestIds.Self)
    ).toBeInTheDocument()
  })

  it('has picker open class when picker is open', async () => {
    render({colour: '#f0b'})

    await userEvent.dblClick(screen.getByTestId(TestIds.Swatch))
    await screen.findByTestId(TestIds.ColourPicker)

    expect(screen.getByTestId(TestIds.Self)).toHaveClass(
      classes['colour--pickeropen']
    )
  })

  it('changes colour when colour is picked', async () => {
    const newHex = '#F0E0D0'

    render({colour: '#000'})

    await userEvent.dblClick(screen.getByTestId(TestIds.Swatch))
    const picker = await screen.findByTestId(TestIds.ColourPicker)
    const pickerInput = picker.querySelector('.w-color-editable-input input')
    await userEvent.type(
      pickerInput!,
      '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}' +
        newHex
    )

    expect(screen.getByTestId(TestIds.Swatch)).toHaveStyle(
      'background-color: ' + newHex
    )
  })

  it('closes picker when picking is done', async () => {
    render({colour: '#000'})

    await userEvent.dblClick(screen.getByTestId(TestIds.Swatch))
    await userEvent.click(screen.getByTestId(ColourPickerTestIds.Done))

    expect(screen.queryByTestId(TestIds.ColourPicker)).not.toBeInTheDocument()
  })
})

describe('Colour palette colour list item: colour is selected', () => {
  it('when item is clicked', async () => {
    render({colour: '#000'})

    await userEvent.click(screen.getByTestId(TestIds.Self))

    expect(screen.getByTestId(TestIds.Self)).toHaveClass(
      classes['colour--selected']
    )
  })
})
