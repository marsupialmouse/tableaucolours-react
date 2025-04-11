import {
  createColours,
  initialPaletteState,
} from 'src/stores/ColourPalettes/PaletteReducer'
import {renderWithContext, userEvent} from 'src/testing/test-utils'
import {describe, expect, it} from 'vitest'
import {screen} from '@testing-library/react'
import ColourPaletteGetCode from './ColourPaletteGetCode'
import {
  ColourPaletteType,
  ColourPaletteTypes,
} from 'src/types/ColourPaletteTypes'
import {default as TestIds} from './ColourPaletteGetCodeTestIds'
import {colourPaletteXml} from 'src/utils/TpsWriter'

interface RenderProps {
  name: string
  type: ColourPaletteType
  colours: string[]
}

function render(props?: RenderProps) {
  const palette = props
    ? {
        ...initialPaletteState,
        name: props.name,
        type: props.type,
        colours: createColours(props.colours),
      }
    : initialPaletteState

  renderWithContext({
    initialPaletteContext: palette,
    children: <ColourPaletteGetCode />,
  })
}

describe('Colour palette get code', () => {
  it('displays colour palette xml for context palette', () => {
    const palette = {
      name: 'Sizzletown',
      type: ColourPaletteTypes.sequential,
      colours: ['#00A'],
    }

    render(palette)

    expect(screen.getByTestId(TestIds.Code)).toHaveTextContent(
      colourPaletteXml(palette),
      {normalizeWhitespace: false}
    )
  })

  it('has text "Copy to clipboard" on button', () => {
    render()

    expect(screen.getByTestId(TestIds.Button)).toHaveTextContent(
      'Copy to clipboard',
      {normalizeWhitespace: false}
    )
  })

  it('has text "Copied" on button after copying', async () => {
    render()

    await userEvent.click(screen.getByTestId(TestIds.Button))

    expect(screen.getByTestId(TestIds.Button)).toHaveTextContent('Copied', {
      normalizeWhitespace: false,
    })
  })

  it('copies XML to clipboard when button is clicked', async () => {
    const palette = {
      name: 'Dishwasher',
      type: ColourPaletteTypes.diverging,
      colours: ['#005'],
    }
    render(palette)

    await userEvent.click(screen.getByTestId(TestIds.Button))

    expect(await navigator.clipboard.readText()).toBe(colourPaletteXml(palette))
  })
})
