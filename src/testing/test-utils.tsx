import * as testingLibraryUserEvent from '@testing-library/user-event'
import {JSX, PropsWithChildren} from 'react'
import {render, RenderOptions} from '@testing-library/react'
import {AppStore, RootState, setupStore} from 'src/stores/store'
import {Provider} from 'react-redux'
import {Colour} from 'src/stores/colourPaletteSlice'
import {vi} from 'vitest'

export const userEvent = testingLibraryUserEvent.default.setup({delay: null})

/**
 * Creates an array of Colour objects for the given colour(s)
 * @param colours Either a single hex value or an array of hex values in the standard RGB format
 * @param selected When true, selects the first colour. When a number, selects the colour with that index.
 * @returns An array of Colour objects
 */
export const createColours = (
  colours: string | string[] = '',
  selected: boolean | number = false
): Colour[] => {
  if (typeof colours === 'string') colours = [colours]
  if (typeof selected === 'boolean') selected = selected ? 0 : -1

  let lastId = 1

  return colours.map((x, i) => {
    return {
      id: lastId++,
      hex: (x || '#FFFFFF').toUpperCase(),
      isSelected: i === selected,
    }
  })
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: AppStore
}

/**
 * Renders a component inside the Redux store provider
 * @param ui The component to render
 * @param param1 Any default state
 * @returns
 */
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({children}: PropsWithChildren<object>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }
  return {store, ...render(ui, {wrapper: Wrapper, ...renderOptions})}
}

/** A 300x200 image with equal squares of red, green, blue and white on the top row, and white, black and clear on the bottom */
export const testImage = new Image(300, 200)
testImage.src =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADIBAMAAACg8cFmAAAAE' +
  'lBMVEVHcEwAAP//////AAAAAAAA/wB8gMCjAAAAAXRSTlMAQObYZgAAAJ1JREFUeNrtzjEN' +
  'ADAMBLGGSiiEfsAVw2+V6ttPcs1J6/jY+CgsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCw' +
  'sLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLKwPWY2FhYWFhYWFhYWFhYWFhYWFhYWFhY' +
  'WFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYX1BusCm3fPbX13kEEAAAAASUVORK5CYII='

const parseColour = (rgba: string) =>
  new Uint8ClampedArray([
    parseInt(rgba.substring(1, 3), 16),
    parseInt(rgba.substring(3, 5), 16),
    parseInt(rgba.substring(5, 7), 16),
    rgba.length == 9 ? parseInt(rgba.substring(7, 9), 16) : 255,
  ])

/**
 * Mocks the CanvasRenderingContext2D.getImageData function to return the colour of parts of a canvas
 * @param colour Either a single hex value that will be returned as the colour for all calls, or an array of offset positions and the colours to return for those positions
 * @returns ImageData containing the colour in the data property
 */
export function mockCanvasImageData(colour: string | {x: number; y: number; rgba: string}[]) {
  const mock = vi.spyOn(CanvasRenderingContext2D.prototype, 'getImageData')

  if (typeof colour === 'string') {
    mock.mockReturnValue(new ImageData(parseColour(colour), 1, 1))
    return
  }

  const callMap = new Map<string, Uint8ClampedArray>()
  colour.forEach((c) => {
    callMap.set(`${c.x}_${c.y}`, parseColour(c.rgba))
  })

  mock.mockImplementation(
    (x: number, y: number) =>
      new ImageData(callMap.get(`${x}_${y}`) ?? new Uint8ClampedArray(4), 1, 1)
  )
}
