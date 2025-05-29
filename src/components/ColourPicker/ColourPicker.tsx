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
      tabIndex={300}
    >
      <Sketch
        color={hex}
        disableAlpha={true}
        presetColors={[]}
        width={200}
        onChange={(colour) => onChange?.(colour.hex)}
        data-testid={TestIds.Picker}
        style={{border: 0, borderRadius: 0, boxShadow: 'none'}}
      />
      <div className={classes['colourpicker-buttons']}>
        <button
          className={classes['colourpicker-done']}
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
