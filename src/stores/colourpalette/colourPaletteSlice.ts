import {createSlice, PayloadAction} from '@reduxjs/toolkit/react'
import {
  ColourPaletteType,
  ColourPaletteTypes,
} from 'src/types/ColourPaletteTypes'
import {RootState} from '../store'

const defaultColourPaletteType = ColourPaletteTypes.regular
const maximumColours = 20
let lastColourId = 1

export interface ColourPaletteState {
  name: string
  type: ColourPaletteType
  colours: Colour[]
  isOpen: boolean
  hasChanges: boolean
}

export class Colour {
  id: number
  hex: string
  isSelected: boolean

  constructor(id: number, hex: string, isSelected: boolean) {
    this.id = id
    this.hex = (hex ? hex : '#FFFFFF').toUpperCase()
    this.isSelected = isSelected === true
  }

  static create(hex?: string, isSelected?: boolean): Colour {
    return new Colour(lastColourId++, hex ?? '', isSelected === true)
  }
}

function createColours(
  colours?: string[],
  selectFirstColour?: boolean
): Colour[] {
  colours = colours || ['#FFFFFF']
  return colours.map((c, i) => Colour.create(c, selectFirstColour && i === 0))
}

const initialState: ColourPaletteState = {
  name: '',
  type: defaultColourPaletteType,
  colours: createColours(),
  isOpen: false,
  hasChanges: false,
}

export const colourPaletteSlice = createSlice({
  name: 'colourPalette',
  initialState,
  reducers: {
    colourAdded(state, action: PayloadAction<{hex?: string}>) {
      if (state.colours.length >= maximumColours) return

      const colour = Colour.create(action.payload.hex ?? '#FFFFFF')
      state.colours.push(colour)
      state.hasChanges = true
      colourPaletteSlice.actions.colourSelected({colour})
    },

    colourChanged(state, action: PayloadAction<{colour: Colour; hex: string}>) {
      state.colours.find((x) => x.id === action.payload.colour.id)!.hex =
        action.payload.hex
      state.hasChanges = true
    },

    colourRemoved(state, action: PayloadAction<{colour: Colour}>) {
      state.colours = state.colours.filter(
        (x) => x.id !== action.payload.colour.id
      )
      state.hasChanges = true
    },

    colourMoved(
      state,
      action: PayloadAction<{
        colour: Colour
        oldIndex: number
        newIndex: number
      }>
    ) {
      let c = state.colours
      const oldIndex = c.findIndex((x) => x.id === action.payload.colour.id)
      c.splice(action.payload.newIndex, 0, c.splice(oldIndex, 1)[0])
      state.hasChanges = true
    },

    colourSelected(state, action: PayloadAction<{colour: Colour}>) {
      state.colours.forEach(
        (x) => (x.isSelected = x.id === action.payload.colour.id)
      )
    },

    coloursReplaced(state, action: PayloadAction<{hexes: string[]}>) {
      const hexes = action?.payload.hexes || []
      state.colours = createColours(
        hexes.length > maximumColours ? hexes.slice(0, maximumColours) : hexes,
        true
      )
      state.hasChanges = true
    },

    coloursReset() {
      colourPaletteSlice.actions.coloursReplaced({hexes: new Array<string>(0)})
    },

    paletteReplaced(
      state,
      action: PayloadAction<{
        name: string
        type: ColourPaletteType
        colourHexes: string[]
      }>
    ) {
      state.name = action.payload.name || ''
      state.type = action.payload.type || defaultColourPaletteType
      state.hasChanges = true
      colourPaletteSlice.actions.coloursReplaced({
        hexes: action.payload.colourHexes,
      })
    },

    paletteReset() {
      colourPaletteSlice.actions.paletteReplaced({
        name: '',
        type: defaultColourPaletteType,
        colourHexes: new Array<string>(0),
      })
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

export const selectColourPaletteName = (state: RootState) =>
  state.colourPalette.name
export const selectColourPaletteType = (state: RootState) =>
  state.colourPalette.type
export const selectColourPaletteColours = (state: RootState) =>
  state.colourPalette.colours
export const selectColourPaletteHasChanges = (state: RootState) =>
  state.colourPalette.hasChanges
export const selectColourPaletteIsOpen = (state: RootState) =>
  state.colourPalette.isOpen

export default colourPaletteSlice.reducer
