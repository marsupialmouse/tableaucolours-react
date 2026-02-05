import './App.less'
import ColourPaletteEditor from './components/ColourPaletteEditor/ColourPaletteEditor'

function App() {
  return (
    <>
      <div id="modals"></div>
      <main>
        <section id="palettesection" className="overlay">
          <div>
            <ColourPaletteEditor />
          </div>
        </section>
      </main>
    </>
  )
}

export default App
