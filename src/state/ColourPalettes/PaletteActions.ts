import {Colour} from './PaletteReducer'
import {PaletteType} from './PaletteTypes'

export enum PaletteActionTypes {
  AddColour = 'AddColour',
  SelectColour = 'SelectColour',
  ChangeColour = 'ChangeColour',
  MoveColour = 'MoveColour',
  RemoveColour = 'RemoveColour',
  ReplaceColours = 'ReplaceColours',
  ReplacePalette = 'ReplacePalette',
}

export type AddColourAction = {
  type: PaletteActionTypes.AddColour
  payload?: string
}

export type SelectColourAction = {
  type: PaletteActionTypes.SelectColour
  payload: Colour
}

export type ChangeColourAction = {
  type: PaletteActionTypes.ChangeColour
  payload: {colour: Colour; hex: string}
}

export type MoveColourAction = {
  type: PaletteActionTypes.MoveColour
  payload: {colour: Colour; newIndex: number}
}

export type RemoveColourAction = {
  type: PaletteActionTypes.RemoveColour
  payload: Colour
}

export type ReplaceColoursAction = {
  type: PaletteActionTypes.ReplaceColours
  payload?: string[]
}

export type ReplacePaletteAction = {
  type: PaletteActionTypes.ReplacePalette
  payload?: {name?: string; type?: PaletteType; colours?: string[]}
}

export type PaletteActions =
  | AddColourAction
  | SelectColourAction
  | ChangeColourAction
  | MoveColourAction
  | RemoveColourAction
  | ReplaceColoursAction
  | ReplacePaletteAction
