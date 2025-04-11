import {ColourPaletteType} from './ColourPaletteTypes'
import {Colour} from './Colour'

export interface ColourPalette {
  name: string
  type: ColourPaletteType
  colours: Colour[]
  isOpen: boolean
  hasChanges: boolean
}
