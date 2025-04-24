import {combineReducers, configureStore} from '@reduxjs/toolkit'
import colourPaletteReducer from './colourPaletteSlice'
import imageReducer from './imageSlice'

const rootReducer = combineReducers({
  colourPalette: colourPaletteReducer,
  image: imageReducer,
})

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
