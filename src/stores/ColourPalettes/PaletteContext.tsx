import {createContext, ReactNode, useContext} from 'react'
import {useImmerReducer} from 'use-immer'
import {PaletteActions} from './PaletteActions'
import {initialPaletteState, paletteReducer} from './PaletteReducer'
import {ColourPalette} from '../../types/ColourPalette'

const PaletteContext = createContext<ColourPalette | null>(null)
const PaletteDispatchContext =
  createContext<React.Dispatch<PaletteActions> | null>(null)

type ContextProviderProps = {
  initialState?: ColourPalette
  children: ReactNode
}

export function PaletteContextProvider({
  initialState,
  children,
}: ContextProviderProps) {
  const [state, dispatch] = useImmerReducer(
    paletteReducer,
    initialState ?? initialPaletteState
  )

  return (
    <PaletteContext.Provider value={state}>
      <PaletteDispatchContext.Provider value={dispatch}>
        {children}
      </PaletteDispatchContext.Provider>
    </PaletteContext.Provider>
  )
}

export function usePalette() {
  const context = useContext(PaletteContext)

  if (!context) {
    throw new Error(
      'The Palette Context must be used within an PaletteContextProvider'
    )
  }

  return context
}

export function usePaletteDispatch() {
  const dispatch = useContext(PaletteDispatchContext)

  if (!dispatch) {
    throw new Error(
      'The Palette Dispatch Context must be used within an PaletteContextProvider'
    )
  }

  return dispatch
}
