import clsx from 'clsx'
import classes from './ImageColourExtractor.module.less'
import {default as TestIds} from './ImageColourExtractorTestIds'
import {ChangeEvent, useState} from 'react'
import {
  Colour,
  coloursAdded,
  coloursReplaced,
  maximumPaletteColours,
  selectCanAddColour,
  selectColourPaletteColours,
} from 'src/stores/colourPaletteSlice'
import {useSelector} from 'react-redux'
import ColorThief from 'colorthief'
import {converter, formatHex, useMode, modeLch, modeRgb, parse} from 'culori/fn'
import {useAppDispatch} from 'src/stores/hooks'
import {selectImageSrc} from 'src/stores/imageSlice'

export interface ImageColourExtractorProps {
  onClose?: () => void
}

interface LchColour {
  luminance: number
  chroma: number
  hue: number
  hex: string
}

// eslint-disable-next-line react-hooks/rules-of-hooks
useMode(modeLch)
// eslint-disable-next-line react-hooks/rules-of-hooks
useMode(modeRgb)
const lchConverter = converter('lch')

function createColour(r: number, g: number, b: number): LchColour {
  const rgb = parse(`rgb(${r.toString()} ${g.toString()} ${b.toString()})`)
  const lch = lchConverter(rgb) ?? {l: 0, c: 0, h: 0}

  return {
    luminance: lch.l,
    chroma: lch.c,
    hue: lch.h ?? 0,
    hex: (formatHex(rgb) ?? '').toUpperCase(),
  }
}

// Adapted from https://www.ckdsn.com/sorting-by-color-in-the-lch-color-space/
function compareColours(a: LchColour, b: LchColour) {
  // Sort greys to the end
  if (a.chroma < 4.1 && b.chroma >= 4.1) {
    return 1
  }
  if (b.chroma < 4.1 && a.chroma >= 4.1) {
    return -1
  }

  const aHue = Math.ceil(a.hue / 20) * 20
  const bHue = Math.ceil(b.hue / 20) * 20

  if (aHue !== bHue) {
    return aHue > bHue ? 1 : -1
  }

  const aLum = Math.round(a.luminance / 15) * 15
  const bLum = Math.round(b.luminance / 15) * 15

  if (aLum !== bLum) {
    return aLum > bLum ? -1 : 1
  }

  if (a.chroma === b.chroma) {
    return 0
  }

  return a.chroma > b.chroma ? 1 : -1
}

const calculateMaximumColoursToExtract = (action: ActionType, colours: Colour[]) =>
  action === 'replaceColours' ? maximumPaletteColours : maximumPaletteColours - colours.length

function getSavedNumberOfColoursToExtract() {
  const saved = localStorage.getItem('numberOfColoursToExtract')
  if (!saved) return 0
  const int = parseInt(saved, 10)
  return int >= 0 ? int : 0
}

type ActionType = 'addColours' | 'replaceColours'

