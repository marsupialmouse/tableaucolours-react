import * as testingLibraryUserEvent from '@testing-library/user-event'
import {JSX, PropsWithChildren} from 'react'
import {render, RenderOptions} from '@testing-library/react'
import {AppStore, RootState, setupStore} from 'src/stores/store'
import {Provider} from 'react-redux'
import {Colour} from 'src/stores/colourpalette/colourPaletteSlice'

export const userEvent = testingLibraryUserEvent.default.setup({delay: null})

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
