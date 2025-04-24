import {createColours, renderWithProviders, userEvent} from 'src/testing/test-utils'
import ImageColourPicker from './ImageColourPicker'
import {ColourPaletteTypes} from 'src/types/ColourPaletteTypes'
import {Colour, selectColourPaletteColours} from 'src/stores/colourPaletteSlice'
import {JSX} from 'react'
import {useSelector} from 'react-redux'
import {selectImageScale, selectImageSrc} from 'src/stores/imageSlice'
import {describe, expect, it, test, vi} from 'vitest'
import {fireEvent, screen, waitFor} from '@testing-library/react'
import {default as TestIds} from './ImageColourPickerTestIds'
import {ImageColourPickerImageCanvasProps} from '../ImageColourPickerImageCanvas/ImageColourPickerImageCanvas'
import {ImageZoomProps} from '../ImageZoom/ImageZoom'
import {ImageFileOpenProps} from '../ImageFileOpen/ImageFileOpen'

const canvasPickedColour = '#FFEEDD'
const canvasScaledScale = 3.15
const zoomScaledScale = 0.482
const gifBase64 = 'R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
const pngBase64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=='

function createImageFile(name: string, type: string, base64data: string) {
  const binaryString = atob(base64data)
  const length = binaryString.length
  const bytes = new Uint8Array(length)

  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  return new File([bytes.buffer], name, {type})
}

vi.mock('../ImageColourPickerImageCanvas/ImageColourPickerImageCanvas', () => ({
  default: ({onColourPicked, onScaleChanged, onFileDropped}: ImageColourPickerImageCanvasProps) => {
    return (
      <>
        <button
          data-testid="canvas-pickcolour"
          onClick={() => onColourPicked?.(canvasPickedColour)}
        />
        <button
          data-testid="canvas-scaleimage"
          onClick={() => onScaleChanged?.(canvasScaledScale)}
        />
        <button
          data-testid="canvas-dropfile"
          onClick={() =>
            onFileDropped?.([
              new File(['bye'], 'bye.txt', {type: 'text/plain'}),
              createImageFile('hello.gif', 'image/gif', gifBase64),
              createImageFile('hello.png', 'image/png', pngBase64),
            ])
          }
        />
      </>
    )
  },
}))

vi.mock('../ImageZoom/ImageZoom', () => ({
  default: ({onScaleChanged}: ImageZoomProps) => {
    return (
      <button data-testid="zoom-scaleimage" onClick={() => onScaleChanged?.(zoomScaledScale)} />
    )
  },
}))

vi.mock('../ImageFileOpen/ImageFileOpen', () => ({
  default: ({onFileSelected}: ImageFileOpenProps) => {
    return (
      <button
        data-testid="open-selectfile"
        onClick={() =>
          onFileSelected?.([
            new File(['bye'], 'bye.txt', {type: 'text/plain'}),
            createImageFile('hello.png', 'image/png', pngBase64),
            createImageFile('hello.gif', 'image/gif', gifBase64),
          ])
        }
      />
    )
  },
}))

interface RenderProps {
  colours?: Colour[]
  imageSrc?: string
  imageScale?: number
}

function render({colours, imageSrc, imageScale = 1}: RenderProps) {
  renderWithProviders(
    <StateWrapper>
      <ImageColourPicker />
    </StateWrapper>,
    {
      preloadedState: {
        colourPalette: {
          name: '',
          type: ColourPaletteTypes.regular.id,
          colours: colours ?? createColours('#000000', true),
          isOpen: true,
          hasChanges: false,
        },
        image: {
          imageSrc,
          scale: imageScale,
        },
      },
    }
  )
}

const StateWrapper = ({children}: {children: JSX.Element}) => {
  const colours = useSelector(selectColourPaletteColours)
  const imageSrc = useSelector(selectImageSrc)
  const imageScale = useSelector(selectImageScale)

  return (
    <>
      {children}
      <div data-testid="colourHexes">{colours.map((x) => x.hex).join(' ')}</div>
      <div data-testid="colourSelection">
        {colours.map((x) => (x.isSelected ? 'Y' : 'N')).join()}
      </div>
      <div data-testid="imageSrc">{imageSrc}</div>
      <div data-testid="imageScale">{imageScale}</div>
      <div data-testid="paste-target"></div>
      <textarea data-testid="paste-textarea"></textarea>
      <input type="text" data-testid="paste-input" />
    </>
  )
}

describe('Image colour palette', () => {
  it('renders as div', () => {
    render({})

    expect(screen.getByTestId(TestIds.Self)).toBeInstanceOf(HTMLDivElement)
  })

  it('updates selected colour when colour is picked in canvas component', async () => {
    render({colours: createColours(['#FF0000', '#00FF00', '#0000FF', '#000000'], 2)})

    await userEvent.click(screen.getByTestId('canvas-pickcolour'))

    expect(screen.getByTestId('colourHexes')).toHaveTextContent(
      `#FF0000 #00FF00 ${canvasPickedColour} #000000`
    )
  })

  it('updates scale when scale changed in canvas component', async () => {
    render({imageScale: 0.92})

    await userEvent.click(screen.getByTestId('canvas-scaleimage'))

    expect(screen.getByTestId('imageScale')).toHaveTextContent(canvasScaledScale.toString())
  })

  it('updates scale when scale changed in zoom component', async () => {
    render({imageScale: 1.83})

    await userEvent.click(screen.getByTestId('zoom-scaleimage'))

    expect(screen.getByTestId('imageScale')).toHaveTextContent(zoomScaledScale.toString())
  })

  it('updates image src for first image when files pasted in window', async () => {
    const files = [
      new File(['bye'], 'bye.txt', {type: 'text/plain'}),
      createImageFile('hello.gif', 'image/gif', gifBase64),
      createImageFile('hello.png', 'image/png', pngBase64),
    ]
    const items = [
      {getAsFile: () => null},
      {getAsFile: () => files[0]},
      {getAsFile: () => files[1]},
      {getAsFile: () => files[2]},
    ]

    render({})

    fireEvent.paste(screen.getByTestId('paste-target'), {clipboardData: {items}})

    await waitFor(() =>
      expect(screen.getByTestId('imageSrc')).toHaveTextContent(`data:image/gif;base64,${gifBase64}`)
    )
  })

  test.for([{element: 'input'}, {element: 'textarea'}])(
    'does not update image when image pasted in $element element',
    async ({element}) => {
      const items = [{getAsFile: () => createImageFile('hello.gif', 'image/gif', gifBase64)}]
      render({})

      fireEvent.paste(screen.getByTestId('paste-' + element), {clipboardData: {items}})

      await new Promise((r) => setTimeout(r, 50))

      expect(screen.getByTestId('imageSrc')).toHaveTextContent('')
    }
  )

  it('updates image src for first image when files dropped on image canvas', async () => {
    render({})

    await userEvent.click(screen.getByTestId('canvas-dropfile'))

    await waitFor(() =>
      expect(screen.getByTestId('imageSrc')).toHaveTextContent(`data:image/gif;base64,${gifBase64}`)
    )
  })

  it('updates image src for first image when file opened', async () => {
    render({})

    await userEvent.click(screen.getByTestId('open-selectfile'))

    await waitFor(() =>
      expect(screen.getByTestId('imageSrc')).toHaveTextContent(`data:image/png;base64,${pngBase64}`)
    )
  })
})
