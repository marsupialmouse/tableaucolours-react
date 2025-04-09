import {
  createColours,
  initialPaletteState,
} from 'src/state/ColourPalettes/PaletteReducer'
import {renderWithContext, userEvent} from 'src/test-utils'
import {describe, expect, it, vi} from 'vitest'
import {screen} from '@testing-library/react'
import ColourPaletteGetCode from './ColourPaletteGetCode'
import {PaletteType, PaletteTypes} from 'src/state/ColourPalettes/PaletteTypes'
import {default as TestIds} from './ColourPaletteGetCodeTestIds'
import {colourPaletteXml} from 'src/utils/TpsWriter'

interface RenderProps {
  name: string
  type: PaletteType
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
      type: PaletteTypes.sequential,
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
      type: PaletteTypes.diverging,
      colours: ['#005'],
    }
    render(palette)

    await userEvent.click(screen.getByTestId(TestIds.Button))

    expect(await navigator.clipboard.readText()).toBe(colourPaletteXml(palette))
  })
})
