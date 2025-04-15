import {describe, expect, it} from 'vitest'
import {default as TestIds} from './ImageColourPickerImageTestIds'
import classes from './ImageColourPickerImage.module.less'
import ImageColourPickerImage from './ImageColourPickerImage'
import {screen, render} from '@testing-library/react'

describe('Image colour picker image', () => {
  // A 300x200 image with equal squares of red, green, blue and white on the top row, and white, black and clear on the bottom
  const image = new Image(300, 200)
  image.src =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADIBAMAAACg8cFmAAAAE' +
    'lBMVEVHcEwAAP//////AAAAAAAA/wB8gMCjAAAAAXRSTlMAQObYZgAAAJ1JREFUeNrtzjEN' +
    'ADAMBLGGSiiEfsAVw2+V6ttPcs1J6/jY+CgsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCw' +
    'sLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLKwPWY2FhYWFhYWFhYWFhYWFhYWFhYWFhY' +
    'WFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYX1BusCm3fPbX13kEEAAAAASUVORK5CYII='

  it('renders as a div', () => {
    render(<ImageColourPickerImage image={image} scale={1} canPickColour={false} />)

    expect(screen.getByTestId(TestIds.Self)).toBeInstanceOf(HTMLDivElement)
    expect(screen.getByTestId(TestIds.Self)).toHaveClass(classes.scalableimage)
  })

  it('has active class when can pick colour', () => {
    render(<ImageColourPickerImage image={image} scale={1} canPickColour={true} />)

    expect(screen.getByTestId(TestIds.Container)).toHaveClass(
      classes['scalableimage-image--active']
    )
  })

  it('does not has active class when cannot pick colour', () => {
    render(<ImageColourPickerImage image={image} scale={1} canPickColour={false} />)

    expect(screen.getByTestId(TestIds.Container)).not.toHaveClass(
      classes['scalableimage-image--active']
    )
  })
})
