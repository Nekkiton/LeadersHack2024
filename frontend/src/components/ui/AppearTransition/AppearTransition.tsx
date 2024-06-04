import { ReactNode, useEffect, useRef, useState } from 'react'
import { Site } from '@/config/site'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'
import styles from './AppearTransition.module.scss'

interface Props {
  className?: string
  id?: string
  gap?: boolean
  orientation?: 'v' | 'h'
  children?: ReactNode
}

/**
 * Wrapper for component which is supposed to appear and disappear.
 * If you use gap prop, you should specify gap value in css with --gap variable
 */
export default function AppearTransition({
  className,
  id,
  gap: hasGap,
  orientation = 'v',
  children,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [prevChildren, setPrevChildren] = useState<null | ReactNode>(null)
  const [isShowed, setIsShowed] = useState(false)

  useEffect(() => {
    if (children && !isShowed) {
      setIsShowed(true)
      setPrevChildren(children)
    } else if (!children && isShowed) {
      setIsShowed(false)
    } else if (children && isShowed) {
      setPrevChildren(children)
    }
  }, [children])
  // TODO: eslint warning

  if (!prevChildren) {
    return null
  }

  return (
    <CSSTransition
      nodeRef={containerRef}
      timeout={Site.transition.duration}
      in={isShowed}
      onExited={() => setPrevChildren(false)}
      appear
    >
      <div
        className={classNames(styles.container, className, {
          [styles.gap]: hasGap,
          [styles.horizontal]: orientation === 'h',
        })}
        ref={containerRef}
        id={id}
      >
        {/* we need another wrapper because children might have width or height properties */}
        <div>{prevChildren}</div>
      </div>
    </CSSTransition>
  )
}
