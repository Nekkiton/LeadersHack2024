import { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import classNames from 'classnames'
import styles from './BaseButton.module.scss'

export interface BaseButtonProps {
  className?: string
  stopPropagation?: boolean
  preventDefault?: boolean
  hoverable?: boolean
  disabled?: boolean
  htmlType?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  children?: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

/**
 * Simple clickable element without any additions
 */
export default function BaseButton({
  className,
  hoverable,
  disabled,
  htmlType = 'button',
  children,
  onClick,
}: BaseButtonProps) {
  // TODO: ref

  return (
    <button
      className={classNames(className, styles.button, {
        [styles.hoverable]: hoverable,
      })}
      type={htmlType}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
