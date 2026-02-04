import {default as TestIds} from './ImageColourPickerImageTestIds'
import classes from './ImageColourPickerImage.module.less'
import {useEffect, useRef, useState} from 'react'
import clsx from 'clsx'

export interface ImageColourPickerImageProps {
  image: HTMLImageElement
  scale: number
  canPickColour: boolean
  onColourPicked?: (colour: string) => void
}

const defaultMousePosition = {x: 0, y: 0}

export default function ImageColourPickerImage({
  image,
  scale,
  canPickColour,
  onColourPicked,
}: ImageColourPickerImageProps) {
  const canvas = useRef<HTMLCanvasElement | null>(null)

  const [previousImage, setPreviousImage] = useState(image)
  const [previousScale, setPreviousScale] = useState(scale)
  const [mousePosition, setMousePosition] = useState(defaultMousePosition)
  const [mouseColour, setMouseColour] = useState('')

  useEffect(() => {
    const drawingContext = canvas.current?.getContext('2d', {willReadFrequently: true})
    if (!canvas.current || !drawingContext) return
    canvas.current.width = image.width * scale
    canvas.current.height = image.height * scale
    drawingContext.scale(scale, scale)
    drawingContext.drawImage(image, 0, 0)
  }, [canvas, image, scale])

  if (image !== previousImage || scale !== previousScale) {
    setPreviousImage(image)
    setPreviousScale(scale)
    resetMousePositionAndColour()
  }

  function handleClick(event: React.MouseEvent) {
    if (!canPickColour) return

    const colour = getCurrentMouseColour(event)

    if (colour) onColourPicked?.(colour)
  }

  function resetMousePositionAndColour(): void {
    setMousePosition(defaultMousePosition)
    setMouseColour('')
  }

  function setMousePositionAndColour(event: React.MouseEvent): void {
    setMousePosition({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
    setMouseColour(getCurrentMouseColour(event))
  }

  function getCurrentMouseColour(event: React.MouseEvent) {
    const colour = canvas.current
      ?.getContext('2d', {willReadFrequently: true})
      ?.getImageData(event.nativeEvent.offsetX, event.nativeEvent.offsetY, 1, 1).data

    if (!colour || colour[3] === 0) return ''

    return '#' + toHex(colour[0]) + toHex(colour[1]) + toHex(colour[2])
  }

  function toHex(v: number) {
    const s = v.toString(16).toUpperCase()
    return s.length === 1 ? '0' + s : s
  }

  return (
    <div className={classes.scalableimage} data-testid={TestIds.Self}>
      <div className={classes['scalableimage-hackyverticalspacer']}>&nbsp;</div>
      <div
        className={clsx(
          classes['scalableimage-image'],
          canPickColour && classes['scalableimage-image--active']
        )}
        data-testid={TestIds.Container}
      >
        {canPickColour && mouseColour && (
          <div
            className={classes['scalableimage-swatch']}
            style={{
              backgroundColor: mouseColour,
              top: (mousePosition.y - 40).toString() + 'px',
              left: (mousePosition.x + 10).toString() + 'px',
            }}
            data-testid={TestIds.Swatch}
          >
            &nbsp;
          </div>
        )}
        <canvas
          ref={canvas}
          onClick={handleClick}
          onMouseOver={setMousePositionAndColour}
          onMouseMove={setMousePositionAndColour}
          onMouseLeave={resetMousePositionAndColour}
          data-testid={TestIds.Canvas}
        ></canvas>
      </div>
    </div>
  )
}
