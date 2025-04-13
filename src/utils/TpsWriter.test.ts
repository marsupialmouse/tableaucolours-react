import {ColourPaletteTypes} from 'src/types/ColourPaletteTypes'
import {describe, expect, it} from 'vitest'
import {colourPaletteXml, replacePalettesInTpsXml} from './TpsWriter'

describe('Generates TPS XML colour palette', () => {
  it('including name, type and colours', () => {
    const name = 'Midweek Mayhem'
    const type = ColourPaletteTypes.sequential
    const colours = ['#ffffff', '#00ff00', '#000000']

    const xml = colourPaletteXml({name, type, colours})

    expect(xml).toBe(`<color-palette name="${name}" type="${type.id}">
    <color>#ffffff</color>
    <color>#00ff00</color>
    <color>#000000</color>
</color-palette>`)
  })

  it('encodes name in XML', () => {
    const xml = colourPaletteXml({
      name: '<xml "name">',
      type: ColourPaletteTypes.regular,
      colours: ['#fff'],
    })

    expect(xml).toBe(`<color-palette name="&lt;xml &quot;name&quot;&gt;" type="regular">
    <color>#fff</color>
</color-palette>`)
  })

  it('includes unkown string type', () => {
    const xml = colourPaletteXml({name: 'X', type: 'what?', colours: ['#fff']})

    expect(xml).toBe(`<color-palette name="X" type="what?">
    <color>#fff</color>
</color-palette>`)
  })

  it('includes hex value of Colour instances', () => {
    const xml = colourPaletteXml({
      name: 'X',
      type: ColourPaletteTypes.regular,
      colours: [{hex: '#aa00bb', id: 1, isSelected: false}],
    })

    expect(xml).toBe(`<color-palette name="X" type="regular">
    <color>#aa00bb</color>
</color-palette>`)
  })
})

describe('Replaces colour palettes in TPS XML', () => {
  it('replaces existing colour paletes', () => {
    const palettes = [
      {name: 'Max', type: ColourPaletteTypes.regular, colours: ['#f0f']},
      {
        name: 'David',
        type: 'tools-out',
        colours: [{hex: '#0f0', isSelected: false, id: 9}],
      },
    ]
    const originalXml = `<?xml version='1.0'?>

<workbook>
	<preferences>
		<color-palette name="Pablo Honey" type="regular">
			<color>#FFFFFF</color>
        </color-palette>
    </preferences>
</workbook>`

    const newXml = replacePalettesInTpsXml(originalXml, palettes)

    expect(newXml).toBe(`<workbook>
	<preferences>
<color-palette name="Max" type="regular">
    <color>#f0f</color>
</color-palette>
<color-palette name="David" type="tools-out">
    <color>#0f0</color>
</color-palette>
</preferences>
</workbook>`)
  })

  it('does not replace other preferences', () => {
    const palettes = [{name: 'Brakes', type: ColourPaletteTypes.regular, colours: ['#f0f']}]
    const originalXml = `<workbook>
	<preferences>
        <brakes>Delta Brakes</brakes>
		<color-palette name="Pablo Honey" type="regular">
			<color>#FFFFFF</color>
        </color-palette>
    </preferences>
</workbook>`

    const newXml = replacePalettesInTpsXml(originalXml, palettes)

    expect(newXml).toBe(`<workbook>
	<preferences><brakes>Delta Brakes</brakes>
<color-palette name="Brakes" type="regular">
    <color>#f0f</color>
</color-palette>
</preferences>
</workbook>`)
  })
})
