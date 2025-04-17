import ImageColourPickerImage from '../ImageColourPickerImage/ImageColourPickerImage'
import {default as TestIds} from './ImageColourPickerImageCanvasTestIds'
import classes from './ImageColourPickerImageCanvas.module.less'
import {useEffect, useRef, useState} from 'react'
import clsx from 'clsx'

export interface ImageColourPickerImageCanvasProps {
  canPickColour: boolean
  image?: HTMLImageElement
  scale: number
  onColourPicked?: (colour: string) => void
  onFileDropped?: (files: FileList) => void
  onScaleChanged?: (scale: number) => void
}
export default function ImageColourPickerImageCanvas({
  image,
  scale,
  canPickColour,
  onColourPicked,
  onFileDropped,
  onScaleChanged,
}: ImageColourPickerImageCanvasProps) {
  const hasImage = image?.width && image.height
  const hintType = getHintType()
  const hasHint = !!hintType
  const [isDragActive, setIsDragActive] = useState(false)
  const dropTarget = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function cancel(e: Event) {
      e.preventDefault()
      e.stopPropagation()
    }

    window.addEventListener('dragover', cancel, false)
    window.addEventListener('drop', cancel, false)

    return () => {
      window.removeEventListener('dragover', cancel)
      window.removeEventListener('drop', cancel)
    }
  })

  function getHintType() {
    if (!hasImage) return 'image'
    if (!canPickColour) return 'colour'
    return ''
  }

  function handleOpenFile(event: React.MouseEvent): void {
    event.stopPropagation()
    // TODO:
    throw new Error('Function not implemented.')
  }

  function handleDragEnter(event: React.DragEvent): void {
    event.preventDefault()

    if ([...event.dataTransfer.items].find((x) => x.kind === 'file' && x.type.includes('image/'))) {
      setIsDragActive(true)
      event.dataTransfer.dropEffect = 'copy'
    }
  }

  function handleDragLeave(event: React.DragEvent): void {
    event.preventDefault()

    // When dragging starts, the drop target is shown and it has a higher z index than everything else
    if (event.target === dropTarget.current) setIsDragActive(false)
  }

  function handleDrop(event: React.DragEvent): void {
    event.preventDefault()
    event.stopPropagation()

    setIsDragActive(false)

    if (event.dataTransfer.files.length) onFileDropped?.(event.dataTransfer.files)
  }

  function handleWheel(event: React.WheelEvent): void {
    if (!event.deltaY || !event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return

    event.preventDefault()
    event.stopPropagation()

    onScaleChanged?.(scale * (event.deltaY > 0 ? 0.9 : 1.1))
  }

  return (
    <div
      className={clsx(classes.imagecanvas, isDragActive && classes['imagecanvas--drop'])}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragEnter}
      onDrop={handleDrop}
      data-testid={TestIds.Self}
    >
      <div
        className={classes['imagecanvas-canvas']}
        onWheel={handleWheel}
        data-testid={TestIds.Image}
      >
        {hasImage && (
          <ImageColourPickerImage
            image={image}
            scale={scale}
            canPickColour={canPickColour}
            onColourPicked={onColourPicked}
          />
        )}
      </div>
      {hasHint && (
        <div className={classes.canvashint} data-testid={TestIds.Hint}>
          <div className={classes['canvashint-container']}>
            {hintType === 'image' && (
              <div className={classes['canvashint-text']}>
                <a href="#" onClick={handleOpenFile}>
                  Open
                </a>
                , paste or drop an image to get started
              </div>
            )}
            {hintType === 'colour' && (
              <div className={classes['canvashint-text']}>
                Select a colour in the palette to pick colours from the image
              </div>
            )}
          </div>
        </div>
      )}
      <div className={classes.droptarget} ref={dropTarget} data-testid={TestIds.DropTarget}>
        <div className={classes['droptarget-textwrapper']}>
          <div className={classes['droptarget-text']}>
            <span className={clsx(classes['droptarget-icon'], 'fas', 'fa-hand-point-down')}></span>
            <br />
            Drop image here
          </div>
        </div>
      </div>
    </div>
  )
}
