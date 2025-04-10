export interface ParsedPalette {
  name: string
  type: string
  colours: string[]
}

export interface TpsFileError {
  message: string
  paletteName?: string
}
export interface InvalidTpsFileResult {
  isValid: false
  errors: TpsFileError[]
}

export interface ValidTpsFileResult {
  isValid: true
  palettes: ParsedPalette[]
}

export interface InvalidPaletteResult {
  isValid: false
  error: string
  paletteName?: string
}

export interface ValidPaletteResult {
  isValid: true
  palette: ParsedPalette
}

const xmlParser = new DOMParser()
const colourPattern = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?(?:[0-9a-f]{5})?$/i

function parseTpsFile(xml: string): ValidTpsFileResult | InvalidTpsFileResult {
  if (!xml) {
    return invalidFile('')
  }

  const doc = xmlParser.parseFromString(xml, 'application/xml')
  const root = doc.documentElement

  if (doc.querySelector('parsererror')) {
    return invalidFile('Unable to parse XML')
  }

  if (root.tagName !== 'workbook') {
    return invalidFile(
      `Expected a root element of <workbook>, found <${root.tagName}>`
    )
  }

  const preferences = [...root.children].find(
    (x) => x.tagName === 'preferences'
  )

  if (!preferences) {
    return invalidFile('Expected a <preferences> element inside <workbook>')
  }

  const parsedPalettes = [...preferences.children]
    .filter((x) => x.tagName === 'color-palette')
    .map((x) => parsePaletteElement(x))

  const paletteErrors = parsedPalettes
    .filter((x) => !x.isValid)
    .map((x) => ({message: x.error, paletteName: x.paletteName}))

  if (paletteErrors.length) {
    return invalidFile(paletteErrors)
  }

  return {
    isValid: true,
    palettes: parsedPalettes.filter((x) => x.isValid).map((x) => x.palette),
    //xml: xml,
  }
}

function invalidFile(messages: string | TpsFileError[]): InvalidTpsFileResult {
  return {
    isValid: false,
    errors:
      typeof messages === 'string'
        ? [{message: messages, paletteName: ''}]
        : messages,
  }
}

function parseColourPalette(xml: string) {
  if (!xml) {
    return invalidPalette('')
  }

  const doc = xmlParser.parseFromString(xml, 'application/xml')
  const root = doc.documentElement

  if (doc.querySelector('parsererror')) {
    return invalidPalette('Unable to parse XML')
  }

  return parsePaletteElement(root, true)
}

function parsePaletteElement(
  element: Element,
  requireColour?: boolean
): ValidPaletteResult | InvalidPaletteResult {
  if (element.tagName !== 'color-palette') {
    return invalidPalette('Expected a root element of <color-palette>')
  }

  const colours = [...element.children]
    .filter((x) => x.tagName === 'color')
    .map((x) => x.innerHTML.trim())

  if (requireColour && !colours.length) {
    return invalidPalette('Expected one or more <color> elements', element)
  }

  if (colours.filter((x) => !x).length > 0) {
    return invalidPalette(
      'All <color> elements must contain a valid colour',
      element
    )
  }

  const invalidColour = colours.find((x) => !colourPattern.test(x))

  if (invalidColour) {
    return invalidPalette(`'${invalidColour}' is not a valid colour`, element)
  }

  const type = element.getAttribute('type') ?? ''

  return {
    isValid: true,
    palette: {
      name: element.getAttribute('name') ?? '',
      type: type,
      colours: colours,
    },
  }
}

function invalidPalette(
  message: string,
  element?: Element
): InvalidPaletteResult {
  return {
    isValid: false,
    error: message,
    paletteName: element ? (element.getAttribute('name') ?? '') : '',
  }
}

export {parseTpsFile, parseColourPalette}
