import {PaletteType} from 'src/state/ColourPalettes/PaletteTypes'
import classes from './ColourPaletteTypeSelectorItem.module.less'
import {default as TestIds} from './ColourPaletteTypeSelectorItemTestIds'

export interface ColourPaletteTypeSelectorItemProps {
  type: PaletteType
}

export default function ColourPaletteTypeSelectorItem({
  type,
}: ColourPaletteTypeSelectorItemProps) {
  return (
    <div className="palettetype" data-testid={TestIds.Self}>
      <div
        className={classes['palettetype-example--' + type.id]}
        data-testid={TestIds.Example}
      >
        &nbsp;
      </div>
      <label className="palettetype-label" data-testid={TestIds.Name}>
        {type.name}
      </label>
    </div>
  )
}
