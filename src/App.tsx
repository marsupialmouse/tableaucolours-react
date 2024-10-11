import './App.less'
import {PaletteContextProvider} from './state/ColourPalettes/PaletteContext'
import ColourPaletteColourList from './components/ColourPaletteColourList/ColourPaletteColourList'
import {
  createColours,
  initialPaletteState,
} from './state/ColourPalettes/PaletteReducer'

function App() {
  const palette = {
    ...initialPaletteState,
    colours: createColours([
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#000',
      '#FFF',
      '#CCC',
    ]),
  }

  return (
    <>
      <div style={{width: '20rem'}}>
        <PaletteContextProvider initialState={palette}>
          <ColourPaletteColourList />
        </PaletteContextProvider>
      </div>
    </>
  )
}

export default App
