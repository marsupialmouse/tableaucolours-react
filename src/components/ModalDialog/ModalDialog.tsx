import {useEffect, useRef} from 'react'
import classes from './ModalDialog.module.less'
import clsx from 'clsx'
import {default as TestIds} from './ModalDialogTestIds'

export interface ModalDialogProps {
  isOpen: boolean
  onClose: () => void
  width?: string | undefined
  children: React.ReactNode
}

export default function ModalDialog({isOpen, onClose, width, children}: ModalDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)

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

  return (
    <>
      {isOpen && (
        <dialog ref={dialog} onClick={handleCloseClick} data-testid={TestIds.Self}>
          <div
            className={classes['modal-container']}
            style={width ? {width} : {}}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <button
              className={clsx(classes['modal-close'], 'iconbutton', 'fas', 'fa-times')}
              onClick={handleCloseClick}
              data-testid={TestIds.CloseButton}
            ></button>
            {children}
          </div>
        </dialog>
      )}
    </>
  )
}
