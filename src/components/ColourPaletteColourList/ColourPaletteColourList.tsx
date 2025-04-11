import classes from './ColourPaletteColourList.module.less'
import ColourPaletteColourListItem from '../ColourPaletteColourListItem/ColourPaletteColourListItem'
import {Colour} from 'src/types/Colour'
import {useEffect, KeyboardEvent} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
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
    window.addEventListener('keyup', keyUp, false)
    return () => window.removeEventListener('keyup', keyUp)
  }, [colourPaletteColours])

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

  function select(colour: Colour) {
    if (colour) {
      dispatch(colourSelected({colour}))
    }
  }

  function selectByIndex(index: number) {
    select(getColour(index)!)
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
    return colourPaletteColours.findIndex((x) => x.isSelected === true)
  }

  function keyUp(e: Event) {
    // This cast and use of Event is a hack so that addEventListender will allow this handler to be added
    const event = e as any as KeyboardEvent
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
        dispatch(colourRemoved({colour: getColour(selectedColourIndex)!}))
    }
  }

  return (
    <ul className={classes.colourlist}>
      {colourPaletteColours.map((c, i) => (
        <ColourPaletteColourListItem colour={c} canRemove={canRemoveColours} index={i} key={c.id} />
      ))}
    </ul>
  )
}
