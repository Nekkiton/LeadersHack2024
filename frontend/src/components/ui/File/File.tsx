import { MouseEventHandler, ReactNode, useMemo } from 'react'
import classNames from 'classnames'
import { transformBytes } from '@/lib/transform-bytes'
import Icon from '@/components/ui/Icon'
import BaseButton from '@/components/ui/BaseButton'
import styles from './File.module.scss'

// TODO: get that out
interface Attachment {
  _id: string
  name: string
  size: number
}

interface Props {
  className?: string
  file: Attachment
  as?: 'button' | 'link'
  postfix?: ReactNode
  onClick?: MouseEventHandler
}

export default function File({ className, file, as, postfix, onClick }: Props) {
  const fileSize = useMemo(() => transformBytes(file.size), [file])

  const children = (
    <>
      <div className={styles.fileNameContainer}>
        <Icon className={styles.fileIcon} icon="file" />
        <span>{file.name}</span>
      </div>
      <span className={styles.fileSize}>{fileSize}</span>
      {postfix}
    </>
  )

  if (as === 'link') {
    // TODO: add link
    return '...'
  }

  if (as === 'button') {
    return (
      <BaseButton
        className={classNames(className, styles.container, styles.hoverable)}
        onClick={onClick}
      >
        {children}
      </BaseButton>
    )
  }

  return (
    <div className={classNames(className, styles.container)}>{children}</div>
  )
}
