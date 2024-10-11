import {createContext, ReactNode, useContext} from 'react'
import {useImmerReducer} from 'use-immer'
import {PaletteActions} from './PaletteActions'
import {
  ColourPalette,
  initialPaletteState,
  paletteReducer,
} from './PaletteReducer'

type PaletteContextType = {
  state: ColourPalette
  dispatch: React.Dispatch<PaletteActions>
}

const PaletteContext = createContext<PaletteContextType | null>(null)

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
    <PaletteContext.Provider value={{state, dispatch}}>
      {children}
    </PaletteContext.Provider>
  )
}

export function usePaletteContext() {
  const context = useContext(PaletteContext)

  if (!context) {
    throw new Error(
      'The Palette Context must be used within an PaletteContextProvider'
    )
  }

  return context
}