export default function ImageColourExtractor({onClose}: ImageColourExtractorProps) {
  const [action, setAction] = useState<ActionType>('replaceColours')
  const [numberControlHasFocus, setNumberControlHasFocus] = useState(true)
  const [numberOfColoursToExtract, setNumberOfColoursToExtract] = useState(
    getSavedNumberOfColoursToExtract() || 8
  )
  const dispatch = useAppDispatch()
  const colours = useSelector(selectColourPaletteColours)
  const canAddColour = useSelector(selectCanAddColour)
  const maximumColoursToExtract = calculateMaximumColoursToExtract(action, colours)
  const imageSrc = useSelector(selectImageSrc)

  function handleNumberChange(event: ChangeEvent<HTMLInputElement>): void {
    setValidNumberToExtract(action, event.currentTarget.valueAsNumber)
  }

  function handleActionChange(newAction: ActionType) {
    setAction(newAction)
    setValidNumberToExtract(newAction, numberOfColoursToExtract)
  }

  function setValidNumberToExtract(currentAction: ActionType, currentValue: number) {
    let value = currentValue
    const maximum = calculateMaximumColoursToExtract(currentAction, colours)
    if (value > maximum) value = maximum
    if (value < 1) value = 1

    setNumberOfColoursToExtract(value)
  }

  function handleAddButtonClick(): void {
    setValidNumberToExtract(action, numberOfColoursToExtract + 1)
  }

  function handleSubtractButtonClick(): void {
    setValidNumberToExtract(action, numberOfColoursToExtract - 1)
  }

  function handleExtractClick() {
    if (!imageSrc) return
    const image = new Image()
    image.onload = function () {
      const colours = new ColorThief()
        .getPalette(image, numberOfColoursToExtract, 1)
        .map((x) => createColour(x[0], x[1], x[2]))

      colours.sort(compareColours)
      const hexes = colours.map((x) => x.hex)
      switch (action) {
        case 'addColours':
          dispatch(coloursAdded({hexes}))
          break
        case 'replaceColours':
          dispatch(coloursReplaced({hexes}))
          break
      }
      localStorage.numberOfColoursToExtract = numberOfColoursToExtract
      onClose?.()
    }
    image.src = imageSrc
  }

  return (
    <div className={classes.extractcolours} data-testid={TestIds.Self}>
      <div className={classes['extractcolours-fields']}>
        <div className={clsx(classes['extractcolours-field'], classes['extractcolours-number'])}>
          <label htmlFor="numberofcolours" className={classes['extractcolours-numberlabel']}>
            Number of colours to extract from image
          </label>
          <div
            className={clsx(
              classes['extractcolours-numbercontrol'],
              numberControlHasFocus && classes['extractcolours-numbercontrol--focus']
            )}
            data-testid={TestIds.NumberControl}
          >
            <button
              className={clsx(
                'iconbutton',
                classes['extractcolours-numberstep'],
                classes['extractcolours-numberstep--down'],
                'fas',
                'fa-minus'
              )}
              disabled={numberOfColoursToExtract <= 1}
              onClick={handleSubtractButtonClick}
              data-testid={TestIds.SubtractButton}
            ></button>
            <input
              id="numberofcolours"
              type="number"
              min="1"
              max={maximumColoursToExtract}
              value={numberOfColoursToExtract}
              className={classes['extractcolours-numberinput']}
              tabIndex={100}
              autoFocus={true}
              onChange={handleNumberChange}
              onFocus={() => {
                setNumberControlHasFocus(true)
              }}
              onBlur={() => {
                setNumberControlHasFocus(false)
              }}
              data-testid={TestIds.NumberInput}
            />
            <button
              className={clsx(
                'iconbutton',
                classes['extractcolours-numberstep'],
                classes['extractcolours-numberstep--up'],
                'fas',
                'fa-plus'
              )}
              disabled={numberOfColoursToExtract >= maximumColoursToExtract}
              onClick={handleAddButtonClick}
              data-testid={TestIds.AddButton}
            ></button>
          </div>
        </div>
        <div className="extractcolours-field extractcolours-action">
          <input
            id="replacecolours"
            type="radio"
            name="action"
            value="replaceColours"
            checked={action === 'replaceColours'}
            onChange={(e) => {
              if (e.target.checked) handleActionChange('replaceColours')
            }}
            className={classes['extractcolours-actioninput']}
            tabIndex={101}
            data-testid={TestIds.ReplaceColours}
          />
          <label htmlFor="replacecolours" className={classes['extractcolours-actionlabel']}>
            <span className="extractcolours-radio"></span>Replace existing colours
          </label>
        </div>
        <div
          className={clsx(
            classes['extractcolours-field extractcolours-action'],
            !canAddColour && classes['extractcolours-field--disabled']
          )}
        >
          <input
            id="addcolours"
            type="radio"
            name="action"
            value="addColours"
            checked={action === 'addColours'}
            disabled={!canAddColour}
            onChange={(e) => {
              if (e.target.checked) handleActionChange('addColours')
            }}
            className={classes['extractcolours-actioninput']}
            tabIndex={102}
            data-testid={TestIds.AddColours}
          />
          <label
            htmlFor="addcolours"
            className={classes['extractcolours-actionlabel']}
            title={canAddColour ? '' : 'The colour palette is already full'}
          >
            <span className={classes['extractcolours-radio']}></span>Add to existing colours
          </label>
        </div>
      </div>
      <button
        onClick={handleExtractClick}
        className={clsx(
          classes['extractcolours-button'],
          classes['extractcolours-button--extract']
        )}
        data-testid={TestIds.ExtractButton}
      >
        Extract
      </button>
      <button
        onClick={() => {
          onClose?.()
        }}
        className={clsx(classes['extractcolours-button'], classes['extractcolours-button--cancel'])}
        data-testid={TestIds.CancelButton}
      >
        Cancel
      </button>
    </div>
  )
}
