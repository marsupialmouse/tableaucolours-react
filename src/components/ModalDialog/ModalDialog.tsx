import {memo, useEffect, useRef} from 'react'
import {createPortal} from 'react-dom'
import classes from './ModalDialog.module.less'
import clsx from 'clsx'
import {default as TestIds} from './ModalDialogTestIds'

export interface ModalDialogProps {
  isOpen: boolean
  onClose: () => void
  width?: string | undefined
  children: React.ReactNode
}

const ModalDialog = memo(function ModalDialog({
  isOpen,
  onClose,
  width,
  children,
}: ModalDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const modalRoot = document.getElementById('modals')

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (
        event.key === 'Escape' &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault()
        event.stopPropagation()
        dialog.current?.close()
        onClose()
      }
    }

    if (!isOpen || !dialog.current) return

    window.addEventListener('keyup', handleKeyPress, false)
    dialog.current.showModal()

    return () => {
      window.removeEventListener('keyup', handleKeyPress)
    }
  }, [isOpen, dialog, onClose])

  function handleCloseClick(e: React.MouseEvent): void {
    e.preventDefault()
    e.stopPropagation()

    dialog.current?.close()
    onClose()
  }

  function handleMouseDown(e: React.MouseEvent): void {
    if (e.target === e.currentTarget) {
      dialog.current?.close()
      onClose()
    }
  }

  return (
    <>
      {isOpen &&
        createPortal(
          <dialog ref={dialog} onMouseDown={handleMouseDown} data-testid={TestIds.Self}>
            <div className={classes['modal-container']} style={width ? {width} : {}}>
              <button
                className={clsx(classes['modal-close'], 'iconbutton', 'fas', 'fa-times')}
                onClick={handleCloseClick}
                data-testid={TestIds.CloseButton}
              ></button>
              {children}
            </div>
          </dialog>,
          modalRoot ?? document.body
        )}
    </>
  )
})

export default ModalDialog
