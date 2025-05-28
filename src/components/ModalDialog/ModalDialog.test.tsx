import {describe, it, expect, vi, beforeAll} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'
import ModalDialog from './ModalDialog'
import {default as TestIds} from './ModalDialogTestIds'
import {userEvent} from 'src/testing/test-utils'

describe('Modal dialog component', () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.show = vi.fn()
    HTMLDialogElement.prototype.showModal = vi.fn()
    HTMLDialogElement.prototype.close = vi.fn()
  })

  it('renders the dialog when isOpen is true', () => {
    render(
      <ModalDialog isOpen={true} onClose={vi.fn()} width="400px">
        <p>Test Content</p>
      </ModalDialog>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('does not render the dialog when isOpen is false', () => {
    render(
      <ModalDialog isOpen={false} onClose={vi.fn()} width="400px">
        <p>Test Content</p>
      </ModalDialog>
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn()
    render(
      <ModalDialog isOpen={true} onClose={onClose} width="400px">
        <p>Test Content</p>
      </ModalDialog>
    )

    await userEvent.click(screen.getByTestId(TestIds.CloseButton))

    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when the Escape key is pressed', () => {
    const onClose = vi.fn()
    render(
      <ModalDialog isOpen={true} onClose={onClose} width="400px">
        <p>Test Content</p>
      </ModalDialog>
    )

    fireEvent.keyUp(window, {key: 'Escape'})

    expect(onClose).toHaveBeenCalled()
  })

  it('does not call onClose when the Escape key is pressed in text input', async () => {
    const onClose = vi.fn()
    render(
      <ModalDialog isOpen={true} onClose={onClose} width="400px">
        <input type="text" data-testid="input" />
      </ModalDialog>
    )

    await userEvent.type(screen.getByTestId('input'), '{escape}')

    expect(onClose).not.toHaveBeenCalled()
  })

  it('does not call onClose when the Escape key is pressed in textarea', async () => {
    const onClose = vi.fn()
    render(
      <ModalDialog isOpen={true} onClose={onClose} width="400px">
        <textarea data-testid="input"></textarea>
      </ModalDialog>
    )

    await userEvent.type(screen.getByTestId('input'), '{escape}')

    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when clicking outside the modal', async () => {
    const onClose = vi.fn()
    render(
      <ModalDialog isOpen={true} onClose={onClose} width="400px">
        <p>Test Content</p>
      </ModalDialog>
    )

    await userEvent.click(screen.getByRole('dialog', {hidden: true}))

    expect(onClose).toHaveBeenCalled()
  })

  it('does not call onClose when clicking inside modal', async () => {
    const onClose = vi.fn()
    render(
      <ModalDialog isOpen={true} onClose={onClose} width="400px">
        <button data-testid="button">Click me</button>
      </ModalDialog>
    )

    await userEvent.click(screen.getByTestId('button'))

    expect(onClose).not.toHaveBeenCalled()
  })
})
