import { HTMLAttributeAnchorTarget, ReactNode } from 'react'
import { UrlObject } from 'url'
import classNames from 'classnames'
import Link from 'next/link'
import AppearTransition from '@/components/ui/AppearTransition'
import BaseButton, { BaseButtonProps } from '@/components/ui/BaseButton'
import Spinner from '@/components/ui/Spinner'
import styles from './Button.module.scss'

interface Props extends BaseButtonProps {
  className?: string
  type?: 'primary' | 'secondary' | 'text'
  underline?: 'dashed' | 'solid'
  href?: UrlObject | string
  target?: HTMLAttributeAnchorTarget
  fullWidth?: boolean
  loading?: boolean
  children?: ReactNode
}

export default function Button({
  className,
  type = 'primary',
  underline,
  href,
  target,
  fullWidth,
  loading,
  children,
  disabled,
  ...baseButtonProps
}: Props) {
  if (href) {
    return (
      <Link
        className={classNames(
          className,
          styles.link,
          styles[type],
          styles[`underline-${underline}`],
          {
            [styles.full]: fullWidth,
          }
        )}
        href={href}
        target={target}
      >
        {children}
      </Link>
    )
  } else {
    return (
      <BaseButton
        {...baseButtonProps}
        className={classNames(
          className,
          styles.button,
          styles[type],
          styles[`underline-${underline}`],
          {
            [styles.full]: fullWidth,
          }
        )}
        disabled={loading || disabled}
      >
        {children}
        <AppearTransition gap orientation="h">
          {loading && <Spinner />}
        </AppearTransition>
      </BaseButton>
    )
  }
}
