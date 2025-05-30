import {useAppDispatch} from 'src/stores/hooks'
import ColourPaletteTypeSelector from '../ColourPaletteTypeSelector/ColourPaletteTypeSelector'
import {useSelector} from 'react-redux'
import {paletteTypeChanged, selectColourPaletteType} from 'src/stores/colourPaletteSlice'
import {ColourPaletteType as PaletteType} from 'src/types/ColourPaletteTypes'
import {memo} from 'react'

export interface ColourPaletteTypeProps {
  tabIndex?: number
}

const ColourPaletteType = memo(function ColourPaletteType({tabIndex}: ColourPaletteTypeProps) {
  const dispatch = useAppDispatch()
  const paletteType = useSelector(selectColourPaletteType)

  function handleTypeChange(type: PaletteType) {
    dispatch(paletteTypeChanged({type: type.id}))
  }

  return (
    <ColourPaletteTypeSelector
      selectedType={paletteType}
      tabIndex={tabIndex}
      onTypeSelected={handleTypeChange}
    />
  )
})

export default ColourPaletteType
