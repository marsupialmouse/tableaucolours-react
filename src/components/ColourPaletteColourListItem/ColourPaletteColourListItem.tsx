import {useState} from 'react'
import ColourPicker from '../ColourPicker/ColourPicker'
import classes from './ColourPaletteColourListItem.module.less'
import {default as TestIds} from './ColourPaletteColourListItemTestIds'
import {clsx} from 'clsx'
import {Colour} from 'src/state/ColourPalettes/PaletteReducer'

export interface ColourPaletteColourListItemProps {
  colour: Colour
  index?: number
  isDragging?: boolean
  onSelect?: (colour: Colour) => void
  onRemove?: (colour: Colour) => void
  onChange?: (colour: Colour, hex: string) => void
}

export default function ColourPaletteColourListItem({
  colour,
  index = 0,
  isDragging = false,
  onSelect,
  onChange,
  onRemove,
}: ColourPaletteColourListItemProps) {
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
      key={colour.id}
      className={classNames}
      title={colour.hex + ' (double click to edit)'}
      style={{gridColumn: column, gridRow: row}}
      onClick={() => onSelect?.(colour)}
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
          onRemove?.(colour)
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
            onChange={(hex) => onChange?.(colour, hex)}
            onDone={() => setIsPickerOpen(false)}
          />
        </div>
      )}
    </li>
  )
}
