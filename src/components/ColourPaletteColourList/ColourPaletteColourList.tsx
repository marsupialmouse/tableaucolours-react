import classes from './ColourPaletteColourList.module.less'
import ColourPaletteColourListItem from '../ColourPaletteColourListItem/ColourPaletteColourListItem'
import {memo, useEffect, useCallback, useMemo} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  Colour,
  colourMoved,
  colourRemoved,
  colourSelected,
  selectColourPaletteColours,
} from 'src/stores/colourPaletteSlice'
import {DragDropProvider, useDragDrop} from './DragDropContext'
import {DropIndicator} from './DropIndicator'

const ColourPaletteColourListInner = memo(function ColourPaletteColourListInner() {
  const dispatch = useDispatch()
  const colourPaletteColours = useSelector(selectColourPaletteColours)
  const canRemoveColours = colourPaletteColours.length > 1
  const {draggedColourId, dropTargetIndex, updateDropTarget, endDrag} = useDragDrop()

  // Calculate display indices for all colours based on drag state
  const displayIndices = useMemo(() => {
    if (draggedColourId === null || dropTargetIndex === null) {
      return colourPaletteColours.map((_, i) => i)
    }

    const draggedIndex = colourPaletteColours.findIndex((c) => c.id === draggedColourId)
    if (draggedIndex === -1) {
      return colourPaletteColours.map((_, i) => i)
    }

    // Calculate where each colour should appear during drag
    return colourPaletteColours.map((_, originalIndex) => {
      if (originalIndex === draggedIndex) {
        // Dragged colour stays visually in place (but ghostly)
        return originalIndex
      }

      // Shift colours to make room for drop target
      if (draggedIndex < dropTargetIndex) {
        // Dragging down: colours between drag and drop shift up
        if (originalIndex > draggedIndex && originalIndex <= dropTargetIndex) {
          return originalIndex - 1
        }
      } else if (draggedIndex > dropTargetIndex) {
        // Dragging up: colours between drop and drag shift down
        if (originalIndex >= dropTargetIndex && originalIndex < draggedIndex) {
          return originalIndex + 1
        }
      }
      return originalIndex
    })
  }, [colourPaletteColours, draggedColourId, dropTargetIndex])

  // Handle drop on the list container
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (draggedColourId !== null && dropTargetIndex !== null) {
        const draggedIndex = colourPaletteColours.findIndex((c) => c.id === draggedColourId)
        // Only dispatch if actually moving to a different position
        if (draggedIndex !== -1 && draggedIndex !== dropTargetIndex) {
          const colour = colourPaletteColours[draggedIndex]
          dispatch(colourMoved({colour, newIndex: dropTargetIndex}))
        }
      }
      endDrag()
    },
    [dispatch, colourPaletteColours, draggedColourId, dropTargetIndex, endDrag]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      // When dragging over empty space in the list (not over a colour item),
      // only set drop target to end if we don't already have a valid target
      // This prevents erratic jumping when moving cursor between items
      if (draggedColourId !== null && e.target === e.currentTarget && dropTargetIndex === null) {
        updateDropTarget(colourPaletteColours.length - 1)
      }
    },
    [draggedColourId, dropTargetIndex, colourPaletteColours.length, updateDropTarget]
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      // Only clear if leaving the container entirely
      const rect = e.currentTarget.getBoundingClientRect()
      const {clientX, clientY} = e
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        updateDropTarget(null)
      }
    },
    [updateDropTarget]
  )

  // Handle drag end (including drops outside the list)
  const handleDragEnd = useCallback(() => {
    endDrag()
  }, [endDrag])

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

  // Show drop indicator at the target position
  const showDropIndicator =
    draggedColourId !== null &&
    dropTargetIndex !== null &&
    colourPaletteColours.findIndex((c) => c.id === draggedColourId) !== dropTargetIndex

  return (
    <ul
      className={classes.colourlist}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      data-testid="ColourPaletteColourList"
    >
      {colourPaletteColours.map((c, i) => (
        <ColourPaletteColourListItem
          colour={c}
          canRemove={canRemoveColours}
          index={i}
          displayIndex={displayIndices[i]}
          key={c.id}
          isDragging={c.id === draggedColourId}
          onDragEnd={handleDragEnd}
        />
      ))}
      {showDropIndicator && <DropIndicator key="drop-indicator" index={dropTargetIndex} />}
    </ul>
  )
})

const ColourPaletteColourList = memo(function ColourPaletteColourList() {
  return (
    <DragDropProvider>
      <ColourPaletteColourListInner />
    </DragDropProvider>
  )
})

export default ColourPaletteColourList
