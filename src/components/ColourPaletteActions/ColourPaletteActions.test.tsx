import {screen, fireEvent} from '@testing-library/react'
import {beforeAll, describe, expect, it, vi} from 'vitest'
import ColourPaletteActions from './ColourPaletteActions'
import {createColours, renderWithProviders, testImage, userEvent} from 'src/testing/test-utils'
import {default as ModalTestIds} from '../ModalDialog/ModalDialogTestIds'
import {default as ColourExtractorTestIds} from '../ImageColourExtractor/ImageColourExtractorTestIds'
import {default as PaletteImportTestIds} from '../ColourPaletteImport/ColourPaletteImportTestIds'
import {default as GetCodeTestIds} from '../ColourPaletteGetCode/ColourPaletteGetCodeTestIds'
import {initialColourPaletteState, maximumPaletteColours} from 'src/stores/colourPaletteSlice'
import {initialImageState} from 'src/stores/imageSlice'

interface RenderProps {
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
        colours: createColours(colours),
      }
    : initialColourPaletteState

  return renderWithProviders(<ColourPaletteActions />, {
    preloadedState: {
      colourPalette: palette,
      image: {...initialImageState, imageSrc: props?.hasImage ? testImage.src : undefined},
    },
  })
}

describe('Colour palette actions', () => {
  beforeAll(() => {
    window.confirm = vi.fn(() => true)

    HTMLDialogElement.prototype.show = vi.fn()
    HTMLDialogElement.prototype.showModal = vi.fn()
    HTMLDialogElement.prototype.close = vi.fn()
  })

  it('adds a colour to the palette when "+" is pressed', async () => {
    const {store} = render({numberOfColours: 5})

    await userEvent.keyboard('+')

    expect(store.getState().colourPalette.colours).toHaveLength(6)
  })

  it('does not add a colour when "+" is pressed when the palette is full', async () => {
    const {store} = render({numberOfColours: maximumPaletteColours})

    await userEvent.keyboard('+')

    expect(store.getState().colourPalette.colours).toHaveLength(20)
  })

  it('adds a colour when the "Add Colour" button is clicked', () => {
    const {store} = render({numberOfColours: 13})

    fireEvent.click(screen.getByTitle('Add colour (+)'))

    expect(store.getState().colourPalette.colours).toHaveLength(14)
  })

  it('disables the "Add Colour" button when the palette is full', () => {
    render({numberOfColours: maximumPaletteColours})

    expect(screen.getByTitle('Add colour (+)')).toBeDisabled()
  })

  it('disables the "Extract Colours" button when no image selected', () => {
    render({hasImage: false})

    expect(screen.getByTitle('Extract colours from image (magic!)')).toBeDisabled()
  })

  it('opens the colour extractor modal when the extract button is clicked', () => {
    render({hasImage: true})

    fireEvent.click(screen.getByTitle('Extract colours from image (magic!)'))

    expect(screen.queryByTestId(ColourExtractorTestIds.Self)).toBeInTheDocument()
  })

  it('closes the colour extractor modal when modal close button clicked', () => {
    render({hasImage: true})

    fireEvent.click(screen.getByTitle('Extract colours from image (magic!)'))
    fireEvent.click(screen.getByTestId(ModalTestIds.CloseButton))

    expect(screen.queryByTestId(ColourExtractorTestIds.Self)).not.toBeInTheDocument()
  })

  it('closes the colour extractor modal when cancel button clicked', () => {
    render({hasImage: true})

    fireEvent.click(screen.getByTitle('Extract colours from image (magic!)'))
    fireEvent.click(screen.getByTestId(ColourExtractorTestIds.CancelButton))

    expect(screen.queryByTestId(ColourExtractorTestIds.Self)).not.toBeInTheDocument()
  })

  it('opens the import modal when the import button is clicked', () => {
    render()

    fireEvent.click(screen.getByTitle('Import XML'))

    expect(screen.queryByTestId(PaletteImportTestIds.Self)).toBeInTheDocument()
  })

  it('closes the import modal when modal close button clicked', () => {
    render()

    fireEvent.click(screen.getByTitle('Import XML'))
    fireEvent.click(screen.getByTestId(ModalTestIds.CloseButton))

    expect(screen.queryByTestId(PaletteImportTestIds.Self)).not.toBeInTheDocument()
  })

  it('closes the import modal when cancel button clicked', () => {
    render()

    fireEvent.click(screen.getByTitle('Import XML'))
    fireEvent.click(screen.getByTestId(PaletteImportTestIds.CancelButton))

    expect(screen.queryByTestId(PaletteImportTestIds.Self)).not.toBeInTheDocument()
  })

  it('opens the get code modal when the get XML button is clicked', () => {
    render()

    fireEvent.click(screen.getByTitle('Get XML'))

    expect(screen.queryByTestId(GetCodeTestIds.Self)).toBeInTheDocument()
  })

  it('closes the get code modal when modal close button clicked', () => {
    render()

    fireEvent.click(screen.getByTitle('Get XML'))
    fireEvent.click(screen.getByTestId(ModalTestIds.CloseButton))

    expect(screen.queryByTestId(GetCodeTestIds.Self)).not.toBeInTheDocument()
  })

  it('resets colours when the "Discard Colours" button is clicked', () => {
    const {store} = render({numberOfColours: 5})

    fireEvent.click(screen.getByTitle('Delete all colours'))

    expect(store.getState().colourPalette.colours).toHaveLength(0)
  })

  it('disables the "discard Colours" button when the palette is empty', () => {
    render({numberOfColours: 0})

    expect(screen.getByTitle('Delete all colours')).toBeDisabled()
  })
})
