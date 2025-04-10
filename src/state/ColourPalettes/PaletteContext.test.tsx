import {describe, it, expect} from 'vitest'
import {render, screen} from '@testing-library/react'
import {userEvent} from '../../test-utils.tsx'
import {
  PaletteContextProvider,
  usePalette,
  usePaletteDispatch,
} from './PaletteContext.tsx'
import {PaletteActions, PaletteActionTypes} from './PaletteActions.ts'
import {
  ColourPalette,
  createColours,
  initialPaletteState,
} from './PaletteReducer.ts'
import {PaletteType, PaletteTypes} from './PaletteTypes.ts'

function createPalette(
  name?: string,
  type?: PaletteType,
  colours?: string[],
  selectFirstColour?: boolean
): ColourPalette {
  if (!name && !type && !colours && !selectFirstColour) {
    return initialPaletteState
  }

  var palette = {...initialPaletteState}

  if (name) palette.name = name
  if (type) palette.type = type
  if (colours) palette.colours = createColours(colours, selectFirstColour)

  return palette
}

function createPaletteWithColours(
  colours?: string[],
  selectFirstColour?: boolean
): ColourPalette {
  return createPalette(undefined, undefined, colours, selectFirstColour)
}

interface RenderProps {
  dispatch: PaletteActions | ((state: ColourPalette) => PaletteActions)
  initialState: ColourPalette | undefined
}

function renderWithContext({dispatch, initialState}: RenderProps) {
  const TestComponent = function () {
    const state = usePalette()
    const paletteDispatch = usePaletteDispatch()
    return (
      <div>
        <span data-testid="name">{state.name}</span>
        <span data-testid="type">{state.type.id}</span>
        <span data-testid="colours">
          {state.colours.map((x) => x.hex).join(' ')}
        </span>
        <span data-testid="coloursSelected">
          {state.colours.map((x) => (x.isSelected ? 'Y' : 'N'))}
        </span>
        <span data-testid="hasChanges">{state.hasChanges.toString()}</span>
        <span data-testid="isOpen">{state.isOpen.toString()}</span>

        <button
          data-testid="dispatch"
          onClick={() =>
            paletteDispatch('type' in dispatch ? dispatch : dispatch(state))
          }
        ></button>
      </div>
    )
  }
  render(
    <PaletteContextProvider initialState={initialState}>
      <TestComponent />
    </PaletteContextProvider>
  )
}

