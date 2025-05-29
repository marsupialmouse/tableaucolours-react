import {ColourPaletteTypes} from 'src/types/ColourPaletteTypes'
import classes from './ColourPalettePreview.module.less'
import {default as TestIds} from './ColourPalettePreviewTestIds'
import {selectColourPaletteColours, selectColourPaletteType} from 'src/stores/colourPaletteSlice'
import {useSelector} from 'react-redux'

export default function ColourPalettePreview() {
  const colours = useSelector(selectColourPaletteColours)
  const type = useSelector(selectColourPaletteType)

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
        .map((x) => `${x} ${position.toString()}%, ${x} ${(position += width).toString()}%`)
        .join(', ')})`,
    }
  }

  function ordered() {
    return {
      background: `linear-gradient(to right, ${colours.map((c) => c.hex).join(', ')})`,
    }
  }

  return (
    <div className={classes.palettepreview} style={getBackgroundStyle()} data-testid={TestIds.Self}>
      &nbsp;
    </div>
  )
}
