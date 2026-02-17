import {memo} from 'react'
import classes from './ColourPaletteColourList.module.less'

interface DropIndicatorProps {
  index: number
}

export const DropIndicator = memo(function DropIndicator({index}: DropIndicatorProps) {
  const column = Math.floor(index / 5) + 1
  const row = (index % 5) + 1

  return (
    <li
      className={classes.dropIndicator}
      style={{gridColumn: column, gridRow: row}}
      data-testid="DropIndicator"
      role="presentation"
    />
  )
})
