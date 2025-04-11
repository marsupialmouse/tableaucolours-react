import {Colour} from 'src/types/Colour'
import {ColourPaletteType} from 'src/types/ColourPaletteTypes'
import he from 'he'

export interface TpsColourPalette {
  name: string
  type: ColourPaletteType | string
  colours: Array<Colour> | Array<string>
}

const xmlParser = new DOMParser()
const xmlSerializer = new XMLSerializer()

function replacePalettesInTpsXml(
  xml: string,
  palettes: Array<TpsColourPalette>
) {
  const doc = xmlParser.parseFromString(xml, 'application/xml')
  const preferences = doc.getElementsByTagName('preferences')[0]
  const paletteElements = [...preferences.getElementsByTagName('color-palette')]

  paletteElements.forEach((e) => e.remove())

  const paletteXml = palettes.map((x) => colourPaletteXml(x)).join('\n')

  preferences.innerHTML =
    preferences.innerHTML.trim() + '\n' + paletteXml + '\n'

  return xmlSerializer.serializeToString(doc)
}

function colourPaletteXml({name, type, colours}: TpsColourPalette) {
  let x = `<color-palette name="${he.encode(name, {
    useNamedReferences: true,
  })}" type="${type instanceof ColourPaletteType ? type.id : type}">\n`

  colours.forEach(
    (c) => (x += `    <color>${typeof c == 'string' ? c : c.hex}</color>\n`)
  )

  return x + '</color-palette>'
}

export {colourPaletteXml, replacePalettesInTpsXml}
