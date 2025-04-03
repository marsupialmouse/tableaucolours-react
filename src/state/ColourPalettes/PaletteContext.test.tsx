import {describe, it, expect} from 'vitest'
import {render, screen} from '@testing-library/react'
import {userEvent} from '../../test-utils.tsx'
import {
  PaletteContextProvider,
  usePalette,
  usePaletteDispatch,
} from './PaletteContext.tsx'
import {PaletteActionTypes} from './PaletteActions.ts'
import {
  ColourPalette,
  createColours,
  initialPaletteState,
} from './PaletteReducer.ts'

function createPalette(
  colours?: string[],
  selectFirstColour?: boolean
): ColourPalette {
  if (!colours && !selectFirstColour) {
    return initialPaletteState
  }

  return {
    ...initialPaletteState,
    colours: createColours(colours, selectFirstColour),
  }
}

describe('Palette Context', () => {
  it('adds a colour to state', async () => {
    const TestComponent = function () {
      const state = usePalette()
      const dispatch = usePaletteDispatch()
      return (
        <div>
          <span data-testid="colours">
            {state.colours.map((x) => x.hex).join(' ')}
          </span>
          <button
            data-testid="button"
            onClick={() =>
              dispatch({type: PaletteActionTypes.AddColour, payload: '#0000FF'})
            }
          ></button>
        </div>
      )
    }

    render(
      <PaletteContextProvider
        initialState={createPalette(['#FF0000', '#00FF00'])}
      >
        <TestComponent />
      </PaletteContextProvider>
    )
    await userEvent.click(screen.getByTestId('button'))

    expect(screen.getByTestId('colours')).toHaveTextContent(
      '#FF0000 #00FF00 #0000FF'
    )
  })

  it('changes colour in state', async () => {
    const TestComponent = function () {
      const state = usePalette()
      const dispatch = usePaletteDispatch()
      return (
        <div>
          <span data-testid="colours">
            {state.colours.map((x) => x.hex).join(' ')}
          </span>
          <button
            data-testid="button"
            onClick={() =>
              dispatch({
                type: PaletteActionTypes.ChangeColour,
                payload: {colour: state.colours[1], hex: '#000000'},
              })
            }
          ></button>
        </div>
      )
    }

    render(
      <PaletteContextProvider
        initialState={createPalette(['#FF0000', '#00FF00', '#0000FF'])}
      >
        <TestComponent />
      </PaletteContextProvider>
    )
    await userEvent.click(screen.getByTestId('button'))

    expect(screen.getByTestId('colours')).toHaveTextContent(
      '#FF0000 #000000 #0000FF'
    )
  })

  it('selects colour in state', async () => {
    const TestComponent = function () {
      const state = usePalette()
      const dispatch = usePaletteDispatch()
      return (
        <div>
          <span data-testid="colours">
            {state.colours.map((x) => (x.isSelected ? 'Y' : 'N')).join(' ')}
          </span>
          <button
            data-testid="button"
            onClick={() =>
              dispatch({
                type: PaletteActionTypes.SelectColour,
                payload: state.colours[2],
              })
            }
          ></button>
        </div>
      )
    }

    render(
      <PaletteContextProvider
        initialState={createPalette(['#000', '#000', '#000', '#000'], true)}
      >
        <TestComponent />
      </PaletteContextProvider>
    )
    await userEvent.click(screen.getByTestId('button'))

    expect(screen.getByTestId('colours')).toHaveTextContent('N N Y N')
  })

  it('moves colour in state', async () => {
    const TestComponent = function () {
      const state = usePalette()
      const dispatch = usePaletteDispatch()
      return (
        <div>
          <span data-testid="colours">
            {state.colours.map((x) => x.hex).join(' ')}
          </span>
          <button
            data-testid="button"
            onClick={() =>
              dispatch({
                type: PaletteActionTypes.MoveColour,
                payload: {colour: state.colours[2], newIndex: 0},
              })
            }
          ></button>
        </div>
      )
    }

    render(
      <PaletteContextProvider
        initialState={createPalette(['#FF0000', '#00FF00', '#0000FF'])}
      >
        <TestComponent />
      </PaletteContextProvider>
    )
    await userEvent.click(screen.getByTestId('button'))

    expect(screen.getByTestId('colours')).toHaveTextContent(
      '#0000FF #FF0000 #00FF00'
    )
  })

  it('removes colour from state', async () => {
    const TestComponent = function () {
      const state = usePalette()
      const dispatch = usePaletteDispatch()
      return (
        <div>
          <span data-testid="colours">
            {state.colours.map((x) => x.hex).join(' ')}
          </span>
          <button
            data-testid="button"
            onClick={() =>
              dispatch({
                type: PaletteActionTypes.RemoveColour,
                payload: state.colours[1],
              })
            }
          ></button>
        </div>
      )
    }

    render(
      <PaletteContextProvider
        initialState={createPalette(['#FF0000', '#00FF00', '#0000FF'])}
      >
        <TestComponent />
      </PaletteContextProvider>
    )
    await userEvent.click(screen.getByTestId('button'))

    expect(screen.getByTestId('colours')).toHaveTextContent('#FF0000 #0000FF')
  })
})
