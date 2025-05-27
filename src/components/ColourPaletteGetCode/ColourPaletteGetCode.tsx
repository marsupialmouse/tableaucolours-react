import classes from './ColourPaletteGetCode.module.less'
import {default as TestIds} from './ColourPaletteGetCodeTestIds'
import {colourPaletteXml} from 'src/utils/TpsWriter'
import {useState} from 'react'
import clsx from 'clsx'
import {useSelector} from 'react-redux'
import {selectColourPalette} from 'src/stores/colourPaletteSlice'

export default function ColourPaletteGetCode() {
  const palette = useSelector(selectColourPalette)
  const [isXmlCopied, setIsXmlCopied] = useState(false)

  const xml = colourPaletteXml(palette)

  async function handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()

    await navigator.clipboard.writeText(xml)

    setIsXmlCopied(true)
  }

  return (
    <div className={classes.getcode} data-testid={TestIds.Self}>
      <div className={classes['getcode-codecontainer']} data-testid={TestIds.Code}>
        <pre className={classes['getcode-code']}>{xml}</pre>
      </div>
      {!isXmlCopied && (
        <button
          className={clsx('button', classes['getcode-copy'])}
          onClick={(e) => {
            void handleButtonClick(e)
          }}
          data-testid={TestIds.Button}
        >
          Copy to clipboard
        </button>
      )}
      {isXmlCopied && (
        <button
          className={clsx('button', classes['getcode-copy'], classes['getcode-copy--copied'])}
          data-testid={TestIds.Button}
        >
          Copied&nbsp;
          <span className="fas fa-check"></span>
        </button>
      )}
    </div>
  )
}
