import ColourPaletteColourList from '../ColourPaletteColourList/ColourPaletteColourList'
import ImageColourPicker from '../ImageColourPicker/ImageColourPicker'
import ColourPalettePreview from '../ColourPalettePreview/ColourPalettePreview'
import classes from './ColourPaletteEditor.module.less'
import clsx from 'clsx'
import {
  paletteNameChanged,
  selectColourPaletteIsOpen,
  selectColourPaletteName,
} from 'src/stores/colourPaletteSlice'
import {useSelector} from 'react-redux'
import {useAppDispatch} from 'src/stores/hooks'
import ColourPaletteActions from '../ColourPaletteActions/ColourPaletteActions'
import ColourPaletteType from '../ColourPaletteType/ColourPaletteType'

export default function ColourPaletteEditor() {
  const dispatch = useAppDispatch()
  const paletteName = useSelector(selectColourPaletteName)
  const paletteIsOpen = useSelector(selectColourPaletteIsOpen)

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch(paletteNameChanged({name: event.target.value}))
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
              <ColourPaletteType />
            </div>
            <div className={classes['colourpalette-colours']}>
              <ColourPaletteColourList />
            </div>
            <div className={classes['colourpalette-preview']}>
              <ColourPalettePreview />
            </div>
            <div className={classes['colourpalette-actions']}>
              <ColourPaletteActions />
            </div>
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
      </div>
    </>
  )
}
