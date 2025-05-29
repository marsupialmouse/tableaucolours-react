import {screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import ColourPaletteEditor from './ColourPaletteEditor'
import {renderWithProviders} from 'src/testing/test-utils'
import {default as TestIds} from './ColourPaletteEditorTestIds'
import {initialColourPaletteState} from 'src/stores/colourPaletteSlice'

interface RenderProps {
  isPaletteOpen?: boolean
}

function render(props?: RenderProps) {
  const palette = props
    ? {
        ...initialColourPaletteState,
        isOpen: props.isPaletteOpen ?? true,
      }
    : initialColourPaletteState

  return renderWithProviders(<ColourPaletteEditor />, {
    preloadedState: {
      colourPalette: palette,
    },
  })
}

describe('Colour palette editor', () => {
  // This should really be when TPS file is not open
  it('does not render back button when palette is open', () => {
    render({isPaletteOpen: true})

    expect(screen.queryByTestId(TestIds.TpsBack)).not.toBeInTheDocument()
  })

  // This should really be when TPS file is open
  it('renders back button when palette is not open', () => {
    render({isPaletteOpen: false})

    expect(screen.getByTestId(TestIds.TpsBack)).toBeInTheDocument()
  })

  // This should really be when TPS file is not open
  it('does not render done/cancel buttons when palette is open', () => {
    render({isPaletteOpen: true})

    expect(screen.queryByTestId(TestIds.TpsButtons)).not.toBeInTheDocument()
  })

  // This should really be when TPS file is open
  it('renders done/cancel buttons when palette is not open', () => {
    render({isPaletteOpen: false})

    expect(screen.getByTestId(TestIds.TpsButtons)).toBeInTheDocument()
  })
})
