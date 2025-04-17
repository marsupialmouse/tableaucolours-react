import {useEffect, useRef} from 'react'
import classes from './ImageFileOpen.module.less'
import {default as TestIds} from './ImageFileOpenTestIds'
import clsx from 'clsx'
import {eventBus} from 'src/utils/EventBus'

export interface ImageFileOpenProps {
  onFileSelected?: (files: FileList) => void
}

export default function ImageFileOpen({onFileSelected}: ImageFileOpenProps) {
  const label = useRef<HTMLLabelElement | null>(null)

  useEffect(() => {
    const openFile = () => label.current?.click()

    eventBus.on('openImageFile', openFile)

    return () => {
      eventBus.off('openImageFile', openFile)
    }
  }, [label])

  function handleClick(event: React.MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()

    label.current?.click()
  }

  function handleFileChanged(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.files?.length) onFileSelected?.(event.target.files)
  }

  return (
    <div className={classes.imagefileopen} data-testid={TestIds.Self}>
      <label ref={label} htmlFor="selectImage">
        <input
          id="selectImage"
          type="file"
          accept="image/*"
          style={{display: 'none'}}
          onChange={handleFileChanged}
          data-testid={TestIds.File}
        />
        <button
          className={clsx(classes['imagefileopen--button'], 'iconbutton', 'fas', 'fa-folder-open')}
          title="Open image..."
          onClick={handleClick}
        ></button>
      </label>
    </div>
  )
}
