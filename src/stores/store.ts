import {configureStore} from '@reduxjs/toolkit'
import colourPaletteReducer from './colourpalette/colourPaletteSlice'

export const store = configureStore({
  reducer: {
    colourPalette: colourPaletteReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
