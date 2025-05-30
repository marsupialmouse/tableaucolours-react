import {memo, useCallback, useEffect, useState} from 'react'
import classes from './ColourPaletteActions.module.less'
import {useSelector} from 'react-redux'
import {
  colourAdded,
  coloursReset,
  selectCanAddColour,
  selectColourPaletteHasColours,
} from 'src/stores/colourPaletteSlice'
import {selectHasImage} from 'src/stores/imageSlice'
import {useAppDispatch} from 'src/stores/hooks'
import ModalDialog from '../ModalDialog/ModalDialog'
import ColourPaletteGetCode from '../ColourPaletteGetCode/ColourPaletteGetCode'
import ColourPaletteImport from '../ColourPaletteImport/ColourPaletteImport'
import ImageColourExtractor from '../ImageColourExtractor/ImageColourExtractor'

const ColourPaletteActions = memo(function ColourPaletteActions() {
  const [codeModalOpen, setCodeModalOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [extractModalOpen, setExtractModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const canAddColour = useSelector(selectCanAddColour)
  const canExtractColours = useSelector(selectHasImage)
  const hasColours = useSelector(selectColourPaletteHasColours)

  useEffect(() => {
    function keyUp(event: KeyboardEvent) {
      if (
        (event.target as Element).tagName.toLowerCase() === 'body' &&
        event.key === '+' &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        dispatch(colourAdded({}))
      }
    }

    window.addEventListener('keyup', keyUp, false)
    return () => {
      window.removeEventListener('keyup', keyUp)
    }
  }, [dispatch])

  const handleCodeModalClose = useCallback(() => {
    setCodeModalOpen(false)
  }, [setCodeModalOpen])

  const handleExtractModalClose = useCallback(() => {
    setExtractModalOpen(false)
  }, [setExtractModalOpen])

  const handleImportModalClose = useCallback(() => {
    setImportModalOpen(false)
  }, [setImportModalOpen])

  function handleExtractClick(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    setExtractModalOpen(true)
  }

  function handleImportClick(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    setImportModalOpen(true)
  }

  function handleGetCodeClick(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    setCodeModalOpen(true)
  }

  function discardColoursClick(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (confirm('Are you sure you want to delete all colours in the palette?')) {
      dispatch(coloursReset())
    }
  }

  function handleAddColourClick(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    dispatch(colourAdded({}))
  }

  return (
    <>
      <ul className={classes.colourpaletteactions}>
        <li className={classes.extract}>
          <button
            className="iconbutton fas fa-magic"
            title="Extract colours from image (magic!)"
            disabled={!canExtractColours}
            onClick={handleExtractClick}
          ></button>
        </li>
        <li className={classes.import}>
          <button
            className="iconbutton fas fa-file-import"
            title="Import XML"
            onClick={handleImportClick}
          ></button>
        </li>
        <li className={classes.code}>
          <button
            className="iconbutton fas fa-code"
            title="Get XML"
            onClick={handleGetCodeClick}
          ></button>
        </li>
        <li className={classes.discard}>
          <button
            className="iconbutton fas fa-trash-alt"
            title="Delete all colours"
            disabled={!hasColours}
            onClick={discardColoursClick}
          ></button>
        </li>
        <li className={classes.add}>
          <button
            className="iconbutton fas fa-plus"
            title="Add colour (+)"
            disabled={!canAddColour}
            onClick={handleAddColourClick}
          ></button>
        </li>
      </ul>
      <ModalDialog width="54rem" isOpen={codeModalOpen} onClose={handleCodeModalClose}>
        <ColourPaletteGetCode />
      </ModalDialog>
      <ModalDialog width="54rem" isOpen={importModalOpen} onClose={handleImportModalClose}>
        <ColourPaletteImport onDone={handleImportModalClose} />
      </ModalDialog>
      <ModalDialog width="54rem" isOpen={extractModalOpen} onClose={handleExtractModalClose}>
        <ImageColourExtractor onClose={handleExtractModalClose} />
      </ModalDialog>
    </>
  )
})

export default ColourPaletteActions
