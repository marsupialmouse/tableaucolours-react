import {useEffect} from 'react'
import {Sketch} from '@uiw/react-color'
import classes from './ColourPicker.module.less'

export type ColourPickerProps = {
  hex: string
  onChange: (hex: string) => void
  onDone: () => void
}

export default function ColourPicker({
  hex,
  onChange,
  onDone,
}: ColourPickerProps) {
  useEffect(() => {
    window.addEventListener('click', onDone, false)
    return () => window.removeEventListener('click', onDone)
  })

  return (
    <div
      className={classes.colourpicker}
      onKeyUp={(e) => {
        if (e.key === 'Enter') onDone()
      }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <Sketch
        color={hex}
        disableAlpha={true}
        presetColors={[]}
        onChange={(colour) => onChange(colour.hex)}
      />
      <div className={classes.colourpickerButtons}>
        <button
          className={classes.colourpickerDone}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDone()
          }}
        >
          Done
        </button>
      </div>
    </div>
  )
}
