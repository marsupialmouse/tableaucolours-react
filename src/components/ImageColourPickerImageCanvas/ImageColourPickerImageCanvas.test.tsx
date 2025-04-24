import {describe, expect, it, test} from 'vitest'
import {default as TestIds} from './ImageColourPickerImageCanvasTestIds'
import {default as ImageTestIds} from '../ImageColourPickerImage/ImageColourPickerImageTestIds'
import classes from './ImageColourPickerImageCanvas.module.less'
import ImageColourPickerImageCanvas from './ImageColourPickerImageCanvas'
import {screen, render, fireEvent} from '@testing-library/react'
import {testImage, userEvent} from 'src/testing/test-utils'
import {eventBus} from 'src/utils/EventBus'

describe('Image colour picker image canvas', () => {
  interface RenderProps {
    canPickColour?: boolean
    hasImage?: boolean
    scale?: number
    onColourPicked?: (colour: string) => void
    onFileDropped?: (files: File[]) => void
    onScaleChanged?: (scale: number) => void
  }

  function renderCanvas({
    canPickColour = true,
    hasImage = false,
    scale = 1,
    onColourPicked,
    onFileDropped,
    onScaleChanged,
  }: RenderProps) {
    render(
      <>
        <ImageColourPickerImageCanvas
          image={hasImage ? testImage : undefined}
          scale={scale}
          canPickColour={canPickColour}
          onColourPicked={onColourPicked}
          onFileDropped={onFileDropped}
          onScaleChanged={onScaleChanged}
        />
        <div data-testid="notdragtarget">
          <h1>Not a drag target!</h1>
        </div>
      </>
    )
  }

  it('renders as a div', () => {
    renderCanvas({})

    expect(screen.getByTestId(TestIds.Self)).toBeInstanceOf(HTMLDivElement)
    expect(screen.getByTestId(TestIds.Self)).toHaveClass(classes.imagecanvas)
  })

  it('does not render image component when there is no image', () => {
    renderCanvas({hasImage: false})

    expect(screen.queryByTestId(ImageTestIds.Self)).not.toBeInTheDocument()
  })

  it('renders image component when there is an image', () => {
    renderCanvas({hasImage: true})

    expect(screen.queryByTestId(ImageTestIds.Self)).toBeInTheDocument()
  })

  it('renders hint when no image selected', () => {
    renderCanvas({hasImage: false, canPickColour: false})

    expect(screen.queryByTestId(TestIds.Hint)).toBeInTheDocument()
    expect(screen.getByTestId(TestIds.Hint)).toHaveTextContent(
      /^Open, paste or drop an image to get started$/i
    )
  })

  it('renders hint when image exists but cannot pick colour', () => {
    renderCanvas({hasImage: true, canPickColour: false})

    expect(screen.queryByTestId(TestIds.Hint)).toBeInTheDocument()
    expect(screen.getByTestId(TestIds.Hint)).toHaveTextContent(
      /^Select a colour in the palette to pick colours from the image$/i
    )
  })

  it('does not render hint when image exists and can pick colour', () => {
    renderCanvas({hasImage: true, canPickColour: true})

    expect(screen.queryByTestId(TestIds.Hint)).not.toBeInTheDocument()
  })

  it('does not have drop class when dragging not active', () => {
    renderCanvas({})

    expect(screen.getByTestId(TestIds.Self)).not.toHaveClass(classes['imagecanvas--drop'])
  })

  it('adds drop class when image file dragged into component', () => {
    renderCanvas({})

    fireEvent.dragEnter(screen.getByTestId(TestIds.Self), {
      dataTransfer: {items: [{kind: 'file', type: 'image/jpeg'}]},
    })

    expect(screen.getByTestId(TestIds.Self)).toHaveClass(classes['imagecanvas--drop'])
  })

  it('adds drop class when image file dragged over component', () => {
    renderCanvas({})

    fireEvent.dragOver(screen.getByTestId(TestIds.Self), {
      dataTransfer: {items: [{kind: 'file', type: 'image/png'}]},
    })

    expect(screen.getByTestId(TestIds.Self)).toHaveClass(classes['imagecanvas--drop'])
  })

  it('does not add drop class when non-image file dragged over component', () => {
    renderCanvas({})

    fireEvent.dragOver(screen.getByTestId(TestIds.Self), {
      dataTransfer: {items: [{kind: 'file', type: 'text/plain'}]},
    })

    expect(screen.getByTestId(TestIds.Self)).not.toHaveClass(classes['imagecanvas--drop'])
  })

  it('removes drop class when drag leaves drop target', () => {
    renderCanvas({})

    fireEvent.dragEnter(screen.getByTestId(TestIds.Self), {
      dataTransfer: {items: [{kind: 'file', type: 'image/jpeg'}]},
    })
    fireEvent.dragLeave(screen.getByTestId(TestIds.DropTarget))

    expect(screen.getByTestId(TestIds.Self)).not.toHaveClass(classes['imagecanvas--drop'])
  })

  it('removes drop class when files dropped', () => {
    renderCanvas({})

    fireEvent.dragEnter(screen.getByTestId(TestIds.Self), {
      dataTransfer: {items: [{kind: 'file', type: 'image/jpeg'}]},
    })
    fireEvent.drop(screen.getByTestId(TestIds.Self), {
      dataTransfer: {
        items: [{kind: 'file', type: 'image/jpeg'}],
        files: [new File(['hello'], 'hello.png', {type: 'image/png'})],
      },
    })

    expect(screen.getByTestId(TestIds.Self)).not.toHaveClass(classes['imagecanvas--drop'])
  })

  it('does not remove drop class when drag leaves an element other than drop target', () => {
    renderCanvas({})

    fireEvent.dragEnter(screen.getByTestId(TestIds.Self), {
      dataTransfer: {items: [{kind: 'file', type: 'image/jpeg'}]},
    })
    fireEvent.dragLeave(screen.getByTestId(TestIds.Self))

    expect(screen.getByTestId(TestIds.Self)).toHaveClass(classes['imagecanvas--drop'])
  })

  test.for([{id: TestIds.Self}, {id: TestIds.DropTarget}])(
    "triggers onFileDropped when file is dropped on '$id'",
    ({id}) => {
      let eventFiles = [] as File[]
      const files = [
        new File(['hello'], 'hello.txt', {type: 'text/plain'}),
        new File(['hello'], 'hello.xml', {type: 'application/xml'}),
      ]
      renderCanvas({
        onFileDropped: (f) => {
          eventFiles = f
        },
      })

      fireEvent.drop(screen.getByTestId(id), {
        dataTransfer: {files},
      })

      expect(eventFiles).toEqual(files)
    }
  )

  it('does not trigger onFileDropped if no files dropped', () => {
    let onFileDroppedWasCalled = false
    renderCanvas({
      onFileDropped: () => {
        onFileDroppedWasCalled = true
      },
    })

    fireEvent.drop(screen.getByTestId(TestIds.DropTarget), {
      dataTransfer: {items: [{kind: 'string', type: 'text'}], files: []},
    })

    expect(onFileDroppedWasCalled).toBeFalsy()
  })

  it('does not trigger onFileDropped when file dropped on wrong target', () => {
    let onFileDroppedWasCalled = false
    const items = [{kind: 'file', type: 'image/jpeg'}]
    const files = [new File(['hello'], 'hello.jpg', {type: 'image/jpeg'})]
    renderCanvas({
      onFileDropped: () => {
        onFileDroppedWasCalled = true
      },
    })

    fireEvent.dragEnter(screen.getByTestId(TestIds.Self), {
      dataTransfer: {items, files},
    })
    fireEvent.drop(screen.getByTestId('notdragtarget'), {
      dataTransfer: {items, files},
    })

    expect(onFileDroppedWasCalled).toBeFalsy()
  })

  test.for([
    {deltaY: 8, deltaX: -1, scale: 1},
    {deltaY: 2, deltaX: 0, scale: 0.5},
    {deltaY: -1, deltaX: 6, scale: 1},
    {deltaY: -22, deltaX: 0, scale: 2},
  ])(
    'triggers scaling when Shift clicked and wheel scrolls up or down',
    ({deltaX, deltaY, scale}) => {
      let triggeredScale = 0
      renderCanvas({
        scale: scale,
        onScaleChanged: (s) => {
          triggeredScale = s
        },
      })

      fireEvent.wheel(screen.getByTestId(TestIds.Image), {deltaX, deltaY, shiftKey: true})

      expect(triggeredScale).toBe(deltaY > 0 ? scale * 0.9 : scale * 1.1)
    }
  )

  it('does not trigger scaling when the wheel does not scroll up or down', () => {
    let scaleTriggered = false
    renderCanvas({
      scale: 1,
      onScaleChanged: () => {
        scaleTriggered = true
      },
    })

    fireEvent.wheel(screen.getByTestId(TestIds.Image), {deltaX: 1, deltaY: 0, shiftKey: true})

    expect(scaleTriggered).toBeFalsy()
  })

  it('does not trigger scaling when Shift not pressed', () => {
    let scaleTriggered = false
    renderCanvas({
      scale: 1,
      onScaleChanged: () => {
        scaleTriggered = true
      },
    })

    fireEvent.wheel(screen.getByTestId(TestIds.Image), {deltaX: 0, deltaY: 1, shiftKey: false})

    expect(scaleTriggered).toBeFalsy()
  })

  test.for([{key: 'ctrlKey'}, {key: 'altKey'}, {key: 'metaKey'}])(
    'does not trigger scaling when $key pressed',
    ({key}) => {
      let scaleTriggered = false
      renderCanvas({
        scale: 1,
        onScaleChanged: () => {
          scaleTriggered = true
        },
      })

      fireEvent.wheel(screen.getByTestId(TestIds.Image), {
        deltaX: 0,
        deltaY: 1,
        shiftKey: true,
        [key]: true,
      })

      expect(scaleTriggered).toBeFalsy()
    }
  )

  it('publishes event to bus when open file link clicked', async () => {
    let eventPublished = false
    renderCanvas({})
    eventBus.on('openImageFile', () => {
      eventPublished = true
    })

    await userEvent.click(screen.getByTestId(TestIds.OpenFile))

    expect(eventPublished).toBeTruthy()
  })
})
