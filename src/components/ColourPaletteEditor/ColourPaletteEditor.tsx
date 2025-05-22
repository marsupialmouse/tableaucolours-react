import ColourPaletteTypeSelector from '../ColourPaletteTypeSelector/ColourPaletteTypeSelector'
import ColourPaletteColourList from '../ColourPaletteColourList/ColourPaletteColourList'
import ImageColourPicker from '../ImageColourPicker/ImageColourPicker'
import ColourPaletteGetCode from '../ColourPaletteGetCode/ColourPaletteGetCode'
import ColourPaletteImport from '../ColourPaletteImport/ColourPaletteImport'
import ColourPalettePreview from '../ColourPalettePreview/ColourPalettePreview'
import classes from './ColourPaletteEditor.module.less'
import clsx from 'clsx'
import {
  colourAdded,
  coloursReset,
  paletteNameChanged,
  paletteTypeChanged,
  selectCanAddColour,
  selectColourPaletteColours,
  selectColourPaletteIsOpen,
  selectColourPaletteName,
  selectColourPaletteType,
} from 'src/stores/colourPaletteSlice'
import {useSelector} from 'react-redux'
import ModalDialog from '../ModalDialog/ModalDialog'
import {useEffect, useState} from 'react'
import ImageColourExtractor from '../ImageColourExtractor/ImageColourExtractor'
import {useAppDispatch} from 'src/stores/hooks'
import {ColourPaletteType} from 'src/types/ColourPaletteTypes'
import {selectHasImage} from 'src/stores/imageSlice'

export default function ColourPaletteEditor() {
  const [codeModalOpen, setCodeModalOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [extractModalOpen, setExtractModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const canAddColour = useSelector(selectCanAddColour)
  const colours = useSelector(selectColourPaletteColours)
  const paletteName = useSelector(selectColourPaletteName)
  const paletteType = useSelector(selectColourPaletteType)
  const paletteIsOpen = useSelector(selectColourPaletteIsOpen)
  const hasImage = useSelector(selectHasImage)
  const canExtractColours = hasImage
  const hasColours = colours.length > 0

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

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch(paletteNameChanged({name: event.target.value}))
  }

  function handleTypeChange(type: ColourPaletteType) {
    dispatch(paletteTypeChanged({type: type.id}))
  }

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
      <div className={classes.paletteeditor}>
        <div className={classes['paletteeditor-editor']}>
          <div className={classes.colourpalette}>
            <div className={classes['colourpalette-toolbar']}>
              {
                /* This should really only be shown when editing a TPS file */
                !paletteIsOpen && (
                  <button
                    className={clsx(classes.back, 'iconbutton', 'fas', 'fa-arrow-left')}
                    title="Back"
                  ></button>
                )
              }
            </div>
            <div className={classes['colourpalette-name']}>
              <input
                id="name"
                type="text"
                value={paletteName}
                onChange={handleNameChange}
                tabIndex={1}
                placeholder="Enter a palette name"
                autoComplete="off"
              />
            </div>
            <div className={classes['colourpalette-type']}>
              <ColourPaletteTypeSelector
                selectedType={paletteType}
                tabIndex={2}
                onTypeSelected={handleTypeChange}
              />
            </div>
            <div className={classes['colourpalette-colours']}>
              <ColourPaletteColourList />
            </div>
            <div className={classes['colourpalette-preview']}>
              <ColourPalettePreview type={paletteType} colours={colours} />
            </div>
            <ul className={classes['colourpalette-actions']}>
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
            {
              /* This should really only be shown when editing a TPS file */
              !paletteIsOpen && (
                <div className={classes['colourpalette-buttons']}>
                  <button className={classes.button}>Cancel</button>
                  <button className={classes.button}>Done</button>
                </div>
              )
            }
          </div>
        </div>
        <div className={classes['paletteeditor-image']}>
          <ImageColourPicker />
        </div>
        <ModalDialog
          width="54rem"
          isOpen={codeModalOpen}
          onClose={() => {
            setCodeModalOpen(false)
          }}
        >
          <ColourPaletteGetCode />
        </ModalDialog>
        <ModalDialog
          width="54rem"
          isOpen={importModalOpen}
          onClose={() => {
            setImportModalOpen(false)
          }}
        >
          <ColourPaletteImport
            onDone={() => {
              setImportModalOpen(false)
            }}
          />
        </ModalDialog>
        <ModalDialog
          width="54rem"
          isOpen={extractModalOpen}
          onClose={() => {
            setExtractModalOpen(false)
          }}
        >
          <ImageColourExtractor
            onClose={() => {
              setExtractModalOpen(false)
            }}
          />
        </ModalDialog>
      </div>
    </>
  )
}
