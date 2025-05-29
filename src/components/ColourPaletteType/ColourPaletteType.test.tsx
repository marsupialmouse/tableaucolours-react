import {screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {renderWithProviders, userEvent} from 'src/testing/test-utils'
import {default as TypeSelectorTestIds} from '../ColourPaletteTypeSelector/ColourPaletteTypeSelectorTestIds'
import {
  ColourPaletteType as PaletteType,
  ColourPaletteTypes as PaletteTypes,
} from 'src/types/ColourPaletteTypes'
import {defaultColourPaletteType, initialColourPaletteState} from 'src/stores/colourPaletteSlice'
import ColourPaletteType from './ColourPaletteType'

interface RenderProps {
  type?: PaletteType
}

function render(props?: RenderProps) {
  const palette = props
    ? {
        ...initialColourPaletteState,
        type: props.type?.id ?? defaultColourPaletteType.id,
      }
    : initialColourPaletteState

  return renderWithProviders(<ColourPaletteType />, {
    preloadedState: {
      colourPalette: palette,
    },
  })
}

describe('Colour palette type', () => {
  it('updates the palette type in state when type is changed', async () => {
    const {store} = render({type: PaletteTypes.sequential})

    await userEvent.click(screen.getByTestId(TypeSelectorTestIds.Selected))
    await userEvent.click(screen.getByText(PaletteTypes.diverging.name))

    expect(store.getState().colourPalette.type).toBe(PaletteTypes.diverging.id)
  })
})
