import ColourPaletteColourList from '../ColourPaletteColourList/ColourPaletteColourList'
import ImageColourPicker from '../ImageColourPicker/ImageColourPicker'
import ColourPalettePreview from '../ColourPalettePreview/ColourPalettePreview'
import classes from './ColourPaletteEditor.module.less'
import clsx from 'clsx'
import {selectColourPaletteIsOpen} from 'src/stores/colourPaletteSlice'
import {useSelector} from 'react-redux'
import ColourPaletteActions from '../ColourPaletteActions/ColourPaletteActions'
import ColourPaletteType from '../ColourPaletteType/ColourPaletteType'
import ColourPaletteName from '../ColourPaletteName/ColourPaletteName'
import {default as TestIds} from './ColourPaletteEditorTestIds'

export default function ColourPaletteEditor() {
  const paletteIsOpen = useSelector(selectColourPaletteIsOpen)

  return (
    <div className={classes.paletteeditor} data-testid={TestIds.Self}>
      <div className={classes['paletteeditor-editor']}>
        <div className={classes.colourpalette}>
          <div className={classes['colourpalette-toolbar']}>
            {
              /* This should really only be shown when editing a TPS file */
              !paletteIsOpen && (
                <button
                  className={clsx(classes.back, 'iconbutton', 'fas', 'fa-arrow-left')}
                  title="Back"
                  data-testid={TestIds.TpsBack}
                ></button>
              )
            }
          </div>
          <div className={classes['colourpalette-name']}>
            <ColourPaletteName tabIndex={1} />
          </div>
          <div className={classes['colourpalette-type']}>
            <ColourPaletteType tabIndex={2} />
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
              <div className={classes['colourpalette-buttons']} data-testid={TestIds.TpsButtons}>
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
  )
}
