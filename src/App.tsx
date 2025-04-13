import './App.less'
import ColourPaletteColourList from './components/ColourPaletteColourList/ColourPaletteColourList'
import {ColourPaletteType, ColourPaletteTypes} from './types/ColourPaletteTypes'
import ColourPaletteTypeSelector from './components/ColourPaletteTypeSelector/ColourPaletteTypeSelector'
import {useState} from 'react'
import ColourPalettePreview from './components/ColourPalettePreview/ColourPalettePreview'
import {useSelector} from 'react-redux'
import {selectColourPaletteColours} from './stores/colourpalette/colourPaletteSlice'

function App() {
  const [selectedType, setSelectedType] = useState(ColourPaletteTypes.sequential)

  const colours = useSelector(selectColourPaletteColours)

  function handleTypeSelected(type: ColourPaletteType): void {
    setSelectedType(type)
  }

  return (
    <>
      <div style={{width: '20rem'}}>
        <ColourPaletteTypeSelector
          selectedType={selectedType}
          onTypeSelected={handleTypeSelected}
          tabIndex={1}
        />
        <ColourPaletteColourList />
        <ColourPalettePreview type={selectedType} colours={colours} />
      </div>
    </>
  )
}

export default App
