export class ColourPaletteType {
  readonly id: string
  readonly name: string

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }
}

/* eslint '@typescript-eslint/no-extraneous-class': 'off' */
export class ColourPaletteTypes {
  static #types: Record<string, ColourPaletteType> = {}

  static #add(id: string, name: string) {
    const type = new ColourPaletteType(id, name)
    ColourPaletteTypes.#types[id] = type
    return type
  }

  static regular = ColourPaletteTypes.#add('regular', 'Regular')
  static sequential = ColourPaletteTypes.#add('ordered-sequential', 'Sequential')
  static diverging = ColourPaletteTypes.#add('ordered-diverging', 'Diverging')

  static find(id: string | undefined): ColourPaletteType | undefined {
    return id == undefined ? undefined : ColourPaletteTypes.#types[id]
  }

  static get(id: string): ColourPaletteType {
    return ColourPaletteTypes.#types[id]
  }
}
