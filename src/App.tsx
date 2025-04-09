import './App.less'
import {PaletteContextProvider} from './state/ColourPalettes/PaletteContext'
import ColourPaletteColourList from './components/ColourPaletteColourList/ColourPaletteColourList'
import {
  createColours,
  initialPaletteState,
} from './state/ColourPalettes/PaletteReducer'
import {PaletteType, PaletteTypes} from './state/ColourPalettes/PaletteTypes'
import ColourPaletteTypeSelector from './components/ColourPaletteTypeSelector/ColourPaletteTypeSelector'
import {useState} from 'react'
import ColourPalettePreview from './components/ColourPalettePreview/ColourPalettePreview'

function App() {
  const [selectedType, setSelectedType] = useState(PaletteTypes.sequential)
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

  function handleTypeSelected(type: PaletteType): void {
    setSelectedType(type)
  }

  return (
    <>
      <div style={{width: '20rem'}}>
        <PaletteContextProvider initialState={palette}>
          <ColourPaletteTypeSelector
            selectedType={selectedType}
            onTypeSelected={handleTypeSelected}
            tabIndex={1}
          />
          <ColourPaletteColourList />
          <ColourPalettePreview type={selectedType} colours={palette.colours} />
        </PaletteContextProvider>
      </div>
    </>
  )
}

export default App
