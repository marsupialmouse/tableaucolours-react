import {PaletteActions, PaletteActionTypes} from './PaletteActions'
import {PaletteType, PaletteTypes} from './PaletteTypes'

export interface Colour {
  id: number
  hex: string
  isSelected: boolean
}

export interface ColourPalette {
  name: string
  type: PaletteType
  colours: Colour[]
  isOpen: boolean
  hasChanges: boolean
}

let nextColourId = 1

const defaultType = PaletteTypes.regular
const maximumColours = 20

export function createColours(
  colours?: string[],
  selectFirstColour?: boolean
): Colour[] {
  colours = colours || ['#FFFFFF']
  return colours.map((c, i) => createColour(c, selectFirstColour && i === 0))
}

export function createColour(hex: string, isSelected?: boolean): Colour {
  if (!hex) {
    hex = '#FFFFFF'
  }
  return {
    id: nextColourId++,
    hex: hex.toUpperCase(),
    isSelected: isSelected === true,
  }
}

export const initialPaletteState: ColourPalette = {
  name: '',
  type: defaultType,
  colours: createColours(),
  isOpen: false,
  hasChanges: false,
}

export function paletteReducer(draft: ColourPalette, action: PaletteActions) {
  function selectColour(colour: Colour, colours: Colour[]) {
    colours.forEach((x) => (x.isSelected = x.id === colour.id))
  }

  function replaceColours(palette: ColourPalette, colours?: string[]) {
    palette.colours = createColours(
      colours && colours.length > maximumColours
        ? colours.slice(0, maximumColours)
        : colours,
      true
    )
    palette.hasChanges = true
  }

  switch (action.type) {
    case PaletteActionTypes.AddColour:
      if (draft.colours.length < maximumColours) {
        const colour = createColour(action.payload ?? '#FFFFFF')
        draft.colours.push(colour)
        selectColour(colour, draft.colours)
        draft.hasChanges = true
      }
      break

    case PaletteActionTypes.ChangeColour:
      draft.colours.find((x) => x.id === action.payload.colour.id)!.hex =
        action.payload.hex
      draft.hasChanges = true
      break

    case PaletteActionTypes.RemoveColour:
      draft.colours = draft.colours.filter((x) => x.id !== action.payload.id)
      draft.hasChanges = true
      break

    case PaletteActionTypes.MoveColour:
      let c = draft.colours
      const oldIndex = c.findIndex((x) => x.id === action.payload.colour.id)
      c.splice(action.payload.newIndex, 0, c.splice(oldIndex, 1)[0])
      draft.hasChanges = true
      break

    case PaletteActionTypes.SelectColour:
      selectColour(action.payload, draft.colours)
      break

    case PaletteActionTypes.ReplaceColours:
      replaceColours(draft, action.payload)
      break

    case PaletteActionTypes.ReplacePalette:
      draft.name = action.payload?.name || ''
      draft.type = action.payload?.type || defaultType
      replaceColours(draft, action.payload?.colours)
      draft.hasChanges = true
      break
  }
}
