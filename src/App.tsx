import './App.less'
import ColourPaletteEditor from './components/ColourPaletteEditor/ColourPaletteEditor'

function App() {
  return (
    <>
      <section id="palettesection" className="overlay">
        <div>
          <ColourPaletteEditor />
        </div>
      </section>
    </>
  )
}

export default App
