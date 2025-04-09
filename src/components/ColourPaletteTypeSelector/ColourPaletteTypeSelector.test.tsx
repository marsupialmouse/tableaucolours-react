import {describe, it, expect, vi, test} from 'vitest'
import {screen, render, waitFor} from '@testing-library/react'
import {userEvent} from '../../test-utils.tsx'
import ColourPaletteTypeSelector from './ColourPaletteTypeSelector'
import {default as TestIds} from './ColourPaletteTypeSelectorTestIds'
import classes from './ColourPaletteTypeSelector.module.less'
import {PaletteTypes} from 'src/state/ColourPalettes/PaletteTypes.ts'

const types = [
  PaletteTypes.regular,
  PaletteTypes.sequential,
  PaletteTypes.diverging,
]

describe('Colour palette type selector', () => {
  it('renders as as a div', () => {
    render(<ColourPaletteTypeSelector selectedType={PaletteTypes.regular} />)

    expect(screen.getByTestId(TestIds.Self)).toBeInstanceOf(HTMLDivElement)
  })

  it('renders all types as options', () => {
    render(<ColourPaletteTypeSelector selectedType={PaletteTypes.regular} />)

    const selector = screen.getByTestId(TestIds.Selector)
    expect(selector).toBeInstanceOf(HTMLUListElement)
    expect(selector.childNodes.length).toEqual(3)
    expect(selector.childNodes[0]).toHaveTextContent(PaletteTypes.regular.name)
    expect(selector.childNodes[1]).toHaveTextContent(
      PaletteTypes.sequential.name
    )
    expect(selector.childNodes[2]).toHaveTextContent(
      PaletteTypes.diverging.name
    )
  })

  it('should not have tabindex on selected type when not set', () => {
    render(<ColourPaletteTypeSelector selectedType={PaletteTypes.regular} />)

    expect(screen.getByTestId(TestIds.Selected)).not.toHaveAttribute('tabindex')
  })

  it('should have tabindex on selected type when set', () => {
    render(
      <ColourPaletteTypeSelector
        selectedType={PaletteTypes.regular}
        tabIndex={13}
      />
    )

    expect(screen.getByTestId(TestIds.Selected)).toHaveAttribute('tabindex')
    expect(
      screen.getByTestId(TestIds.Selected).getAttribute('tabindex')
    ).toEqual('13')
  })

  it('does not show type list when first rendered', () => {
    render(<ColourPaletteTypeSelector selectedType={PaletteTypes.regular} />)

    expect(screen.getByTestId(TestIds.Selector)).not.toHaveClass(
      classes['palettetypes-list--open']
    )
  })

  it('shows type list when selected type is clicked', async () => {
    render(<ColourPaletteTypeSelector selectedType={PaletteTypes.regular} />)

    await userEvent.click(screen.getByTestId(TestIds.Selected))

    expect(await screen.findByTestId(TestIds.Selector)).toHaveClass(
      classes['palettetypes-list--open']
    )
  })

  it('hides type list when open list clicked', async () => {
    render(<ColourPaletteTypeSelector selectedType={PaletteTypes.regular} />)

    await userEvent.click(screen.getByTestId(TestIds.Selected))
    await userEvent.click(screen.getByTestId(TestIds.Selector).children[0])

    expect(screen.getByTestId(TestIds.Selector)).not.toHaveClass(
      classes['palettetypes-list--open']
    )
  })

  it('hides type list without firing event when window is clicked', async () => {
    const mockTypeSelected = vi.fn()
    render(
      <ColourPaletteTypeSelector
        selectedType={PaletteTypes.regular}
        onTypeSelected={mockTypeSelected}
      />
    )

    await userEvent.click(screen.getByTestId(TestIds.Selected))
    await userEvent.click(document.body)

    expect(screen.getByTestId(TestIds.Selector)).not.toHaveClass(
      classes['palettetypes-list--open']
    )
    expect(mockTypeSelected).not.toBeCalled()
  })

  it('does not open type list when window is clicked', async () => {
    render(<ColourPaletteTypeSelector selectedType={PaletteTypes.regular} />)

    await userEvent.click(document.body)

    expect(screen.getByTestId(TestIds.Selector)).not.toHaveClass(
      classes['palettetypes-list--open']
    )
  })

  it('calls onTypeSelected when type is clicked', async () => {
    const mockTypeSelected = vi.fn()

    render(
      <ColourPaletteTypeSelector
        selectedType={PaletteTypes.regular}
        onTypeSelected={mockTypeSelected}
      />
    )

    await userEvent.click(screen.getByTestId(TestIds.Selected))
    await userEvent.click(screen.getByTestId(TestIds.Selector).children[1])

    expect(mockTypeSelected).toHaveBeenCalledOnce()
    expect(mockTypeSelected).toHaveBeenCalledWith(types[1])
  })

  describe('When the down arrow is pressed', () => {
    test.each(
      types.slice(0, -1).map((t, i) => {
        return {selectedType: t, index: i}
      })
    )(
      'the next type is selected when the selected type is $selectedType.name',
      async ({selectedType, index}) => {
        const mockTypeSelected = vi.fn()

        render(
          <ColourPaletteTypeSelector
            selectedType={selectedType}
            onTypeSelected={mockTypeSelected}
            tabIndex={1}
          />
        )

        await userEvent.click(screen.getByTestId(TestIds.Selected))
        await userEvent.keyboard('{arrowdown}')

        expect(mockTypeSelected).toHaveBeenCalledOnce()
        expect(mockTypeSelected).toHaveBeenCalledWith(types[index + 1])
      }
    )

    it(
      'does not select anything when the selected type is ' +
        types[types.length - 1].name,
      async () => {
        const mockTypeSelected = vi.fn()

        render(
          <ColourPaletteTypeSelector
            selectedType={types[types.length - 1]}
            onTypeSelected={mockTypeSelected}
            tabIndex={1}
          />
        )

        await userEvent.click(screen.getByTestId(TestIds.Selected))
        await userEvent.keyboard('{arrowdown}')

        expect(mockTypeSelected).not.toHaveBeenCalled()
      }
    )
  })

  describe('When the up arrow is pressed', () => {
    test.each(
      types.slice(1).map((t, i) => {
        return {selectedType: t, index: i + 1}
      })
    )(
      'the previous type is selected when the selected type is $selectedType.name',
      async ({selectedType, index}) => {
        const mockTypeSelected = vi.fn()

        render(
          <ColourPaletteTypeSelector
            selectedType={selectedType}
            onTypeSelected={mockTypeSelected}
            tabIndex={1}
          />
        )

        await userEvent.click(screen.getByTestId(TestIds.Selected))
        await userEvent.keyboard('{arrowup}')

        expect(mockTypeSelected).toHaveBeenCalledOnce()
        expect(mockTypeSelected).toHaveBeenCalledWith(types[index - 1])
      }
    )

    it(
      'does not select anything when the selected type is ' + types[0].name,
      async () => {
        const mockTypeSelected = vi.fn()

        render(
          <ColourPaletteTypeSelector
            selectedType={types[0]}
            onTypeSelected={mockTypeSelected}
            tabIndex={1}
          />
        )

        await userEvent.click(screen.getByTestId(TestIds.Selected))
        await userEvent.keyboard('{arrowup}')

        expect(mockTypeSelected).not.toHaveBeenCalled()
      }
    )
  })

  describe('When Enter is pressed', () => {
    it('the type list is opened if closed', async () => {
      render(
        <ColourPaletteTypeSelector
          selectedType={PaletteTypes.regular}
          tabIndex={1}
        />
      )

      screen.getByTestId(TestIds.Selected).focus()
      await userEvent.keyboard('{enter}')

      expect(await screen.findByTestId(TestIds.Selector)).toHaveClass(
        classes['palettetypes-list--open']
      )
    })

    it('the type list is closed if open', async () => {
      render(
        <ColourPaletteTypeSelector
          selectedType={PaletteTypes.sequential}
          tabIndex={1}
        />
      )

      await userEvent.click(screen.getByTestId(TestIds.Selected))
      await userEvent.keyboard('{enter}')

      expect(screen.getByTestId(TestIds.Selector)).not.toHaveClass(
        classes['palettetypes-list--open']
      )
    })
  })

  it('gives focus to selected type element when type selected', async () => {
    render(
      <ColourPaletteTypeSelector
        selectedType={PaletteTypes.regular}
        tabIndex={1}
      />
    )

    await userEvent.click(screen.getByTestId(TestIds.Selected))
    await userEvent.click(screen.getByTestId(TestIds.Selector).children[0])

    await waitFor(() =>
      expect(screen.getByTestId(TestIds.Selected)).toHaveFocus()
    )
  })

  describe.each(
    types.map((t, i) => {
      return {selectedType: t, index: i}
    })
  )('When selected type is $selectedType.name', ({selectedType, index}) => {
    it(`shows ${selectedType.name} as the selected type`, () => {
      render(<ColourPaletteTypeSelector selectedType={selectedType} />)

      expect(screen.getByTestId(TestIds.Selected)).toHaveTextContent(
        selectedType.name
      )
    })

    it(`highlights ${selectedType.name} as the selected type in the list`, () => {
      render(<ColourPaletteTypeSelector selectedType={selectedType} />)

      expect(
        screen.getByTestId(TestIds.Selector).childNodes[index]
      ).toHaveClass(classes['palettetypes-type--selected'])
      expect(
        screen
          .getByTestId(TestIds.Selector)
          .getElementsByClassName(classes['palettetypes-type--selected']).length
      ).toBe(1)
    })
  })
})
