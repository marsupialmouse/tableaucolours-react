import {useSelector} from 'react-redux'
import {paletteNameChanged, selectColourPaletteName} from 'src/stores/colourPaletteSlice'
import {useAppDispatch} from 'src/stores/hooks'
import classes from './ColourPaletteName.module.less'
import {memo} from 'react'

export interface ColourPaletteNameProps {
  tabIndex?: number
}

const ColourPaletteName = memo(function ColourPaletteName({tabIndex}: ColourPaletteNameProps) {
  const dispatch = useAppDispatch()
  const paletteName = useSelector(selectColourPaletteName)

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch(paletteNameChanged({name: event.target.value}))
  }

  return (
    <>
      <input
        id="name"
        type="text"
        value={paletteName}
        onChange={handleNameChange}
        tabIndex={tabIndex}
        placeholder="Enter a palette name"
        autoComplete="off"
        className={classes.colourpalettename}
      />
    </>
  )
})

export default ColourPaletteName
