import { ReactNode, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'
import { Site } from '@/config/site'

interface Props {
  className?: string
  isShowed: boolean
  children?: ReactNode
  setIsShowed: (val: boolean) => void
}

/**
 * Fixed component which overlays the whole page.
 */
export default function Overlay({
  className,
  children,
  isShowed,
  setIsShowed,
}: Props) {
  // TODO: do I need to use id
  // TODO: tab, escape

  const id = useId()

  const containerRef = useRef<HTMLDivElement | null>(null)

  const onKeyDown = (e: KeyboardEvent) => {
    const floatings = document.querySelectorAll('body > .floating')
    const floating = floatings[floatings.length - 1]

    if (floating.id === id) {
      if (e.key === 'Escape') {
        setIsShowed(false)
      }
    }
  }

  useEffect(() => {
    if (isShowed) {
      document.addEventListener('keydown', onKeyDown)
      return () => document.removeEventListener('keydown', onKeyDown)
    }
  }, [isShowed])
  // TODO: esling warning

  if (typeof window === 'undefined') {
    return null
  }

  return createPortal(
    <CSSTransition
      nodeRef={containerRef}
      timeout={Site.transition.duration}
      in={isShowed}
      appear
      unmountOnExit
    >
      <div
        className={classNames(className, 'floating')}
        ref={containerRef}
        id={id}
      >
        {children}
      </div>
    </CSSTransition>,
    document.body
  )
}
