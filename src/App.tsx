import './App.less'
import ColourPaletteEditor from './components/ColourPaletteEditor/ColourPaletteEditor'

function App() {
  return (
    <div id="app">
      <section id="palettesection" className="overlay">
        <div>
          <ColourPaletteEditor />
        </div>
      </section>
    </div>
  )
}

export default App
