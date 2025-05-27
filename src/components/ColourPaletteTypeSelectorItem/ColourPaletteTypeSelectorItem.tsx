import {ColourPaletteType} from 'src/types/ColourPaletteTypes'
import classes from './ColourPaletteTypeSelectorItem.module.less'
import {default as TestIds} from './ColourPaletteTypeSelectorItemTestIds'

export interface ColourPaletteTypeSelectorItemProps {
  type: ColourPaletteType
}

export default function ColourPaletteTypeSelectorItem({type}: ColourPaletteTypeSelectorItemProps) {
  return (
    <div className={classes.palettetype} data-testid={TestIds.Self}>
      <div className={classes['palettetype-example--' + type.id]} data-testid={TestIds.Example}>
        &nbsp;
      </div>
      <label className={classes['palettetype-label']} data-testid={TestIds.Name}>
        {type.name}
      </label>
    </div>
  )
}
