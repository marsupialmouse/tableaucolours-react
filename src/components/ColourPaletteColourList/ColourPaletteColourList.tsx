import classes from './ColourPaletteColourList.module.less'
import ColourPaletteColourListItem from '../ColourPaletteColourListItem/ColourPaletteColourListItem'
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  Colour,
  colourMoved,
  colourRemoved,
  colourSelected,
  selectColourPaletteColours,
} from 'src/stores/colourpalette/colourPaletteSlice'

export default function ColourPaletteColourList() {
  const dispatch = useDispatch()
  const colourPaletteColours = useSelector(selectColourPaletteColours)
  const canRemoveColours = colourPaletteColours.length > 1

  useEffect(() => {
    function keyUp(event: KeyboardEvent) {
      if (
        !canRemoveColours ||
        (event.target as Element).tagName.toLowerCase() !== 'body' ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return
      }
      const selectedColourIndex = getSelectedColourIndex()

      if (selectedColourIndex < 0) return

      const action = event.shiftKey ? moveSelectedColourToIndex : selectByIndex
      switch (event.key) {
        case 'Down':
        case 'ArrowDown':
          action(getValidColumnIndex(selectedColourIndex, 1))
          return

        case 'Up':
        case 'ArrowUp':
          action(getValidColumnIndex(selectedColourIndex, -1))
          return

        case 'Left':
        case 'ArrowLeft':
          action(getValidRowIndex(selectedColourIndex, -5))
          return

        case 'Right':
        case 'ArrowRight':
          action(getValidRowIndex(selectedColourIndex, 5))
          return

        case 'Backspace':
        case 'Delete':
          dispatch(colourRemoved({colour: colourPaletteColours[selectedColourIndex]}))
      }
    }

    function getColour(index: number) {
      if (index < 0 || index >= colourPaletteColours.length) {
        return null
      }
      return colourPaletteColours[index]
    }

    function getValidColumnIndex(currentIndex: number, increment: number) {
      const newIndex = currentIndex + increment
      if (newIndex < 0 || newIndex >= colourPaletteColours.length) {
        return -1
      }
      const currentColumn = Math.floor(currentIndex / 5)
      const newColumn = Math.floor(newIndex / 5)

      return newColumn === currentColumn ? newIndex : -1
    }

    function getValidRowIndex(currentIndex: number, increment: number) {
      const newIndex = currentIndex + increment
      if (newIndex < 0 || newIndex >= colourPaletteColours.length) {
        return -1
      }
      const currentRow = Math.floor(currentIndex % 5)
      const newRow = Math.floor(newIndex % 5)

      return newRow === currentRow ? newIndex : -1
    }

    function select(colour: Colour | null) {
      if (colour) {
        dispatch(colourSelected({colour}))
      }
    }

    function selectByIndex(index: number) {
      const colour = getColour(index)
      if (colour) select(colour)
    }

    function move(colour: Colour, newIndex: number) {
      dispatch(colourMoved({colour, newIndex}))
    }

    function moveSelectedColourToIndex(index: number) {
      if (index < 0) {
        return
      }
      move(colourPaletteColours[getSelectedColourIndex()], index)
    }

    function getSelectedColourIndex() {
      return colourPaletteColours.findIndex((x) => x.isSelected)
    }

    window.addEventListener('keyup', keyUp, false)
    return () => {
      window.removeEventListener('keyup', keyUp)
    }
  }, [colourPaletteColours, canRemoveColours, dispatch])

  return (
    <ul className={classes.colourlist}>
      {colourPaletteColours.map((c, i) => (
        <ColourPaletteColourListItem colour={c} canRemove={canRemoveColours} index={i} key={c.id} />
      ))}
    </ul>
  )
}
