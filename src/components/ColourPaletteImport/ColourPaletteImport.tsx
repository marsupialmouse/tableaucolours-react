import {useState} from 'react'
import classes from './ColourPaletteImport.module.less'
import {default as TestIds} from './ColourPaletteImportTestIds'
import clsx from 'clsx'
import {parseColourPalette, ParsedPalette} from 'src/utils/TpsParser'
import {usePaletteDispatch} from 'src/state/ColourPalettes/PaletteContext'
import {PaletteActionTypes} from 'src/state/ColourPalettes/PaletteActions'
import {PaletteTypes} from 'src/state/ColourPalettes/PaletteTypes'

export interface ColourPaletteImportProps {
  onDone?: () => void
}

export default function ColourPaletteImport({
  onDone,
}: ColourPaletteImportProps) {
  const [xml, setXml] = useState('')
  const [palette, setPalette] = useState<ParsedPalette | null>(null)
  const [validationMessage, setValidationMessage] = useState('')
  const dispatch = usePaletteDispatch()
  const isValid = !validationMessage.length
  const canImport = isValid && xml.length

  function handleCodeChange(value: string): void {
    const parsedXml = parseColourPalette(value)
    setValidationMessage(parsedXml.isValid ? '' : parsedXml.error)
    setPalette(parsedXml.isValid ? parsedXml.palette : null)
    setXml(value)
  }

  function handleImport(): void {
    dispatch({
      type: PaletteActionTypes.ReplacePalette,
      payload: {
        name: palette?.name,
        type: PaletteTypes.find(palette?.type),
        colours: palette?.colours,
      },
    })
    onDone?.()
  }

  return (
    <div className={classes.importcode} data-testid={TestIds.Self}>
      <div className={classes['importcode-codecontainer']}>
        <textarea
          value={xml}
          onChange={(e) => handleCodeChange(e.target.value)}
          autoFocus
          className={clsx(
            classes['importcode-code'],
            !isValid && classes['importcode-code--invalid']
          )}
          placeholder="Paste a &lt;color-palette&gt;"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          data-testid={TestIds.Code}
        ></textarea>
        {!isValid && (
          <div
            className={classes['importcode-validationmessage']}
            data-testid={TestIds.ValidationMessage}
          >
            {validationMessage}
          </div>
        )}
      </div>
      <button
        className={clsx(
          classes['importcode-button'],
          classes['importcode-button--import']
        )}
        disabled={!canImport}
        onClick={handleImport}
        data-testid={TestIds.ImportButton}
      >
        Import
      </button>
      <button
        className={clsx(
          classes['importcode-button'],
          classes['importcode-button--cancel']
        )}
        onClick={() => onDone?.()}
        data-testid={TestIds.CancelButton}
      >
        Cancel
      </button>
    </div>
  )
}
