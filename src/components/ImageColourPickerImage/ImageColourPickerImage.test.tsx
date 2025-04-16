import {describe, expect, it, test} from 'vitest'
import {default as TestIds} from './ImageColourPickerImageTestIds'
import classes from './ImageColourPickerImage.module.less'
import ImageColourPickerImage from './ImageColourPickerImage'
import {screen, render} from '@testing-library/react'
import {mockCanvasImageData, testImage, userEvent} from 'src/testing/test-utils'

describe('Image colour picker image', () => {
  interface RenderProps {
    scale?: number
    canPickColour?: boolean
    onColourPicked?: (colour: string) => void
    canvasColour?: string | {x: number; y: number; rgba: string}[]
  }

  function renderImage({
    scale = 1,
    canPickColour = true,
    onColourPicked,
    canvasColour,
  }: RenderProps) {
    if (canvasColour) mockCanvasImageData(canvasColour)

    render(
      <ImageColourPickerImage
        image={testImage}
        scale={scale}
        canPickColour={canPickColour}
        onColourPicked={onColourPicked}
      />
    )
  }

  it('renders as a div', () => {
    renderImage({})

    expect(screen.getByTestId(TestIds.Self)).toBeInstanceOf(HTMLDivElement)
    expect(screen.getByTestId(TestIds.Self)).toHaveClass(classes.scalableimage)
  })

  it('has active class when can pick colour', () => {
    renderImage({canPickColour: true})

    expect(screen.getByTestId(TestIds.Container)).toHaveClass(
      classes['scalableimage-image--active']
    )
  })

  it('does not have active class when cannot pick colour', () => {
    renderImage({canPickColour: false})

    expect(screen.getByTestId(TestIds.Container)).not.toHaveClass(
      classes['scalableimage-image--active']
    )
  })

  test.for([{scale: 1}, {scale: 2}, {scale: 0.5}])(
    'renders image with a scale of $scale',
    ({scale}) => {
      renderImage({scale})

      const canvas = screen.getByTestId<HTMLCanvasElement>(TestIds.Canvas)
      expect(canvas).toBeInstanceOf(HTMLCanvasElement)
      expect(canvas.getAttribute('width')).toBe((300 * scale).toString())
      expect(canvas.getAttribute('height')).toBe((200 * scale).toString())
      expect(canvas.getContext('2d')?.getTransform()).toEqual(
        new DOMMatrix([1, 0, 0, 1, 0, 0]).scale(scale)
      )
    }
  )

  it('does not show swatch when mouse is not over image', () => {
    renderImage({canPickColour: true})

    expect(screen.queryByTestId(TestIds.Swatch)).not.toBeInTheDocument()
  })

  it('shows swatch when mouse is over opaque part of image', async () => {
    renderImage({canPickColour: true, canvasColour: [{x: 20, y: 45, rgba: '#FF0000'}]})

    await userEvent.pointer({
      target: screen.getByTestId(TestIds.Canvas),
      coords: {offsetX: 20, offsetY: 45},
    })

    expect(screen.queryByTestId(TestIds.Swatch)).toBeInTheDocument()
    expect(screen.getByTestId(TestIds.Swatch)).toHaveStyle({
      backgroundColor: '#FF0000',
      top: '5px',
      left: '30px',
    })
  })

  it('shows swatch when mouse is over opaque part of image and cannot pick colour', async () => {
    renderImage({canPickColour: false, canvasColour: '#FFFFFF'})

    await userEvent.pointer({
      target: screen.getByTestId(TestIds.Canvas),
      coords: {offsetX: 20, offsetY: 45},
    })

    expect(screen.queryByTestId(TestIds.Swatch)).not.toBeInTheDocument()
  })

  it('hides swatch when mouse is over transparent part of image', async () => {
    renderImage({
      canPickColour: true,
      canvasColour: [
        {x: 20, y: 45, rgba: '#FF0000'},
        {x: 210, y: 102, rgba: '#FFFFFF00'},
      ],
    })

    await userEvent.pointer({
      target: screen.getByTestId(TestIds.Canvas),
      coords: {offsetX: 20, offsetY: 45},
    })
    await userEvent.pointer({
      target: screen.getByTestId(TestIds.Canvas),
      coords: {offsetX: 210, offsetY: 102},
    })

    expect(screen.queryByTestId(TestIds.Swatch)).not.toBeInTheDocument()
  })

  it('hides swatch when mouse leaves image', async () => {
    renderImage({
      canPickColour: true,
      canvasColour: '#000000',
    })

    await userEvent.pointer({
      target: screen.getByTestId(TestIds.Canvas),
      coords: {offsetX: 100, offsetY: 150},
    })
    await userEvent.pointer({
      target: screen.getByTestId(TestIds.Self),
      coords: {offsetX: 0, offsetY: 0},
    })

    expect(screen.queryByTestId(TestIds.Swatch)).not.toBeInTheDocument()
  })

  it('picks colour when image colour clicked', async () => {
    let pickedColour = ''
    renderImage({
      canPickColour: true,
      onColourPicked: (c) => {
        pickedColour = c
      },
      canvasColour: [
        {x: 20, y: 45, rgba: '#FF0000'},
        {x: 125, y: 100, rgba: '#000000'},
        {x: 125, y: 99, rgba: '#00FF00'},
      ],
    })

    await userEvent.pointer({
      target: screen.getByTestId(TestIds.Canvas),
      coords: {offsetX: 20, offsetY: 45},
    })
    await userEvent.pointer({
      target: screen.getByTestId(TestIds.Canvas),
      coords: {offsetX: 125, offsetY: 100},
    })
    await userEvent.pointer({
      target: screen.getByTestId(TestIds.Canvas),
      coords: {offsetX: 125, offsetY: 99},
      keys: '[MouseLeft]',
    })

    expect(pickedColour).toBe('#00FF00')
  })

  it('does not pick colour when transparent part of image clicked', async () => {
    let pickedColour = false
    renderImage({
      canPickColour: true,
      onColourPicked: () => {
        pickedColour = true
      },
      canvasColour: [{x: 125, y: 99, rgba: '#00FF0000'}],
    })

    await userEvent.pointer({
      target: screen.getByTestId(TestIds.Canvas),
      coords: {offsetX: 125, offsetY: 99},
      keys: '[MouseLeft]',
    })

    expect(pickedColour).toBe(false)
  })

  it('does not pick colour when cannot pick colour', async () => {
    let pickedColour = false
    renderImage({
      canPickColour: false,
      onColourPicked: () => {
        pickedColour = true
      },
      canvasColour: [{x: 125, y: 99, rgba: '#00FF00'}],
    })

    await userEvent.pointer({
      target: screen.getByTestId(TestIds.Canvas),
      coords: {offsetX: 125, offsetY: 99},
      keys: '[MouseLeft]',
    })

    expect(pickedColour).toBe(false)
  })
})
