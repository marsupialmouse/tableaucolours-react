import {describe, expect, it, test} from 'vitest'
import {default as TestIds} from './ImageZoomTestIds'
import ImageZoom from './ImageZoom'
import {screen, render, fireEvent} from '@testing-library/react'
import {userEvent} from 'src/testing/test-utils'

describe('Image colour picker image canvas', () => {
  const defaultRange = {min: 0.1, max: 10}

  it('renders as a div', () => {
    render(<ImageZoom scale={1} range={defaultRange} enabled={true} />)

    expect(screen.getByTestId(TestIds.Self)).toBeInstanceOf(HTMLDivElement)
  })

  it('has enabled controls when enabled', () => {
    render(<ImageZoom scale={1} range={defaultRange} enabled={true} />)

    expect(screen.getByTestId(TestIds.ZoomIn)).toBeEnabled()
    expect(screen.getByTestId(TestIds.ZoomOut)).toBeEnabled()
    expect(screen.getByTestId(TestIds.Slider)).toBeEnabled()
  })

  it('has disabled controls when not enabled', () => {
    render(<ImageZoom scale={1} range={defaultRange} enabled={false} />)

    expect(screen.getByTestId(TestIds.ZoomIn)).toBeDisabled()
    expect(screen.getByTestId(TestIds.ZoomOut)).toBeDisabled()
    expect(screen.getByTestId(TestIds.Slider)).toBeDisabled()
  })

  it('shows current scale as a rounded percentage', () => {
    render(<ImageZoom scale={0.733333} range={defaultRange} enabled={false} />)

    expect(screen.getByTestId(TestIds.Percentage)).toHaveTextContent('73%')
  })

  test.for([
    {scale: 1, slider: 50},
    {scale: 0.1, slider: 1},
    {scale: 10, slider: 100},
    {scale: 0.5, slider: 23},
    {scale: 6, slider: 78},
  ])('has a slider value of $slider for a scale of $scale', ({scale, slider}) => {
    render(<ImageZoom scale={scale} range={{min: 0.1, max: 10}} enabled={true} />)

    expect(screen.getByTestId(TestIds.Slider)).toHaveValue(slider.toString())
  })

  it('multiplies scale by 1.1 when zoom in clicked', async () => {
    const scale = 4.2
    let changedScale = 0
    render(
      <ImageZoom
        scale={scale}
        range={defaultRange}
        enabled={true}
        onScaleChanged={(c) => {
          changedScale = c
        }}
      />
    )

    await userEvent.click(screen.getByTestId(TestIds.ZoomIn))

    expect(changedScale).toBe(scale * 1.1)
  })

  it('multiplies scale by 0.9 when zoom in clicked', async () => {
    const scale = 4.2
    let changedScale = 0
    render(
      <ImageZoom
        scale={scale}
        range={defaultRange}
        enabled={true}
        onScaleChanged={(c) => {
          changedScale = c
        }}
      />
    )

    await userEvent.click(screen.getByTestId(TestIds.ZoomOut))

    expect(changedScale).toBe(scale * 0.9)
  })

  test.for([
    {scale: 0.1, slider: 1},
    {scale: 10, slider: 100},
    {scale: 0.5224489795918367, slider: 24},
    {scale: 6.04, slider: 78},
  ])('triggers scaleChanged when slider changes', ({scale, slider}) => {
    let changedScale = 0
    render(
      <ImageZoom
        scale={1}
        range={{min: 0.1, max: 10}}
        enabled={true}
        onScaleChanged={(s) => {
          changedScale = s
        }}
      />
    )

    fireEvent.change(screen.getByTestId(TestIds.Slider), {target: {value: slider.toString()}})

    expect(changedScale).toBe(scale)
  })
})
