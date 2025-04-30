import {beforeEach, vi} from 'vitest'
import {describe, expect, it, test} from 'vitest'
import ImageColourExtractor from './ImageColourExtractor'
import classes from './ImageColourExtractor.module.less'
import {default as TestIds} from './ImageColourExtractorTestIds'
import {screen, fireEvent} from '@testing-library/react'
import {useSelector} from 'react-redux'
import {
  Colour,
  maximumPaletteColours,
  selectColourPaletteColours,
} from 'src/stores/colourPaletteSlice'
import {createColours, renderWithProviders, testImage} from 'src/testing/test-utils'
import userEvent from '@testing-library/user-event'
import {DeepMockProxy, matches} from 'vitest-mock-extended'
import ColorThief from 'colorthief'

/* eslint-disable-next-line */
const colorThiefInstanceMock = (ColorThief as any).instanceMock as DeepMockProxy<ColorThief>

vi.mock('colorthief')

describe('Image colour extractor component', () => {
  interface RenderProps {
    colours?: number | Colour[]
    imageSrc?: string
    onClose?: () => void
  }

  beforeEach(() => {
    localStorage.removeItem('numberOfColoursToExtract')
  })

  function render({colours = 1, imageSrc, onClose}: RenderProps) {
    if (typeof colours === 'number') colours = coloursWithPrefix(colours, '#0000')

    renderWithProviders(<StateWrapper onClose={onClose} />, {
      preloadedState: {
        colourPalette: {
          name: '',
          type: 'regular',
          colours: colours,
          isOpen: true,
          hasChanges: false,
        },
        image: {imageSrc, scale: 1},
      },
    })
  }

  function StateWrapper({onClose}: RenderProps) {
    const colours = useSelector(selectColourPaletteColours)

    return (
      <>
        <ImageColourExtractor onClose={onClose} />
        <div data-testid="colours">{colours.map((x) => x.hex).join(' ')}</div>
      </>
    )
  }

  function coloursWithPrefix(numberOfColours: number, hexPrefix: string) {
    const colours = Array.from(Array(numberOfColours).keys()).map(
      (x) => hexPrefix + (10 + x).toString()
    )
    return createColours(colours)
  }

  it('renders as a div ', () => {
    render({})

    expect(screen.getByTestId(TestIds.Self)).toBeInstanceOf(HTMLDivElement)
    expect(screen.getByTestId(TestIds.Self)).toHaveClass(classes.extractcolours)
  })

  it('has focus class on number control when input has focus', () => {
    render({})

    fireEvent.focus(screen.getByTestId(TestIds.NumberInput))

    expect(screen.getByTestId(TestIds.NumberControl)).toHaveClass(
      classes['extractcolours-numbercontrol--focus']
    )
  })

  it('does not have focus class on number control when input does not have focus', () => {
    render({})

    fireEvent.blur(screen.getByTestId(TestIds.NumberInput))

    expect(screen.getByTestId(TestIds.NumberControl)).not.toHaveClass(
      classes['extractcolours-numbercontrol--focus']
    )
  })

  it('defaults to 8 colours when no previous value used', () => {
    render({})

    expect(screen.getByTestId(TestIds.NumberInput)).toHaveValue(8)
  })

  it('uses number of colours from local storage', () => {
    localStorage.setItem('numberOfColoursToExtract', '13')

    render({})

    expect(screen.getByTestId(TestIds.NumberInput)).toHaveValue(13)
  })

  it('defaults to replacing colours', () => {
    render({})

    expect(screen.getByTestId(TestIds.AddColours)).not.toBeChecked()
    expect(screen.getByTestId(TestIds.ReplaceColours)).toBeChecked()
  })

  it('has input with palette maximum when replacing colours', () => {
    render({})

    expect(screen.getByTestId(TestIds.NumberInput)).toHaveAttribute('min', '1')
    expect(screen.getByTestId(TestIds.NumberInput)).toHaveAttribute(
      'max',
      maximumPaletteColours.toString()
    )
  })

  test.for([
    {colours: maximumPaletteColours - 6, max: 6},
    {colours: maximumPaletteColours - 12, max: 12},
  ])(
    'has input with maximum of $max when adding colours to palette with $colours colours',
    async ({colours, max}) => {
      render({colours})

      await userEvent.click(screen.getByTestId(TestIds.AddColours))

      expect(screen.getByTestId(TestIds.NumberInput)).toHaveAttribute('min', '1')
      expect(screen.getByTestId(TestIds.NumberInput)).toHaveAttribute('max', max.toString())
    }
  )

  it('has disabled add action when colour palette is full', () => {
    render({colours: maximumPaletteColours})

    expect(screen.getByTestId(TestIds.AddColours)).toBeDisabled()
  })

  it('has disabled class wrapping add radio when colour palette is full', () => {
    render({colours: maximumPaletteColours})

    expect(screen.getByTestId(TestIds.AddColours).parentNode).toHaveClass(
      classes['extractcolours-field--disabled']
    )
  })

  it('has explanatory title on add label when colour palette is full', () => {
    render({colours: maximumPaletteColours})

    expect(screen.getByTestId(TestIds.AddColours).nextSibling).toHaveAttribute(
      'title',
      'The colour palette is already full'
    )
  })

  it('resets number of colours when add selected and value exceeds maximum', async () => {
    render({colours: maximumPaletteColours - 3})

    await userEvent.type(
      screen.getByTestId(TestIds.NumberInput),
      '{selectall}{backspace}' + (maximumPaletteColours - 1).toString()
    )
    await userEvent.click(screen.getByTestId(TestIds.AddColours))

    expect(screen.getByTestId(TestIds.NumberInput)).toHaveValue(3)
  })

  it('resets number of colours to 1 when value less than 1 entered', async () => {
    render({})

    await userEvent.type(screen.getByTestId(TestIds.NumberInput), '{selectall}{backspace}0')

    expect(screen.getByTestId(TestIds.NumberInput)).toHaveValue(1)
  })

  it('has disabled subtract button when value is 1', async () => {
    render({})

    await userEvent.type(screen.getByTestId(TestIds.NumberInput), '{selectall}{backspace}1')

    expect(screen.getByTestId(TestIds.SubtractButton)).toBeDisabled()
    expect(screen.getByTestId(TestIds.AddButton)).not.toBeDisabled()
  })

  it('has disabled subtract button when replacing and value is maximum', async () => {
    render({})

    await userEvent.type(
      screen.getByTestId(TestIds.NumberInput),
      '{selectall}{backspace}' + maximumPaletteColours.toString()
    )

    expect(screen.getByTestId(TestIds.SubtractButton)).not.toBeDisabled()
    expect(screen.getByTestId(TestIds.AddButton)).toBeDisabled()
  })

  it('has disabled subtract button when adding and value is maximum', async () => {
    render({colours: maximumPaletteColours - 8})

    await userEvent.type(screen.getByTestId(TestIds.NumberInput), '{selectall}{backspace}8')
    await userEvent.click(screen.getByTestId(TestIds.AddColours))

    expect(screen.getByTestId(TestIds.SubtractButton)).not.toBeDisabled()
    expect(screen.getByTestId(TestIds.AddButton)).toBeDisabled()
  })

  it('has incremented value when add button is clicked', async () => {
    render({})

    await userEvent.type(screen.getByTestId(TestIds.NumberInput), '{selectall}{backspace}5')
    await userEvent.click(screen.getByTestId(TestIds.AddButton))

    expect(screen.getByTestId(TestIds.NumberInput)).toHaveValue(6)
  })

  it('has decremented value when subtract button is clicked', async () => {
    render({})

    await userEvent.type(screen.getByTestId(TestIds.NumberInput), '{selectall}{backspace}5')
    await userEvent.click(screen.getByTestId(TestIds.SubtractButton))

    expect(screen.getByTestId(TestIds.NumberInput)).toHaveValue(4)
  })

  it('replaces palette with number of colours extracted from image', async () => {
    colorThiefInstanceMock.getPalette
      .calledWith(
        matches((i: HTMLImageElement) => i.src === testImage.src),
        5,
        1
      )
      .mockReturnValue([
        [255, 255, 0],
        [255, 0, 255],
      ])

    render({colours: coloursWithPrefix(12, '#0000'), imageSrc: testImage.src})

    await userEvent.type(screen.getByTestId(TestIds.NumberInput), '{selectall}{backspace}5')
    await userEvent.click(screen.getByTestId(TestIds.ExtractButton))

    expect(screen.getByTestId('colours')).toHaveTextContent('#FFFF00 #FF00FF')
  })

  it('adds extracted colours to palette', async () => {
    colorThiefInstanceMock.getPalette
      .calledWith(
        matches((i: HTMLImageElement) => i.src === testImage.src),
        3,
        1
      )
      .mockReturnValue([
        [255, 255, 0],
        [0, 0, 255],
        [255, 0, 255],
      ])

    render({colours: coloursWithPrefix(2, '#0000'), imageSrc: testImage.src})

    await userEvent.click(screen.getByTestId(TestIds.AddColours))
    await userEvent.type(screen.getByTestId(TestIds.NumberInput), '{selectall}{backspace}3')
    await userEvent.click(screen.getByTestId(TestIds.ExtractButton))

    expect(screen.getByTestId('colours')).toHaveTextContent(
      '#000010 #000011 #FFFF00 #0000FF #FF00FF'
    )
  })

  it('saves number of extracted colours to local storage', async () => {
    colorThiefInstanceMock.getPalette.mockReturnValue([[255, 0, 255]])

    render({colours: coloursWithPrefix(12, '#0000'), imageSrc: testImage.src})

    await userEvent.type(screen.getByTestId(TestIds.NumberInput), '{selectall}{backspace}13')
    await userEvent.click(screen.getByTestId(TestIds.ExtractButton))

    expect(localStorage.getItem('numberOfColoursToExtract')).toBe('13')
  })

  it('fires onClose event when colours extracted', async () => {
    colorThiefInstanceMock.getPalette.mockReturnValue([[255, 0, 255]])
    const onClose = vi.fn()
    render({colours: coloursWithPrefix(1, '#0000'), imageSrc: testImage.src, onClose})

    await userEvent.click(screen.getByTestId(TestIds.ExtractButton))

    expect(onClose).toBeCalled()
  })

  it('fires onClose event when Cancel clicked', async () => {
    colorThiefInstanceMock.getPalette.mockReturnValue([[255, 0, 255]])
    const onClose = vi.fn()
    render({colours: coloursWithPrefix(1, '#0000'), imageSrc: testImage.src, onClose})

    await userEvent.click(screen.getByTestId(TestIds.CancelButton))

    expect(onClose).toBeCalled()
  })

  it('does not extract colours when Cancel clicked', async () => {
    colorThiefInstanceMock.getPalette.mockReturnValue([[255, 255, 0]])

    render({colours: coloursWithPrefix(1, '#0000'), imageSrc: testImage.src})

    await userEvent.click(screen.getByTestId(TestIds.CancelButton))

    expect(screen.getByTestId('colours')).toHaveTextContent('#000010')
    expect(localStorage.getItem('numberOfColoursToExtract')).toBeNull()
  })
})
