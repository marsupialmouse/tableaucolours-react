import {usePaletteContext} from 'src/state/ColourPalettes/PaletteContext'
import classes from './ColourPaletteColourList.module.less'
import ColourPaletteColourListItem from '../ColourPaletteColourListItem/ColourPaletteColourListItem'
import {Colour} from 'src/state/ColourPalettes/PaletteReducer'
import {PaletteActionTypes} from 'src/state/ColourPalettes/PaletteActions'
import {useEffect, KeyboardEvent} from 'react'

export default function ColourPaletteColourList() {
  const {state, dispatch} = usePaletteContext()

  useEffect(() => {
    window.addEventListener('keyup', keyUp, false)

    return () => window.removeEventListener('keyup', keyUp)
  }, [state])

  function getColour(index: number) {
    if (index < 0 || index >= state.colours.length) {
      return null
    }
    return state.colours[index]
  }

  function getValidColumnIndex(currentIndex: number, increment: number) {
    const newIndex = currentIndex + increment
    if (newIndex < 0 || newIndex >= state.colours.length) {
      return -1
    }
    const currentColumn = Math.floor(currentIndex / 5)
    const newColumn = Math.floor(newIndex / 5)

    return newColumn === currentColumn ? newIndex : -1
  }

  function getValidRowIndex(currentIndex: number, increment: number) {
    const newIndex = currentIndex + increment
    if (newIndex < 0 || newIndex >= state.colours.length) {
      return -1
    }
    const currentRow = Math.floor(currentIndex % 5)
    const newRow = Math.floor(newIndex % 5)

    return newRow === currentRow ? newIndex : -1
  }

  function select(colour: Colour) {
    if (colour) {
      dispatch({type: PaletteActionTypes.SelectColour, payload: colour})
    }
  }

  function selectByIndex(index: number) {
    select(getColour(index)!)
  }

  function move(colour: Colour, newIndex: number) {
    dispatch({type: PaletteActionTypes.MoveColour, payload: {colour, newIndex}})
  }

  function moveSelectedColourToIndex(index: number) {
    if (index < 0) {
      return
    }
    move(state.colours[getSelectedColourIndex()], index)
  }

  function getSelectedColourIndex() {
    return state.colours.findIndex((x) => x.isSelected === true)
  }

  function keyUp(e: Event) {
    // This cast and use of Event is a hack so that addEventListender will allow this handler to be added
    const event = e as any as KeyboardEvent
    if ((event.target as Element).tagName.toLowerCase() !== 'body') {
      return
    }
    const selectedColourIndex = getSelectedColourIndex()
    const action = event.getModifierState('Shift')
      ? moveSelectedColourToIndex
      : selectByIndex
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
    }
  }

  return (
    <ul className={classes.colourlist}>
      {state.colours.map((c, i) => (
        <ColourPaletteColourListItem colour={c} index={i} key={c.id} />
      ))}
    </ul>
  )
}
