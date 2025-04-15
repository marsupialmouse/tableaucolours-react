import {default as TestIds} from './ImageColourPickerImageTestIds'
import classes from './ImageColourPickerImage.module.less'
import {useCallback, useEffect, useRef, useState} from 'react'
import clsx from 'clsx'

export interface ImageColourPickerImageProps {
  image: HTMLImageElement
  scale: number
  canPickColour: boolean
  colourPicked?: (colour: string) => void
}

const defaultMousePosition = {x: 0, y: 0}

export default function ImageColourPickerImage({
  image,
  scale,
  canPickColour,
  colourPicked,
}: ImageColourPickerImageProps) {
  const canvas = useRef<HTMLCanvasElement | null>(null)

  const [mousePosition, setMousePosition] = useState(defaultMousePosition)
  const [mouseColour, setMouseColour] = useState('')

  const resetMousePositionAndColour = useCallback(() => {
    setMousePosition(defaultMousePosition)
    setMouseColour('')
  }, [])

  useEffect(() => {
    resetMousePositionAndColour()
    // This check is to stop tests from breaking: real code should wait for the image to load before setting it as a prop
    if (!image.complete) return
    const drawingContext = canvas.current?.getContext('2d')
    if (!canvas.current || !drawingContext) return
    drawingContext.scale(scale, scale)
    drawingContext.drawImage(image, 0, 0)
    canvas.current.width = image.width * scale
    canvas.current.height = image.height * scale
  }, [canvas, image, scale, resetMousePositionAndColour])

  function handleClick(event: React.MouseEvent) {
    if (!canPickColour) return

    const colour = getCurrentMouseColour(event)

    if (colour) colourPicked?.(colour)
  }

  function setMousePositionAndColour(event: React.MouseEvent): void {
    setMousePosition({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
    setMouseColour(getCurrentMouseColour(event))
  }

  function getCurrentMouseColour(event: React.MouseEvent) {
    const colour = canvas.current
      ?.getContext('2d')
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
