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
import {memo, ReactNode} from 'react'

interface PaletteSectionProps {
  className: string
  children: ReactNode
}

const EditorSection = memo(function PaletteSection({className, children}: PaletteSectionProps) {
  return <div className={className}>{children}</div>
})

export default function ColourPaletteEditor() {
  const paletteIsOpen = useSelector(selectColourPaletteIsOpen)

  return (
    <div className={classes.paletteeditor} data-testid={TestIds.Self}>
      <div className={classes['paletteeditor-editor']}>
        <div className={classes.colourpalette}>
          <EditorSection className={classes['colourpalette-toolbar']}>
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
          </EditorSection>
          <EditorSection className={classes['colourpalette-name']}>
            <ColourPaletteName tabIndex={1} />
          </EditorSection>
          <EditorSection className={classes['colourpalette-type']}>
            <ColourPaletteType tabIndex={2} />
          </EditorSection>
          <EditorSection className={classes['colourpalette-colours']}>
            <ColourPaletteColourList />
          </EditorSection>
          <EditorSection className={classes['colourpalette-preview']}>
            <ColourPalettePreview />
          </EditorSection>
          <EditorSection className={classes['colourpalette-actions']}>
            <ColourPaletteActions />
          </EditorSection>
          {
            /* This should really only be shown when editing a TPS file */
            !paletteIsOpen && (
              <EditorSection className={classes['colourpalette-buttons']}>
                <button className={classes.button} data-testid={TestIds.TpsCancel}>
                  Cancel
                </button>
                <button className={classes.button} data-testid={TestIds.TpsDone}>
                  Done
                </button>
              </EditorSection>
            )
          }
        </div>
      </div>
      <EditorSection className={classes['paletteeditor-image']}>
        <ImageColourPicker />
      </EditorSection>
    </div>
  )
}
