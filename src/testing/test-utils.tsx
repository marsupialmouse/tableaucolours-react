import * as testingLibraryUserEvent from '@testing-library/user-event'
import {initialPaletteState} from '../stores/ColourPalettes/PaletteReducer'
import {ColourPalette} from '../types/ColourPalette'
import {PaletteContextProvider} from '../stores/ColourPalettes/PaletteContext'
import {ReactNode} from 'react'
import {render} from '@testing-library/react'

export const userEvent = testingLibraryUserEvent.default.setup({delay: null})

type RenderParams = {
  initialPaletteContext?: ColourPalette
  children: ReactNode
}

export function renderWithContext({
  initialPaletteContext,
  children,
}: RenderParams) {
  render(
    <PaletteContextProvider
      initialState={initialPaletteContext ?? initialPaletteState}
    >
      {children}
    </PaletteContextProvider>
  )
}
