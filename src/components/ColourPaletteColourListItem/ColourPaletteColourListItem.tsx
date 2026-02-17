import {memo, useState, useCallback} from 'react'
import ColourPicker from '../ColourPicker/ColourPicker'
import classes from './ColourPaletteColourListItem.module.less'
import {default as TestIds} from './ColourPaletteColourListItemTestIds'
import {clsx} from 'clsx'
import {Colour, colourChanged, colourRemoved, colourSelected} from 'src/stores/colourPaletteSlice'
import {useDispatch} from 'react-redux'
import {useDragDrop} from '../ColourPaletteColourList/DragDropContext'

export interface ColourPaletteColourListItemProps {
  colour: Colour
  canRemove: boolean
  index?: number
  displayIndex?: number
  isDragging?: boolean
  onDragEnd?: () => void
}

const ColourPaletteColourListItem = memo(function ColourPaletteColourListItem({
  colour,
  canRemove,
  index = 0,
  displayIndex,
  isDragging = false,
  onDragEnd,
}: ColourPaletteColourListItemProps) {
  const dispatch = useDispatch()
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false)
  const {startDrag, updateDropTarget} = useDragDrop()

  // Use displayIndex for visual position, fall back to index
  const visualIndex = displayIndex ?? index
  const column = Math.floor(visualIndex / 5) + 1
  const row = (visualIndex % 5) + 1
  const classNames = clsx(
    classes.colour,
    colour.isSelected && classes['colour--selected'],
    isPickerOpen && classes['colour--pickeropen'],
    isDragging && classes['colour--dragging']
  )

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', String(colour.id))
      startDrag(colour.id)
    },
    [colour.id, startDrag]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      updateDropTarget(index)
    },
    [index, updateDropTarget]
  )

  const handleDragEnd = useCallback(() => {
    onDragEnd?.()
  }, [onDragEnd])

  return (
    <li
      className={classNames}
      title={colour.hex + ' (double click to edit)'}
      style={{gridColumn: column, gridRow: row}}
      onClick={() => dispatch(colourSelected({colour}))}
      draggable={!isPickerOpen}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      data-testid={TestIds.Self}
    >
      <div
        className={classes['colour-swatch']}
        style={{backgroundColor: colour.hex}}
        onDoubleClick={() => {
          setIsPickerOpen(true)
        }}
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
            onChange={(hex) => {
              dispatch(colourChanged({colour, hex}))
            }}
            onDone={() => {
              setIsPickerOpen(false)
            }}
          />
        </div>
      )}
    </li>
  )
})

export default ColourPaletteColourListItem
