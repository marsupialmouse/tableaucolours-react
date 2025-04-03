import {useState} from 'react'
import ColourPicker from '../ColourPicker/ColourPicker'
import classes from './ColourPaletteColourListItem.module.less'
import {default as TestIds} from './ColourPaletteColourListItemTestIds'
import {clsx} from 'clsx'
import {Colour} from 'src/state/ColourPalettes/PaletteReducer'
import {usePaletteContext} from 'src/state/ColourPalettes/PaletteContext'
import {PaletteActionTypes} from 'src/state/ColourPalettes/PaletteActions'

export interface ColourPaletteColourListItemProps {
  colour: Colour
  index?: number
  isDragging?: boolean
}

export default function ColourPaletteColourListItem({
  colour,
  index = 0,
  isDragging = false,
}: ColourPaletteColourListItemProps) {
  const {dispatch} = usePaletteContext()
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
      onClick={() =>
        dispatch({type: PaletteActionTypes.SelectColour, payload: colour})
      }
      data-testid={TestIds.Self}
    >
      <div
        className={classes['colour-swatch']}
        style={{backgroundColor: colour.hex}}
        onDoubleClick={() => setIsPickerOpen(true)}
        data-testid={TestIds.Swatch}
      ></div>
      <div
        className={classes['colour-remove']}
        title="Delete colour"
        data-testid={TestIds.Remove}
        onClick={(e) => {
          dispatch({type: PaletteActionTypes.RemoveColour, payload: colour})
          e.stopPropagation()
          e.stopPropagation()
        }}
      >
        <span className="fas fa-times"></span>
      </div>
      {isPickerOpen && (
        <div
          className={classes['colour-picker']}
          data-testid={TestIds.ColourPicker}
        >
          <ColourPicker
            hex={colour.hex}
            onChange={(hex) =>
              dispatch({
                type: PaletteActionTypes.ChangeColour,
                payload: {colour, hex},
              })
            }
            onDone={() => setIsPickerOpen(false)}
          />
        </div>
      )}
    </li>
  )
}
