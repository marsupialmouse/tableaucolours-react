export class PaletteType {
  readonly id: string
  readonly name: string

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }
}

export class PaletteTypes {
  static #types: Record<string, PaletteType> = {}

  static #add(id: string, name: string) {
    const type = new PaletteType(id, name)
    PaletteTypes.#types[id] = type
    return type
  }

  static regular = PaletteTypes.#add('regular', 'Regular')
  static sequential = PaletteTypes.#add('ordered-sequential', 'Sequential')
  static diverging = PaletteTypes.#add('ordered-diverging', 'Diverging')

  static get(id: string): PaletteType {
    return PaletteTypes.#types[id]
  }
}
