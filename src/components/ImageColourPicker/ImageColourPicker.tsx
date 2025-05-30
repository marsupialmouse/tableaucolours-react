import {useDispatch, useSelector} from 'react-redux'
import ImageColourPickerImageCanvas from '../ImageColourPickerImageCanvas/ImageColourPickerImageCanvas'
import ImageFileOpen from '../ImageFileOpen/ImageFileOpen'
import ImageZoom from '../ImageZoom/ImageZoom'
import {
  imageScaleChanged,
  imageScaleRange,
  imageSelected,
  selectImageScale,
  selectImageSrc,
} from 'src/stores/imageSlice'
import {
  colourChanged,
  selectCanPickColour,
  selectSelectedColour,
} from 'src/stores/colourPaletteSlice'
import {memo, useCallback, useEffect, useRef, useState} from 'react'
import classes from './ImageColourPicker.module.less'
import {default as TestIds} from './ImageColourPickerTestIds'

const ImageColourPicker = memo(function ImageColourPicker() {
  const [image, setImage] = useState<HTMLImageElement>(new Image())
  const imageSrc = useSelector(selectImageSrc)
  const imageScale = useSelector(selectImageScale)
  const canPickColour = useSelector(selectCanPickColour)
  const selectedColour = useSelector(selectSelectedColour)
  const hasImage = image.width > 0 && image.height > 0
  const canvas = useRef<HTMLDivElement | null>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!imageSrc) return
    let cancelled = false
    const tempImage = new Image()
    tempImage.onload = () => {
      if (!cancelled) setImage(tempImage)
    }
    tempImage.src = imageSrc
    return () => {
      cancelled = true
    }
  }, [imageSrc])

  const displayFirstImage = useCallback(
    (files: File[]) => {
      const file = files.find((i) => i.type.includes('image/'))

      if (!file) {
        console.log('File list did not contain image')
        return
      }

      const reader = new FileReader()
      reader.onload = function () {
        const tempImage = new Image()
        tempImage.onload = function () {
          let scale = 1
          const canvasWidth = canvas.current?.clientWidth ?? 0
          const canvasHeight = canvas.current?.clientHeight ?? 0

          if (canvasWidth < tempImage.width || canvasHeight < tempImage.height) {
            const xRatio = canvasWidth / tempImage.width
            const yRatio = canvasHeight / tempImage.height

            scale = Math.floor(Math.min(xRatio, yRatio) * 100) / 100.0
          }

          dispatch(imageSelected({imageSrc: tempImage.src, scale}))
        }
        if (reader.result && typeof reader.result === 'string') tempImage.src = reader.result
      }
      reader.readAsDataURL(file)
    },
    [canvas, dispatch]
  )

  useEffect(() => {
    function handlePaste(event: ClipboardEvent) {
      if (
        !event.clipboardData?.items ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      const files = [...event.clipboardData.items]
        .map((i) => i.getAsFile())
        .filter((i) => i !== null)

      displayFirstImage(files)
    }

    window.addEventListener('paste', handlePaste, false)

    return () => {
      window.removeEventListener('paste', handlePaste)
    }
  }, [displayFirstImage])

  function handleScaleChanged(scale: number): void {
    dispatch(imageScaleChanged({scale}))
  }

  function handleColourPicked(colour: string): void {
    if (selectedColour) dispatch(colourChanged({colour: selectedColour, hex: colour}))
  }

  return (
    <div className={classes.imagecolourpicker} data-testid={TestIds.Self}>
      <div className={classes['imagecolourpicker-toolbar']}>
        <ul className={classes.controls}>
          <li className={classes.zoomImage}>
            <ImageZoom
              scale={imageScale}
              range={imageScaleRange}
              enabled={hasImage}
              onScaleChanged={handleScaleChanged}
            />
          </li>
          <li className={classes.selectFile}>
            <ImageFileOpen onFileSelected={displayFirstImage} />
          </li>
        </ul>
      </div>
      <div ref={canvas} className={classes['imagecolourpicker-canvas']}>
        <ImageColourPickerImageCanvas
          image={image}
          scale={imageScale}
          canPickColour={canPickColour}
          onColourPicked={handleColourPicked}
          onFileDropped={displayFirstImage}
          onScaleChanged={handleScaleChanged}
        />
      </div>
    </div>
  )
})

export default ImageColourPicker
