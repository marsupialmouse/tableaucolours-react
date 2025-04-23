import {createSlice, PayloadAction} from '@reduxjs/toolkit/react'
import {ColourPaletteTypes} from 'src/types/ColourPaletteTypes'
import {RootState} from './store'

export const defaultColourPaletteType = ColourPaletteTypes.regular
const maximumColours = 20
let lastColourId = 1

export interface Colour {
  id: number
  hex: string
  isSelected: boolean
}

export interface ColourPalette {
  name: string
  type: string
  colours: Colour[]
}

export interface ColourPaletteState extends ColourPalette {
  isOpen: boolean
  hasChanges: boolean
}

export const initialColourPaletteState: ColourPaletteState = {
  name: '',
  type: defaultColourPaletteType.id,
  colours: createColours(),
  isOpen: false,
  hasChanges: false,
}

function createColour(hex?: string, isSelected?: boolean): Colour {
  return {
    id: lastColourId++,
    hex: (hex ?? '#FFFFFF').toUpperCase(),
    isSelected: isSelected === true,
  }
}

function createColours(colours?: string[], selectFirstColour?: boolean): Colour[] {
  colours = colours ?? ['#FFFFFF']
  return colours.map((c, i) => createColour(c, selectFirstColour && i === 0))
}

const replaceColours = (state: ColourPaletteState, hexes: string[]) => {
  state.colours = createColours(
    hexes.length > maximumColours ? hexes.slice(0, maximumColours) : hexes,
    true
  )
  state.hasChanges = true
}

const replacePalette = (
  state: ColourPaletteState,
  name: string,
  type: string,
  colourHexes: string[]
) => {
  if (!ColourPaletteTypes.find(type)) {
    console.debug(`'$type' is not a valid ColourPaletteType`)
    type = defaultColourPaletteType.id
  }
  state.name = name || ''
  state.type = type
  state.hasChanges = true
  replaceColours(state, colourHexes)
}

const selectColour = (state: ColourPaletteState, colour: Colour) => {
  state.colours.forEach((x) => {
    x.isSelected = x.id === colour.id
  })
}

export const colourPaletteSlice = createSlice({
  name: 'colourPalette',
  initialState: initialColourPaletteState,
  reducers: {
    colourAdded(state, action: PayloadAction<{hex?: string}>) {
      if (state.colours.length >= maximumColours) return
      const colour = createColour(action.payload.hex ?? '#FFFFFF')
      state.colours.push(colour)
      state.hasChanges = true
      selectColour(state, colour)
    },

    colourChanged(state, action: PayloadAction<{colour: Colour; hex: string}>) {
      const c = state.colours.find((x) => x.id === action.payload.colour.id)
      if (!c) return
      c.hex = action.payload.hex
      state.hasChanges = true
    },

    colourRemoved(state, action: PayloadAction<{colour: Colour}>) {
      const c = state.colours
      const index = c.findIndex((x) => x.id === action.payload.colour.id)
      if (index < 0) return
      c.splice(index, 1)
      state.hasChanges = true
      if (!action.payload.colour.isSelected) return
      selectColour(state, c[index >= c.length ? c.length - 1 : index])
    },

    colourMoved(
      state,
      action: PayloadAction<{
        colour: Colour
        newIndex: number
      }>
    ) {
      const c = state.colours
      const oldIndex = c.findIndex((x) => x.id === action.payload.colour.id)
      c.splice(action.payload.newIndex, 0, c.splice(oldIndex, 1)[0])
      state.hasChanges = true
    },

    colourSelected(state, action: PayloadAction<{colour: Colour}>) {
      selectColour(state, action.payload.colour)
    },

    coloursReplaced(state, action: PayloadAction<{hexes: string[]}>) {
      replaceColours(state, action.payload.hexes)
    },

    coloursReset(state) {
      replaceColours(state, new Array<string>(0))
    },

    paletteReplaced(
      state,
      action: PayloadAction<{
        name: string
        type: string
        colourHexes: string[]
      }>
    ) {
      replacePalette(state, action.payload.name, action.payload.type, action.payload.colourHexes)
    },

    paletteReset(state) {
      replacePalette(state, '', defaultColourPaletteType.id, new Array<string>(0))
    },
  },
})

export const {
  colourAdded,
  colourChanged,
  colourMoved,
  colourRemoved,
  colourSelected,
  coloursReplaced,
  coloursReset,
  paletteReplaced,
  paletteReset,
} = colourPaletteSlice.actions

export const selectColourPalette = (state: RootState): ColourPalette => state.colourPalette
export const selectColourPaletteName = (state: RootState) => state.colourPalette.name
export const selectColourPaletteType = (state: RootState) =>
  ColourPaletteTypes.get(state.colourPalette.type)
export const selectColourPaletteColours = (state: RootState) => state.colourPalette.colours
export const selectColourPaletteHasChanges = (state: RootState) => state.colourPalette.hasChanges
export const selectColourPaletteIsOpen = (state: RootState) => state.colourPalette.isOpen
export const selectSelectedColour = (state: RootState) =>
  state.colourPalette.colours.find((x) => x.isSelected)
export const selectCanPickColour = (state: RootState) =>
  state.colourPalette.isOpen && !!selectSelectedColour(state)

export default colourPaletteSlice.reducer
