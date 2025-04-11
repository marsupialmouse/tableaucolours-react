import {describe, it, expect, test} from 'vitest'
import {screen} from '@testing-library/react'
import {createColours, renderWithProviders, userEvent} from '../../testing/test-utils.tsx'
import ColourPaletteColourListItem from './ColourPaletteColourListItem'
import {default as TestIds} from './ColourPaletteColourListItemTestIds'
import ColourPickerTestIds from '../ColourPicker/ColourPickerTestIds'
import classes from './ColourPaletteColourListItem.module.less'
import {useSelector} from 'react-redux'
import {selectColourPaletteColours} from 'src/stores/colourpalette/colourPaletteSlice.ts'
import {ColourPaletteTypes} from 'src/types/ColourPaletteTypes.ts'

interface WrapperProps {
  canRemove?: boolean
  index?: number
  isDragging?: boolean
}

interface RenderProps extends WrapperProps {
  colour: string
  isSelected?: boolean
}

function render({colour, canRemove, index, isSelected, isDragging}: RenderProps) {
  renderWithProviders(
    <StateWrapper canRemove={canRemove} index={index} isDragging={isDragging} />,
    {
      preloadedState: {
        colourPalette: {
          name: '',
          type: ColourPaletteTypes.regular,
          colours: createColours(colour, isSelected),
          isOpen: true,
          hasChanges: false,
        },
      },
    }
  )
}

function StateWrapper({canRemove, index, isDragging}: WrapperProps) {
  const colours = useSelector(selectColourPaletteColours)
  canRemove = canRemove !== false

  return (
    <>
      {colours.length && (
        <ColourPaletteColourListItem
          colour={colours[0]}
          canRemove={canRemove}
          index={index}
          isDragging={isDragging}
        />
      )}
    </>
  )
}
describe('Colour palette colour list item', () => {
  describe('renders correctly', () => {
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
    ])('has row $row and column $column for index $index', ({index, row, column}) => {
      render({colour: '#f0b', index: index})

      expect(screen.getByTestId(TestIds.Self)).toHaveStyle(
        `grid-row: ${row}; grid-column: ${column}`
      )
    })

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

      expect(screen.getByTestId(TestIds.Swatch)).toHaveStyle('background-color: #FF0FA0')
    })

    it('does not show a colour picker', () => {
      render({colour: '#f0b'})

      expect(screen.queryByTestId(TestIds.ColourPicker)).not.toBeInTheDocument()
      expect(screen.queryByTestId(ColourPickerTestIds.Self)).not.toBeInTheDocument()
    })

    it('has a remove button when colour can be removed', () => {
      render({colour: '#f0b', canRemove: true})

      expect(screen.queryByTestId(TestIds.Remove)).toBeInTheDocument()
    })

    it('does not have a remove button when colour cannot be removed', () => {
      render({colour: '#f0b', canRemove: false})

      expect(screen.queryByTestId(TestIds.Remove)).not.toBeInTheDocument()
    })
  })

  describe('colour picker', () => {
    it('opens picker when swatch double clicked', async () => {
      render({colour: '#f0b'})

      await userEvent.dblClick(screen.getByTestId(TestIds.Swatch))

      expect(await screen.findByTestId(TestIds.ColourPicker)).toBeInTheDocument()
      expect(await screen.findByTestId(ColourPickerTestIds.Self)).toBeInTheDocument()
    })

    it('has picker open class when picker is open', async () => {
      render({colour: '#f0b'})

      await userEvent.dblClick(screen.getByTestId(TestIds.Swatch))
      await screen.findByTestId(TestIds.ColourPicker)

      expect(screen.getByTestId(TestIds.Self)).toHaveClass(classes['colour--pickeropen'])
    })

    it('changes colour when colour is picked', async () => {
      const newHex = '#F0E0D0'

      render({colour: '#000'})

      await userEvent.dblClick(screen.getByTestId(TestIds.Swatch))
      const picker = await screen.findByTestId(TestIds.ColourPicker)
      const pickerInput = picker.querySelector('.w-color-editable-input input')
      await userEvent.type(
        pickerInput!,
        '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}' + newHex
      )

      expect(screen.getByTestId(TestIds.Swatch)).toHaveStyle('background-color: ' + newHex)
    })

    it('closes picker when picking is done', async () => {
      render({colour: '#000'})

      await userEvent.dblClick(screen.getByTestId(TestIds.Swatch))
      await userEvent.click(screen.getByTestId(ColourPickerTestIds.Done))

      expect(screen.queryByTestId(TestIds.ColourPicker)).not.toBeInTheDocument()
    })
  })

  describe('colour is selected', () => {
    it('when item is clicked', async () => {
      render({colour: '#000'})

      await userEvent.click(screen.getByTestId(TestIds.Self))

      expect(screen.getByTestId(TestIds.Self)).toHaveClass(classes['colour--selected'])
    })
  })

  describe('colour is removed', () => {
    it('when remove button is clicked', async () => {
      render({colour: '#000'})

      await userEvent.click(screen.getByTestId(TestIds.Remove))

      expect(screen.queryByTestId(TestIds.Self)).not.toBeInTheDocument()
    })
  })
})
