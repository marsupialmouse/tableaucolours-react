import {describe, it, expect, test} from 'vitest'
import {screen, render} from '@testing-library/react'
import ColourPaletteTypeSelectorItem from './ColourPaletteTypeSelectorItem'
import {default as TestIds} from './ColourPaletteTypeSelectorItemTestIds'
import classes from './ColourPaletteTypeSelectorItem.module.less'
import {PaletteTypes} from 'src/state/ColourPalettes/PaletteTypes.ts'

describe('Colour palette type selector item', () => {
  it('renders as as a div', () => {
    render(<ColourPaletteTypeSelectorItem type={PaletteTypes.regular} />)

    expect(screen.getByTestId(TestIds.Self)).toBeInstanceOf(HTMLDivElement)
  })
  describe.each([
    {type: PaletteTypes.regular},
    {type: PaletteTypes.diverging},
    {type: PaletteTypes.sequential},
  ])('When type is $type.name', ({type}) => {
    it(`has ${type.id} in example class name`, () => {
      render(<ColourPaletteTypeSelectorItem type={type} />)

      expect(screen.getByTestId(TestIds.Example)).toHaveClass(
        classes['palettetype-example--' + type.id]
      )
    })
    it(`component has display name ${type.name}`, () => {
      render(<ColourPaletteTypeSelectorItem type={type} />)

      expect(screen.getByTestId(TestIds.Name)).toHaveTextContent(type.name)
    })
  })
})
