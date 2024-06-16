import { DragEventHandler, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { useControlValue } from '@/lib/use-control-value'
import { useToasts } from '@/lib/use-toasts'
import { generateId } from '@/lib/generate-id'
import { FormError } from '@/lib/use-form-error'
import { transformBytes } from '@/lib/transform-bytes'
import ControlContainer from '@/components/ui/ControlContainer'
import File from '@/components/ui/File'
import Icon from '@/components/ui/Icon'
import styles from './FileUpload.module.scss'

// TODO: get that out
interface Attachment {
  _id: string
  name: string
  size: number
  data: string
}

type Value<IsMultiple> = IsMultiple extends true ? Attachment[] : Attachment

interface Props<IsMultiple extends boolean> {
  className?: string
  label?: string
  postscript?: string
  error?: FormError
  formats?: string[] // without . (pdf, png, ...)
  maxSize?: number
  multi?: IsMultiple
  value?: Value<IsMultiple>
  onChange?: (val: Value<IsMultiple>) => void
}

export default function FileUpload<IsMultiple extends boolean = false>({
  className,
  label,
  postscript,
  error,
  formats,
  maxSize,
  multi: isMulti,
  value: baseValue,
  onChange: baseOnChange,
}: Props<IsMultiple>) {
  const toasts = useToasts()

  const { value, setValue } = useControlValue({
    baseValue: baseValue,
    baseOnChange: baseOnChange as any,
    transformBaseValue: (val: Attachment[] | Attachment | undefined) =>
      Array.isArray(val) ? val : val === undefined ? [] : [val],
    transformValue: (val) => (isMulti ? val : val[0]),
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
        if (formats && (!format || !formats.includes(format))) {
          return false
        }

        return true
      })
    }

    if (!files.length) return

    const readFile = (file: File) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (isMulti) {
          // TODO
        } else {
          setValue([
            {
              name: file.name,
              size: file.size,
              _id: generateId(),
              data: reader.result as string,
            },
          ])
        }
      }
      reader.readAsDataURL(file)
    }

    if (isMulti) {
      // TODO
      // setValue(
      //   value.concat(
      //     files.map((i) => ({ name: i.name, size: i.size, _id: generateId() }))
      //   )
      // )
    } else {
      readFile(files[0])
    }
  }

  const onDrop: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    setIsDragging(false)
    processFiles(Array.from(e.dataTransfer.files))
  }

  const hint1 = useMemo(
    () =>
      `Загрузите файл${isMulti ? 'ы' : ''} или ператищите ${
        isMulti ? 'их' : 'его'
      } в эту область`,
    [isMulti]
  )

  const hint2 = useMemo(() => {
    if (!maxSize && !formats) {
      return null
    }
    let text = ''
    if (maxSize) {
      text += `не более ${transformBytes(maxSize)}`
    }
    if (formats) {
      if (text) text += ' '
      text += `в формате ${formats.join(', ')}`
    }
    return text[0].toUpperCase() + text.slice(1)
  }, [maxSize, formats])

  return (
    <ControlContainer
      className={classNames(className, styles.container, {
        [styles.error]: !!error,
      })}
      label={label}
      postscript={postscript}
      error={error}
    >
      <input
        ref={inputRef}
        type="file"
        accept={formats?.map((i) => `.${i}`).join(',')}
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
        <Icon className={styles.icon} icon="box" />
        <p className={styles.hint1}>{hint1}</p>
        {hint2 && <p>{hint2}</p>}
      </div>
      <div className={styles.files}>
        {value.map((file, idx) => (
          <File
            key={idx}
            file={file}
            as="button"
            postfix={<Icon className={styles.fileIcon} icon="times" />}
            onClick={() =>
              setValue([...value.slice(0, idx), ...value.slice(idx + 1)])
            }
          />
        ))}
      </div>
    </ControlContainer>
  )
}
