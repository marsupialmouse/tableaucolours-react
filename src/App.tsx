import {useState} from 'react'
import ColourPicker from 'components/ColourPicker/ColourPicker.tsx'
import './App.less'

function App() {
  const [hex, setHex] = useState<string>('#ff0')

  return (
    <>
      <div style={{width: '20rem'}}>
        <ColourPicker
          hex="#f00"
          onChange={(h) => {
            setHex(h)
            console.log(h)
          }}
          onDone={() => console.log('Done: ' + hex)}
        />
      </div>
    </>
  )
}

export default App