describe('Palette Context', () => {
  it('adds a colour to state', async () => {
    renderWithContext({
      initialState: createPaletteWithColours(['#FF0000', '#00FF00']),
      dispatch: {type: PaletteActionTypes.AddColour, payload: '#0000FF'},
    })

    await userEvent.click(screen.getByTestId('dispatch'))

    expect(screen.getByTestId('hasChanges').textContent).toBe('true')
    expect(screen.getByTestId('colours').textContent).toBe(
      '#FF0000 #00FF00 #0000FF'
    )
  })

  it('adds a white colour to state when no colour fiven', async () => {
    renderWithContext({
      initialState: createPaletteWithColours(['#FF0000', '#00FF00']),
      dispatch: {type: PaletteActionTypes.AddColour},
    })

    await userEvent.click(screen.getByTestId('dispatch'))

    expect(screen.getByTestId('hasChanges').textContent).toBe('true')
    expect(screen.getByTestId('colours').textContent).toBe(
      '#FF0000 #00FF00 #FFFFFF'
    )
  })

  it('selects colour when adding', async () => {
    renderWithContext({
      initialState: createPaletteWithColours(['#FF0000', '#00FF00']),
      dispatch: {type: PaletteActionTypes.AddColour, payload: '#0000FF'},
    })

    await userEvent.click(screen.getByTestId('dispatch'))

    expect(screen.getByTestId('coloursSelected').textContent).toBe('NNY')
  })

  it('does not add colour if state already has 20 colours', async () => {
    const colours = Array.from(Array(20).keys()).map(
      (x) => '#0' + (10 + x).toString()
    )

    renderWithContext({
      initialState: createPaletteWithColours(colours),
      dispatch: {type: PaletteActionTypes.AddColour, payload: '#FFFFFF'},
    })

    await userEvent.click(screen.getByTestId('dispatch'))

    expect(screen.getByTestId('hasChanges').textContent).toBe('false')
    expect(screen.getByTestId('colours').textContent).toBe(colours.join(' '))
  })

  it('changes colour in state', async () => {
    renderWithContext({
      initialState: createPaletteWithColours(['#FF0000', '#00FF00', '#0000FF']),
      dispatch: (state) => {
        return {
          type: PaletteActionTypes.ChangeColour,
          payload: {colour: state.colours[1], hex: '#000000'},
        }
      },
    })

    await userEvent.click(screen.getByTestId('dispatch'))

    expect(screen.getByTestId('hasChanges').textContent).toBe('true')
    expect(screen.getByTestId('colours').textContent).toBe(
      '#FF0000 #000000 #0000FF'
    )
  })

  it('selects colour in state', async () => {
    renderWithContext({
      initialState: createPaletteWithColours(
        ['#000', '#000', '#000', '#000'],
        true
      ),
      dispatch: (state) => {
        return {
          type: PaletteActionTypes.SelectColour,
          payload: state.colours[2],
        }
      },
    })

    await userEvent.click(screen.getByTestId('dispatch'))

    expect(screen.getByTestId('hasChanges').textContent).toBe('false')
    expect(screen.getByTestId('coloursSelected').textContent).toBe('NNYN')
  })

  it('moves colour in state', async () => {
    renderWithContext({
      initialState: createPaletteWithColours(['#FF0000', '#00FF00', '#0000FF']),
      dispatch: (state) => {
        return {
          type: PaletteActionTypes.MoveColour,
          payload: {colour: state.colours[2], newIndex: 0},
        }
      },
    })

    await userEvent.click(screen.getByTestId('dispatch'))

    expect(screen.getByTestId('hasChanges').textContent).toBe('true')
    expect(screen.getByTestId('colours').textContent).toBe(
      '#0000FF #FF0000 #00FF00'
    )
  })

  it('removes colour from state', async () => {
    renderWithContext({
      initialState: createPaletteWithColours(['#FF0000', '#00FF00', '#0000FF']),
      dispatch: (state) => {
        return {
          type: PaletteActionTypes.RemoveColour,
          payload: state.colours[1],
        }
      },
    })

    await userEvent.click(screen.getByTestId('dispatch'))

    expect(screen.getByTestId('hasChanges').textContent).toBe('true')
    expect(screen.getByTestId('colours').textContent).toBe('#FF0000 #0000FF')
  })

  it('replaces colours', async () => {
    const colours = ['#FFF', '#AAA', '#000', '#DDD']
    renderWithContext({
      initialState: createPaletteWithColours(['#FF0000', '#00FF00', '#0000FF']),
      dispatch: {
        type: PaletteActionTypes.ReplaceColours,
        payload: colours,
      },
    })

    await userEvent.click(screen.getByTestId('dispatch'))

    expect(screen.getByTestId('hasChanges').textContent).toBe('true')
    expect(screen.getByTestId('colours').textContent).toBe(colours.join(' '))
  })

  it('selects first colour when replacing colours', async () => {
    const colours = ['#FFF', '#AAA', '#000', '#DDD']
    renderWithContext({
      initialState: createPaletteWithColours(['#FF0000', '#00FF00', '#0000FF']),
      dispatch: {
        type: PaletteActionTypes.ReplaceColours,
        payload: colours,
      },
    })

    await userEvent.click(screen.getByTestId('dispatch'))

    expect(screen.getByTestId('coloursSelected').textContent).toBe('YNNN')
  })

  it('replaces colours with one white when no colours given for replacement', async () => {
    renderWithContext({
      initialState: createPaletteWithColours(['#FF0000', '#00FF00', '#0000FF']),
      dispatch: {
        type: PaletteActionTypes.ReplaceColours,
      },
    })

    await userEvent.click(screen.getByTestId('dispatch'))

    expect(screen.getByTestId('hasChanges').textContent).toBe('true')
    expect(screen.getByTestId('colours').textContent).toBe('#FFFFFF')
    expect(screen.getByTestId('coloursSelected').textContent).toBe('Y')
  })

  it('takes first 20 colours when replacing colours with more than 20 values', async () => {
    const colours = Array.from(Array(25).keys()).map(
      (x) => '#0' + (10 + x).toString()
    )
    renderWithContext({
      initialState: createPaletteWithColours(['#FF0000', '#00FF00', '#0000FF']),
      dispatch: {
        type: PaletteActionTypes.ReplaceColours,
        payload: colours,
      },
    })

    await userEvent.click(screen.getByTestId('dispatch'))

    expect(screen.getByTestId('colours').textContent).toBe(
      colours.slice(0, 20).join(' ')
    )
  })

  it('replaces colour palette with empty palette', async () => {
    renderWithContext({
      initialState: createPalette('Cornered', PaletteTypes.sequential, [
        '#000',
        '#F0F',
        '#0F0',
      ]),
      dispatch: {
        type: PaletteActionTypes.ReplacePalette,
      },
    })

    await userEvent.click(screen.getByTestId('dispatch'))

    expect(screen.getByTestId('hasChanges').textContent).toBe('true')
    expect(screen.getByTestId('name').textContent).toBe('')
    expect(screen.getByTestId('type').textContent).toBe(PaletteTypes.regular.id)
    expect(screen.getByTestId('colours').textContent).toBe('#FFFFFF')
  })

  it('replaces colour palette', async () => {
    const name = 'Go'
    const type = PaletteTypes.diverging
    const colours = ['#000', '#111', '#333']

    renderWithContext({
      initialState: createPaletteWithColours(['#FF0000', '#00FF00', '#0000FF']),
      dispatch: {
        type: PaletteActionTypes.ReplacePalette,
        payload: {name, type, colours},
      },
    })

    await userEvent.click(screen.getByTestId('dispatch'))

    expect(screen.getByTestId('hasChanges').textContent).toBe('true')
    expect(screen.getByTestId('name').textContent).toBe(name)
    expect(screen.getByTestId('type').textContent).toBe(type.id)
    expect(screen.getByTestId('colours').textContent).toBe(colours.join(' '))
  })

  it('uses first 20 colours when replacing palette', async () => {
    const colours = Array.from(Array(25).keys()).map(
      (x) => '#0' + (10 + x).toString()
    )

    renderWithContext({
      initialState: createPaletteWithColours(['#FF0000', '#00FF00', '#0000FF']),
      dispatch: {
        type: PaletteActionTypes.ReplacePalette,
        payload: {colours},
      },
    })

    await userEvent.click(screen.getByTestId('dispatch'))

    expect(screen.getByTestId('colours').textContent).toBe(
      colours.slice(0, 20).join(' ')
    )
  })
})
