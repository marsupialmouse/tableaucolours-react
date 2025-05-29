import {screen, fireEvent} from '@testing-library/react'
import {beforeAll, describe, expect, it, vi} from 'vitest'
import ColourPaletteEditor from './ColourPaletteEditor'
import {createColours, renderWithProviders, testImage, userEvent} from 'src/testing/test-utils'
import {default as TypeSelectorTestIds} from '../ColourPaletteTypeSelector/ColourPaletteTypeSelectorTestIds'
import {ColourPaletteType, ColourPaletteTypes} from 'src/types/ColourPaletteTypes'
import {defaultColourPaletteType, initialColourPaletteState} from 'src/stores/colourPaletteSlice'
import {initialImageState} from 'src/stores/imageSlice'

interface RenderProps {
  name?: string
  type?: ColourPaletteType
  numberOfColours?: number
  hasImage?: boolean
}

function render(props?: RenderProps) {
  const colours = Array.from(Array(props?.numberOfColours ?? 0).keys()).map(
    (x) => '#0000' + (10 + x).toString()
  )
  const palette = props
    ? {
        ...initialColourPaletteState,
        name: props.name ?? '',
        type: props.type?.id ?? defaultColourPaletteType.id,
        colours: createColours(colours),
      }
    : initialColourPaletteState

  return renderWithProviders(<ColourPaletteEditor />, {
    preloadedState: {
      colourPalette: palette,
      image: {...initialImageState, imageSrc: props?.hasImage ? testImage.src : undefined},
    },
  })
}

describe('Colour palette editor', () => {
  beforeAll(() => {
    window.confirm = vi.fn(() => true)

    HTMLDialogElement.prototype.show = vi.fn()
    HTMLDialogElement.prototype.showModal = vi.fn()
    HTMLDialogElement.prototype.close = vi.fn()
  })

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

  it('updates the palette type in state when type is changed', async () => {
    const {store} = render({type: ColourPaletteTypes.sequential})

    await userEvent.click(screen.getByTestId(TypeSelectorTestIds.Selected))
    await userEvent.click(screen.getByText(ColourPaletteTypes.diverging.name))

    expect(store.getState().colourPalette.type).toBe(ColourPaletteTypes.diverging.id)
  })
})
