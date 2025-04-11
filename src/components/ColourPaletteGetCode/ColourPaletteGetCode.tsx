import {usePalette} from 'src/stores/ColourPalettes/PaletteContext'
import classes from './ColourPaletteGetCode.module.less'
import {default as TestIds} from './ColourPaletteGetCodeTestIds'
import {colourPaletteXml} from 'src/utils/TpsWriter'
import {useState} from 'react'
import clsx from 'clsx'

export default function ColourPaletteGetCode() {
  const state = usePalette()
  const [isXmlCopied, setIsXmlCopied] = useState(false)

  const xml = colourPaletteXml(state)

  function handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()

    navigator.clipboard.writeText(xml)

    setIsXmlCopied(true)
  }

  return (
    <div className={classes.getcode} data-testid={TestIds.Self}>
      <div
        className={classes['getcode-codecontainer']}
        data-testid={TestIds.Code}
      >
        <pre className={classes['getcode-code']}>{xml}</pre>
      </div>
      {!isXmlCopied && (
        <button
          className={classes['button getcode-copy']}
          onClick={handleButtonClick}
          data-testid={TestIds.Button}
        >
          Copy to clipboard
        </button>
      )}
      {isXmlCopied && (
        <button
          className={clsx(
            classes['button getcode-copy'],
            classes['getcode-copy--copied']
          )}
          data-testid={TestIds.Button}
        >
          Copied
          <span className="fas fa-check"></span>
        </button>
      )}
    </div>
  )
}
