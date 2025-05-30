import {KeyboardEvent, useEffect, useRef, useState} from 'react'
import {ColourPaletteType, ColourPaletteTypes} from 'src/types/ColourPaletteTypes'
import classes from './ColourPaletteTypeSelector.module.less'
import {default as TestIds} from './ColourPaletteTypeSelectorTestIds'
import {clsx} from 'clsx'
import ColourPaletteTypeSelectorItem from '../ColourPaletteTypeSelectorItem/ColourPaletteTypeSelectorItem'

export interface ColourPaletteTypeSelectorProps {
  selectedType: ColourPaletteType
  onTypeSelected?: (type: ColourPaletteType) => void
  tabIndex?: number // Keyboard/focus events only work if tabIndex is set
}

const types = [
  ColourPaletteTypes.regular,
  ColourPaletteTypes.sequential,
  ColourPaletteTypes.diverging,
]

export default function ColourPaletteTypeSelector({
  selectedType,
  onTypeSelected,
  tabIndex = -1,
}: ColourPaletteTypeSelectorProps) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)

  const selectedElement = useRef<HTMLDivElement | null>(null)

  const selectorClasses = clsx(
    classes['palettetypes-list'],
    isSelectorOpen && classes['palettetypes-list--open']
  )

  useEffect(() => {
    if (isSelectorOpen) {
      const closeSelector = () => {
        setIsSelectorOpen(false)
      }
      window.addEventListener('click', closeSelector, false)
      return () => {
        window.removeEventListener('click', closeSelector)
      }
    }
  }, [isSelectorOpen])

  function toggleSelector() {
    setIsSelectorOpen(!isSelectorOpen)
  }

  function handleKeyUp(e: KeyboardEvent<HTMLDivElement>) {
    if (e.altKey || e.ctrlKey || e.metaKey) return

    switch (e.key) {
      case 'ArrowDown':
        arrowDown()
        break
      case 'ArrowUp':
        arrowUp()
        break
      case 'Enter':
        toggleSelector()
        break
      default:
        return
    }

    e.preventDefault()
    e.stopPropagation()
  }

  function arrowDown() {
    const selectedIndex = types.findIndex((x) => x === selectedType)
    if (selectedIndex < types.length - 1) {
      onTypeSelected?.(types[selectedIndex + 1])
    }
  }

  function arrowUp() {
    const selectedIndex = types.findIndex((x) => x === selectedType)
    if (selectedIndex > 0) {
      onTypeSelected?.(types[selectedIndex - 1])
    }
  }

  function handleTypeClick(type: ColourPaletteType) {
    onTypeSelected?.(type)
    selectedElement.current?.focus()
    setIsSelectorOpen(false)
  }

  function stopPropagation(event: React.MouseEvent) {
    event.stopPropagation()
  }

  return (
    <div
      className={classes.palettetypes}
      data-testid={TestIds.Self}
      onKeyUp={handleKeyUp}
      onClick={stopPropagation}
    >
      <div
        ref={selectedElement}
        className={classes['palettetypes-select']}
        tabIndex={tabIndex >= 0 ? tabIndex : undefined}
        onClick={toggleSelector}
        data-testid={TestIds.Selected}
      >
        <div className={classes['palettetypes-selectedtype']}>
          <ColourPaletteTypeSelectorItem type={selectedType} />
        </div>
        <div className={classes['palettetypes-selectindicator']}>
          <span className="fas fa-chevron-down"></span>
        </div>
      </div>
      <ul className={selectorClasses} data-testid={TestIds.Selector}>
        {types.map((type) => {
          const itemClasses = clsx(
            classes['palettetypes-type'],
            type === selectedType && classes['palettetypes-type--selected']
          )
          return (
            <li
              key={type.id}
              className={itemClasses}
              onClick={() => {
                handleTypeClick(type)
              }}
            >
              <ColourPaletteTypeSelectorItem type={type} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
