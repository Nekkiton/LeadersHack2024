import { DragEventHandler, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { useControlValue } from '@/lib/use-control-value'
import { useToasts } from '@/lib/use-toasts'
import { generateId } from '@/lib/generate-id'
import { FormError } from '@/lib/use-form-error'
import ControlContainer from '@/components/ui/ControlContainer'
import styles from './FileInput.module.scss'

interface Props {
  className?: string
  label?: string
  postscript?: string
  error?: FormError
  formats?: string[]
  maxSize?: number
  multi?: boolean
}

interface Attachment {
  _id: string
  name: string
  size: number
}

export default function FileInput({
  className,
  label,
  postscript,
  error,
  formats,
  maxSize,
  multi: isMulti,
}: Props) {
  const toasts = useToasts()

  const { value, setValue } = useControlValue({
    baseValue: undefined,
    baseOnChange: undefined,
    transformBaseValue: (val) => [] as Attachment[],
    transformValue: (val) => undefined,
  })

  const [isDragging, setIsDragging] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const processFiles = (files: File[]) => {
    if (maxSize || formats) {
      files = files.filter((i) => {
        if (maxSize && i.size > maxSize) {
          toasts.error({ content: `Файл "${i.name}" слишком большой` })
          return false
        }

        const format = i.name.split('.').pop()
        if (formats && (!format || !formats.includes(`.${format}`))) {
          return false
        }

        return true
      })
    }

    if (!files.length) return

    if (isMulti) {
      setValue(
        value.concat(
          files.map((i) => ({ name: i.name, size: i.size, _id: generateId() }))
        )
      )
    } else {
      setValue([
        { name: files[0].name, size: files[0].size, _id: generateId() },
      ])
    }
  }

  const onDrop: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    setIsDragging(false)
    processFiles(Array.from(e.dataTransfer.files))
  }

  const hint = useMemo(() => {
    return '...'
  }, [])

  return (
    <ControlContainer
      className={className}
      label={label}
      postscript={postscript}
      error={error}
    >
      <input
        ref={inputRef}
        type="file"
        accept={formats?.join(',')}
        multiple={isMulti}
        onChange={(e) => processFiles(Array.from(e.target.files || []))}
        hidden
      />
      <div
        className={classNames(styles.zone, { [styles.dragging]: isDragging })}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <span>*icon*</span>
        <p>Загрузите файл или ператищите его в эту область</p>
        {hint && <p>hint</p>}
      </div>
      <div className={styles.files}>
        {value.map((file, idx) => (
          <div key={file.name + idx}>{file.name}</div>
        ))}
      </div>
    </ControlContainer>
  )
}
