import {describe, it, expect} from 'vitest'
import {screen, render} from '@testing-library/react'
import ColourPalettePreview from './ColourPalettePreview'
import {default as TestIds} from './ColourPalettePreviewTestIds'
import {PaletteTypes} from 'src/state/ColourPalettes/PaletteTypes.ts'
import {Colour} from 'src/state/ColourPalettes/PaletteReducer'

let id = 0

function colour(hex: string): Colour {
  return {id: id++, hex: hex, isSelected: false}
}

describe('Colour palette type selector', () => {
  it('renders as as a div', () => {
    render(
      <ColourPalettePreview
        type={PaletteTypes.regular}
        colours={[colour('#fff')]}
      />
    )

    expect(screen.getByTestId(TestIds.Self)).toBeInstanceOf(HTMLDivElement)
  })

  /*
  These tests don't work because Vite doesn't load css by default
  it("renders colours as stepped linear gradient when type is 'regular'", () => {
    render(
      <ColourPalettePreview
        type={PaletteTypes.regular}
        colours={[
          colour('#fff'),
          colour('#000'),
          colour('#f00'),
          colour('#00f'),
        ]}
      />
    )

    expect(screen.getByTestId(TestIds.Self)).toHaveStyle(
      'background: linear-gradient(to right #fff 0%, #000 25%, #f00 50%, #00f 75%)'
    )
  })

  test.each([{type: PaletteTypes.diverging}, {type: PaletteTypes.sequential}])(
    'renders colours as smooth linear gradient when type is $type.id',
    ({type}) => {
      render(
        <ColourPalettePreview
          type={type}
          colours={[
            colour('#fff'),
            colour('#000'),
            colour('#f00'),
            colour('#00f'),
          ]}
        />
      )

      expect(screen.getByTestId(TestIds.Self)).toHaveStyle(
        'background: linear-gradient(to right #fff, #000, #f00, #00f, #000)'
      )
    }
  )
    */
})
