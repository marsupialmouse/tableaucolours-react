import {useState} from 'react'
import ColourPicker from '../ColourPicker/ColourPicker'
import classes from './ColourPaletteColourListItem.module.less'
import {default as TestIds} from './ColourPaletteColourListItemTestIds'
import {clsx} from 'clsx'
import {
  Colour,
  colourChanged,
  colourRemoved,
  colourSelected,
} from 'src/stores/colourpalette/colourPaletteSlice'
import {useDispatch} from 'react-redux'

export interface ColourPaletteColourListItemProps {
  colour: Colour
  canRemove: boolean
  index?: number
  isDragging?: boolean
}

export default function ColourPaletteColourListItem({
  colour,
  canRemove,
  index = 0,
  isDragging = false,
}: ColourPaletteColourListItemProps) {
  const dispatch = useDispatch()
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false)

  const column = Math.floor(index / 5) + 1
  const row = (index % 5) + 1
  const classNames = clsx(
    classes.colour,
    colour.isSelected && classes['colour--selected'],
    isPickerOpen && classes['colour--pickeropen'],
    isDragging && classes['colour--dragging']
  )

  return (
    <li
      className={classNames}
      title={colour.hex + ' (double click to edit)'}
      style={{gridColumn: column, gridRow: row}}
      onClick={() => dispatch(colourSelected({colour}))}
      data-testid={TestIds.Self}
    >
      <div
        className={classes['colour-swatch']}
        style={{backgroundColor: colour.hex}}
        onDoubleClick={() => setIsPickerOpen(true)}
        data-testid={TestIds.Swatch}
      ></div>
      {canRemove && (
        <div
          className={classes['colour-remove']}
          title="Delete colour"
          data-testid={TestIds.Remove}
          onClick={(e) => {
            dispatch(colourRemoved({colour}))
            e.stopPropagation()
            e.stopPropagation()
          }}
        >
          <span className="fas fa-times"></span>
        </div>
      )}
      {isPickerOpen && (
        <div className={classes['colour-picker']} data-testid={TestIds.ColourPicker}>
          <ColourPicker
            hex={colour.hex}
            onChange={(hex) => dispatch(colourChanged({colour, hex}))}
            onDone={() => setIsPickerOpen(false)}
          />
        </div>
      )}
    </li>
  )
}
