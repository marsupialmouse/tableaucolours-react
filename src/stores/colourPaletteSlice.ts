import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit/react'
import {ColourPaletteTypes} from 'src/types/ColourPaletteTypes'
import {RootState} from './store'

export const defaultColourPaletteType = ColourPaletteTypes.regular
export const maximumPaletteColours = 20
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
  isOpen: true, // Should be false when we add TPS support
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
    hexes.length > maximumPaletteColours ? hexes.slice(0, maximumPaletteColours) : hexes,
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

const changeColour = (state: ColourPaletteState, colour: Colour | undefined, hex: string) => {
  if (!colour) return
  colour.hex = hex
  state.hasChanges = true
}
const selectColour = (state: ColourPaletteState, colour: Colour) => {
  state.colours.forEach((x) => {
    x.isSelected = x.id === colour.id
  })
}

const getSelectedColour = (colours: Colour[]) => colours.find((x) => x.isSelected)

export const colourPaletteSlice = createSlice({
  name: 'colourPalette',
  initialState: initialColourPaletteState,
  reducers: {
    colourAdded(state, action: PayloadAction<{hex?: string}>) {
      if (state.colours.length >= maximumPaletteColours) return
      const colour = createColour(action.payload.hex ?? '#FFFFFF')
      state.colours.push(colour)
      state.hasChanges = true
      selectColour(state, colour)
    },

    coloursAdded(state, action: PayloadAction<{hexes: string[]}>) {
      const colourCapacity = maximumPaletteColours - state.colours.length
      let hexes = [...action.payload.hexes]
      if (hexes.length > colourCapacity) {
        hexes = hexes.slice(0, colourCapacity)
      }
      if (!hexes.length) return

      hexes.forEach((x) => state.colours.push(createColour(x)))
      state.hasChanges = true
    },

    colourChanged(state, action: PayloadAction<{colour: Colour; hex: string}>) {
      const c = state.colours.find((x) => x.id === action.payload.colour.id)
      changeColour(state, c, action.payload.hex)
    },

    selectedColourChanged(state, action: PayloadAction<{hex: string}>) {
      const c = getSelectedColour(state.colours)
      changeColour(state, c, action.payload.hex)
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

    paletteNameChanged(state, action: PayloadAction<{name: string}>) {
      state.name = action.payload.name
      state.hasChanges = true
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

    paletteTypeChanged(state, action: PayloadAction<{type: string}>) {
      let type = action.payload.type
      if (!ColourPaletteTypes.find(type)) {
        console.debug(`'${type}' is not a valid ColourPaletteType`)
        type = defaultColourPaletteType.id
      }
      state.type = type
      state.hasChanges = true
    },
  },
})

export const {
  colourAdded,
  colourChanged,
  selectedColourChanged,
  colourMoved,
  colourRemoved,
  colourSelected,
  coloursAdded,
  coloursReplaced,
  coloursReset,
  paletteNameChanged,
  paletteReplaced,
  paletteReset,
  paletteTypeChanged,
} = colourPaletteSlice.actions

const typeSelector = (state: RootState) => state.colourPalette.type

export const selectColourPalette = (state: RootState): ColourPalette => state.colourPalette
export const selectColourPaletteName = (state: RootState) => state.colourPalette.name
export const selectColourPaletteType = createSelector(typeSelector, (type) =>
  ColourPaletteTypes.get(type)
)
export const selectColourPaletteColours = (state: RootState) => state.colourPalette.colours
export const selectColourPaletteHasColours = (state: RootState) =>
  state.colourPalette.colours.length > 0
export const selectColourPaletteHasChanges = (state: RootState) => state.colourPalette.hasChanges
export const selectColourPaletteIsOpen = (state: RootState) => state.colourPalette.isOpen
export const selectSelectedColour = createSelector(selectColourPaletteColours, (colours) =>
  getSelectedColour(colours)
)
export const selectCanAddColour = (state: RootState) =>
  state.colourPalette.colours.length < maximumPaletteColours

export const selectCanPickColour = createSelector(
  [selectColourPaletteIsOpen, selectSelectedColour],
  (isOpen, selectedColour) => isOpen && !!selectedColour
)

export default colourPaletteSlice.reducer
