import { KeyboardEvent, FocusEvent, ReactNode, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useControlValue } from '@/lib/use-control-value'
import { useEffectExceptMount } from '@/lib/use-effect-except-mount'
import { Site } from '@/config/site'
import classNames from 'classnames'
import styles from './WithPopover.module.scss'

interface Props {
  className?: string
  referenceClassName?: string
  popoverClassName?: string
  notInteractive?: boolean
  reference: ReactNode
  popover: ReactNode
  isActive?: boolean
  setIsActive?: (val: boolean) => void
}

/**
 * Container for reference and it's popover.
 * If component is interactive, it handles click, enter or space or escape press
 */
export default function WithPopover({
  className,
  referenceClassName,
  popoverClassName,
  notInteractive: isNotInteractive,
  reference,
  popover,
  isActive: baseIsActive,
  setIsActive: baseSetIsActive,
}: Props) {
  // TODO: add fixed strategy if I really need this - will it work inside modals?
  // TODO: aria

  const containerRef = useRef<HTMLDivElement | null>(null)
  const referenceRef = useRef<HTMLDivElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  const { value: isActive, setValue: setIsActive } = useControlValue({
    baseValue: baseIsActive,
    baseOnChange: baseSetIsActive,
    transformBaseValue: (val) => val ?? false,
    transformValue: (val) => val,
  })

  const shouldFocusAfterDeactivate = useRef(true)

  useEffectExceptMount(() => {
    if (!isNotInteractive && !isActive && shouldFocusAfterDeactivate.current) {
      referenceRef.current?.focus()
    }
  }, [isActive])

  const containerEventHandlers = {
    blur: (e: FocusEvent) => {
      if (isNotInteractive) return
      if (!containerRef.current?.contains(e.relatedTarget)) {
        shouldFocusAfterDeactivate.current = false
        setIsActive(false)
      }
    },
    keyDown: (e: KeyboardEvent) => {
      if (isNotInteractive) return
      if (e.key === 'Escape') {
        setIsActive(false)
      }
    },
  }

  const referenceEventHandlers = {
    click: () => {
      if (isNotInteractive) return
      setIsActive(!isActive)
    },
    keyDown: (e: KeyboardEvent) => {
      if (isNotInteractive) return
      switch (e.key) {
        case ' ':
          if (
            (e.target as Element).tagName !== 'BUTTON' // bacause pressing space on button is click
          ) {
            e.preventDefault()
            setIsActive(!isActive)
          }
          break
        case 'Enter':
          if (
            (e.target as Element).tagName !== 'BUTTON' // bacause pressing space on button is click
          ) {
            setIsActive(!isActive)
          }
          break
      }
    },
    focus: () => {
      if (isNotInteractive) return
      shouldFocusAfterDeactivate.current = true
    },
  }

  return (
    <div
      className={classNames(className, styles.container, {
        [styles.notInteractive]: isNotInteractive,
      })}
      ref={containerRef}
      onBlur={containerEventHandlers.blur}
      onKeyDown={containerEventHandlers.keyDown}
    >
      <div
        className={classNames(referenceClassName, styles.reference)}
        ref={referenceRef}
        tabIndex={isNotInteractive ? undefined : 0}
        onClick={referenceEventHandlers.click}
        onKeyDown={referenceEventHandlers.keyDown}
        onFocus={referenceEventHandlers.focus}
      >
        {reference}
      </div>
      <CSSTransition
        nodeRef={popoverRef}
        timeout={Site.transition.duration}
        in={isActive}
        unmountOnExit
        appear
      >
        <div
          className={classNames(popoverClassName, styles.popover)}
          ref={popoverRef}
          tabIndex={-1}
        >
          {popover}
        </div>
      </CSSTransition>
    </div>
  )
}
