import {describe, expect, it} from 'vitest'
import {default as TestIds} from './ImageFileOpenTestIds'
import {screen, render, fireEvent} from '@testing-library/react'
import ImageFileOpen from './ImageFileOpen'

describe('Image file open', () => {
  it('renders as a div', () => {
    render(<ImageFileOpen />)

    expect(screen.getByTestId(TestIds.Self)).toBeInstanceOf(HTMLDivElement)
  })

  it('triggers onFileSelected when files changes', () => {
    let eventFiles = [] as File[]
    const files = [
      new File(['hello'], 'hello.txt', {type: 'text/plain'}),
      new File(['hello'], 'hello.xml', {type: 'application/xml'}),
    ]
    render(
      <ImageFileOpen
        onFileSelected={(f) => {
          eventFiles = f
        }}
      />
    )

    fireEvent.change(screen.getByTestId(TestIds.File), {target: {files}})

    expect(eventFiles).toEqual(files)
  })

  it('does not trigger onFileSelected when file not selected', () => {
    let fileSelected = false
    const files = [] as File[]
    render(
      <ImageFileOpen
        onFileSelected={() => {
          fileSelected = true
        }}
      />
    )

    fireEvent.change(screen.getByTestId(TestIds.File), {target: {files}})

    expect(fileSelected).toBeFalsy()
  })
})
