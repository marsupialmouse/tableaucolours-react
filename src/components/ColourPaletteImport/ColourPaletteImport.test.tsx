import {createColours, renderWithProviders, userEvent} from 'src/testing/test-utils'
import {describe, expect, it, vi} from 'vitest'
import {screen} from '@testing-library/react'
import ColourPaletteImport from './ColourPaletteImport'
import classes from './ColourPaletteImport.module.less'
import {ColourPaletteType, ColourPaletteTypes} from 'src/types/ColourPaletteTypes'
import {default as TestIds} from './ColourPaletteImportTestIds'
import {useSelector} from 'react-redux'
import {
  initialColourPaletteState,
  selectColourPalette,
} from 'src/stores/colourpalette/colourPaletteSlice'

interface RenderProps {
  name?: string
  type?: ColourPaletteType
  colours?: string[]
  onDone?(): void
}

function render(props?: RenderProps) {
  const palette = {...initialColourPaletteState}

  if (props?.name) palette.name = props.name
  if (props?.type) palette.type = props.type.id
  if (props?.colours) palette.colours = createColours(props.colours)

  renderWithProviders(
    <div>
      <ColourPaletteImport onDone={props?.onDone} />
      <TestComponent />
    </div>,
    {
      preloadedState: {
        colourPalette: palette,
      },
    }
  )
}

const TestComponent = function () {
  const palette = useSelector(selectColourPalette)
  return (
    <div>
      <span data-testid="contextpalette-name">{palette.name}</span>
      <span data-testid="contextpalette-type">{palette.type}</span>
      <span data-testid="contextpalette-colours">
        {palette.colours.map((x) => x.hex).join(' ')}
      </span>
    </div>
  )
}

describe('Colour Palette Import component', () => {
  it('renders as a div', () => {
    render()

    expect(screen.getByTestId(TestIds.Self)).toBeInstanceOf(HTMLDivElement)
  })

  it('has disabled import button on initial render', () => {
    render()

    expect(screen.getByTestId(TestIds.ImportButton)).toBeDisabled()
  })

  it('does not show validation errors when code is empty', () => {
    render()

    expect(screen.queryByTestId(TestIds.ValidationMessage)).not.toBeInTheDocument()
  })

  it('has validation error and disabled import button when xml is invalid', async () => {
    render()

    await userEvent.click(screen.getByTestId(TestIds.Code))
    await userEvent.paste('<color-palette name="Hello!" type="regular"></color-palette>')

    expect(screen.getByTestId(TestIds.ImportButton)).toBeDisabled()
    expect(screen.getByTestId(TestIds.ValidationMessage)).toHaveTextContent(
      'Expected one or more <color> elements'
    )
  })

  it('has error class on textarea when code invalid', async () => {
    render()

    await userEvent.click(screen.getByTestId(TestIds.Code))
    await userEvent.paste('<color-palette name="Hello!" type="regular"></color-palette>')

    expect(screen.getByTestId(TestIds.Code)).toHaveClass(classes['importcode-code--invalid'])
  })

  it('does not show validation errors when invalid code is cleared', async () => {
    render()

    await userEvent.click(screen.getByTestId(TestIds.Code))
    await userEvent.paste('<color-palette name="Hello!" type="regular"></color-palette>')
    await userEvent.clear(screen.getByTestId(TestIds.Code))

    expect(screen.getByTestId(TestIds.ImportButton)).toBeDisabled()
    expect(screen.queryByTestId(TestIds.ValidationMessage)).not.toBeInTheDocument()
  })

  it('has enabled import button when code is valid', async () => {
    render()

    await userEvent.click(screen.getByTestId(TestIds.Code))
    await userEvent.paste(
      '<color-palette name="Hello!" type="regular"><color>#f00</color></color-palette>'
    )

    expect(screen.getByTestId(TestIds.ImportButton)).not.toBeDisabled()
  })

  it('imports valid xml into state when import button clicked', async () => {
    const name = 'Hello!'
    const type = ColourPaletteTypes.sequential
    const colours = ['#012', '#789']
    render()

    await userEvent.click(screen.getByTestId(TestIds.Code))
    await userEvent.paste(
      `<color-palette name="${name}" type="${type.id}">${colours.map((x) => `<color>${x}</color>`)}</color-palette>`
    )
    await userEvent.click(screen.getByTestId(TestIds.ImportButton))

    expect(screen.getByTestId('contextpalette-name')).toHaveTextContent(name)
    expect(screen.getByTestId('contextpalette-type')).toHaveTextContent(type.id)
    expect(screen.getByTestId('contextpalette-colours')).toHaveTextContent(colours.join(' '))
  })

  it('imports with default type when type in code unrecogonised', async () => {
    render()

    await userEvent.click(screen.getByTestId(TestIds.Code))
    await userEvent.paste(
      '<color-palette name="X" type="fancy!"><color>#FFFFFF</color></color-palette>'
    )
    await userEvent.click(screen.getByTestId(TestIds.ImportButton))

    expect(screen.getByTestId('contextpalette-type')).toHaveTextContent(
      ColourPaletteTypes.regular.id
    )
  })

  it('calls onDone when palette is imported', async () => {
    const onDone = vi.fn()
    render({onDone})

    await userEvent.click(screen.getByTestId(TestIds.Code))
    await userEvent.paste(
      '<color-palette name="X" type="regular"><color>#FFFFFF</color></color-palette>'
    )
    await userEvent.click(screen.getByTestId(TestIds.ImportButton))

    expect(onDone).toBeCalledTimes(1)
  })

  it('calls onDone when Cancel is clicked', async () => {
    const onDone = vi.fn()
    render({onDone})

    await userEvent.click(screen.getByTestId(TestIds.Code))
    await userEvent.paste(
      '<color-palette name="X" type="regular"><color>#FFFFFF</color></color-palette>'
    )
    await userEvent.click(screen.getByTestId(TestIds.CancelButton))

    expect(onDone).toBeCalledTimes(1)
  })

  it('does not call onDone when valid code is entered', async () => {
    const onDone = vi.fn()
    render({onDone})

    await userEvent.click(screen.getByTestId(TestIds.Code))
    await userEvent.paste(
      '<color-palette name="X" type="regular"><color>#FFFFFF</color></color-palette>'
    )

    expect(onDone).not.toBeCalled()
  })

  it('does not import palette when Cancel is clicked', async () => {
    const name = 'Hello!'
    const type = ColourPaletteTypes.sequential
    const colours = ['#012', '#789']
    render({name, type, colours})

    await userEvent.click(screen.getByTestId(TestIds.Code))
    await userEvent.paste(
      `<color-palette name="Slow Motion" type="regular"><color>#000</color></color-palette>`
    )
    await userEvent.click(screen.getByTestId(TestIds.CancelButton))

    expect(screen.getByTestId('contextpalette-name')).toHaveTextContent(name)
    expect(screen.getByTestId('contextpalette-type')).toHaveTextContent(type.id)
    expect(screen.getByTestId('contextpalette-colours')).toHaveTextContent(colours.join(' '))
  })
})
