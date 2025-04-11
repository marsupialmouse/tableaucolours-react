import {describe, it, expect} from 'vitest'
import {screen, render} from '@testing-library/react'
import ColourPaletteTypeSelectorItem from './ColourPaletteTypeSelectorItem'
import {default as TestIds} from './ColourPaletteTypeSelectorItemTestIds'
import classes from './ColourPaletteTypeSelectorItem.module.less'
import {ColourPaletteTypes} from 'src/types/ColourPaletteTypes'

describe('Colour palette type selector item', () => {
  it('renders as as a div', () => {
    render(<ColourPaletteTypeSelectorItem type={ColourPaletteTypes.regular} />)

    expect(screen.getByTestId(TestIds.Self)).toBeInstanceOf(HTMLDivElement)
  })
  describe.each([
    {type: ColourPaletteTypes.regular},
    {type: ColourPaletteTypes.diverging},
    {type: ColourPaletteTypes.sequential},
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
