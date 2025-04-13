import {useEffect} from 'react'
import {Sketch} from '@uiw/react-color'
import classes from './ColourPicker.module.less'
import {default as TestIds} from './ColourPickerTestIds'

export interface ColourPickerProps {
  hex: string
  onChange?: (hex: string) => void
  onDone?: () => void
}

export default function ColourPicker({hex, onChange, onDone}: ColourPickerProps) {
  useEffect(() => {
    if (onDone) {
      window.addEventListener('click', onDone, false)
      return () => {
        window.removeEventListener('click', onDone)
      }
    }
  }, [onDone])

  return (
    <div
      className={classes.colourpicker}
      onKeyUp={(e) => {
        if (e.key === 'Enter') onDone?.()
      }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      data-testid={TestIds.Self}
    >
      <Sketch
        color={hex}
        disableAlpha={true}
        presetColors={[]}
        onChange={(colour) => onChange?.(colour.hex)}
        data-testid={TestIds.Picker}
      />
      <div className={classes.colourpickerButtons}>
        <button
          className={classes.colourpickerDone}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDone?.()
          }}
          data-testid={TestIds.Done}
        >
          Done
        </button>
      </div>
    </div>
  )
}
