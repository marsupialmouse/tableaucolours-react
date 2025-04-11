import {Colour} from 'src/types/Colour'
import {
  ColourPaletteType,
  ColourPaletteTypes,
} from 'src/types/ColourPaletteTypes'
import classes from './ColourPalettePreview.module.less'
import {default as TestIds} from './ColourPalettePreviewTestIds'

export interface ColourPalettePreviewProps {
  type: ColourPaletteType
  colours: Colour[]
}

export default function ColourPalettePreview({
  type,
  colours,
}: ColourPalettePreviewProps) {
  function getBackgroundStyle() {
    switch (type) {
      case ColourPaletteTypes.regular:
        return regular()

      case ColourPaletteTypes.diverging:
      case ColourPaletteTypes.sequential:
        return ordered()

      default:
        return {}
    }
  }

  function regular() {
    const width = 100 / colours.length
    let position = 0
    return {
      background: `linear-gradient(to right, ${colours
        .map((c) => c.hex)
        .map((x) => `${x} ${position}%, ${x} ${(position += width)}%`)
        .join(', ')})`,
    }
  }

  function ordered() {
    return {
      background: `linear-gradient(to right, ${colours.map((c) => c.hex).join(', ')})`,
    }
  }

  return (
    <div
      className={classes.palettepreview}
      style={getBackgroundStyle()}
      data-testid={TestIds.Self}
    >
      &nbsp;
    </div>
  )
}
