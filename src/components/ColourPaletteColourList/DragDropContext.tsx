import {createContext, useContext, useState, useCallback, ReactNode, useMemo} from 'react'

interface DragDropState {
  draggedColourId: number | null
  dropTargetIndex: number | null
}

interface DragDropContextValue extends DragDropState {
  startDrag: (colourId: number) => void
  updateDropTarget: (index: number | null) => void
  endDrag: () => void
}

const DragDropContext = createContext<DragDropContextValue | null>(null)

export function DragDropProvider({children}: {children: ReactNode}) {
  const [state, setState] = useState<DragDropState>({
    draggedColourId: null,
    dropTargetIndex: null,
  })

  const startDrag = useCallback((colourId: number) => {
    setState({draggedColourId: colourId, dropTargetIndex: null})
  }, [])

  const updateDropTarget = useCallback((index: number | null) => {
    setState((prev) => ({...prev, dropTargetIndex: index}))
  }, [])

  const endDrag = useCallback(() => {
    setState({draggedColourId: null, dropTargetIndex: null})
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      startDrag,
      updateDropTarget,
      endDrag,
    }),
    [state, startDrag, updateDropTarget, endDrag]
  )

  return <DragDropContext.Provider value={value}>{children}</DragDropContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDragDrop() {
  const context = useContext(DragDropContext)
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider')
  }
  return context
}
