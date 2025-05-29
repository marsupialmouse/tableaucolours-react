import {screen, fireEvent} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import ColourPaletteName from './ColourPaletteName'
import {renderWithProviders} from 'src/testing/test-utils'
import {initialColourPaletteState} from 'src/stores/colourPaletteSlice'

interface RenderProps {
  name?: string
}

function render(props?: RenderProps) {
  const palette = props
    ? {
        ...initialColourPaletteState,
        name: props.name ?? '',
      }
    : initialColourPaletteState

  return renderWithProviders(<ColourPaletteName />, {
    preloadedState: {
      colourPalette: palette,
    },
  })
}

describe('Colour palette name', () => {
  it('renders the palette name input with the correct placeholder', () => {
    render()
    const input = screen.getByPlaceholderText('Enter a palette name')

    expect(input).toBeInTheDocument()
  })

  it('updates the palette name in state when input changes', () => {
    const {store} = render()
    const input = screen.getByPlaceholderText('Enter a palette name')

    fireEvent.change(input, {target: {value: 'Quail 2.0'}})

    expect(store.getState().colourPalette.name).toBe('Quail 2.0')
  })
})
