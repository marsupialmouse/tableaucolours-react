import {default as TestIds} from './ImageZoomTestIds'
import classes from './ImageZoom.module.less'
import clsx from 'clsx'
import {memo} from 'react'

export interface ImageZoomProps {
  scale: number
  range: {min: number; max: number}
  enabled: boolean
  onScaleChanged?: (scale: number) => void
}

const ImageZoom = memo(function ImageZoom({scale, range, enabled, onScaleChanged}: ImageZoomProps) {
  const percentage = Math.round(100 * scale)
  const sliderValue = Math.round(
    scale < 1
      ? ((scale - range.min) * 49) / (1 - range.min) + 1
      : ((scale - 1) * 50) / (range.max - 1) + 50
  )

  function handleZoomChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const newValue = parseInt(event.target.value, 10)
    const newScale =
      newValue < 50
        ? ((newValue - 1) * (1 - range.min)) / 49 + range.min
        : ((newValue - 50) * (range.max - 1)) / 50 + 1

    onScaleChanged?.(newScale)
  }

  function handleZoomIn(event: React.MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()

    onScaleChanged?.(scale * 1.1)
  }

  function handleZoomOut(event: React.MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()

    onScaleChanged?.(scale * 0.9)
  }

  return (
    <div className={classes.imagezoom} data-testid={TestIds.Self}>
      <button
        className={clsx('iconbutton', classes['imagezoom-out'], 'fas', 'fa-image')}
        title="Zoom out (Shift + Scroll-down)"
        disabled={!enabled}
        onClick={handleZoomOut}
        data-testid={TestIds.ZoomOut}
      ></button>
      <input
        type="range"
        min="1"
        max="100"
        value={sliderValue}
        disabled={!enabled}
        className={classes['imagezoom-slider']}
        onChange={handleZoomChange}
        data-testid={TestIds.Slider}
      />
      <button
        className={clsx('iconbutton', classes['imagezoom-in'], 'fas', 'fa-image')}
        title="Zoom in (Shift + Scroll-up)"
        disabled={!enabled}
        onClick={handleZoomIn}
        data-testid={TestIds.ZoomIn}
      ></button>
      <div className={classes['imagezoom-percentage']} data-testid={TestIds.Percentage}>
        {percentage}%
      </div>
    </div>
  )
})

export default ImageZoom
