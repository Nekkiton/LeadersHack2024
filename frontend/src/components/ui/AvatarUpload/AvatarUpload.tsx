import { useRef } from 'react'
import classNames from 'classnames'
import { FormError, useFormError } from '@/lib/use-form-error'
import { useControlValue } from '@/lib/use-control-value'
import { useToasts } from '@/lib/use-toasts'
import { generateId } from '@/lib/generate-id'
import BaseButton from '@/components/ui/BaseButton'
import Icon from '@/components/ui/Icon'
import Image from '@/components/ui/Image'
import userImg from '@/assets/images/user.png'
import styles from './AvatarUpload.module.scss'

// TODO: get that out
interface Attachment {
  _id?: string
  name: string
  size: number
  data?: string
}

interface Props {
  className?: string
  value?: Attachment | null
  onChange?: (val: Attachment | null) => void
  error?: FormError
}

export default function AvatarUpload({
  className,
  value: baseValue,
  onChange: baseOnChange,
  error,
}: Props) {
  const FORMATS = ['png', 'jpg', 'jpeg']
  const MAX_SIZE = [5242880, '5 Мб'] as const

  const toasts = useToasts()

  const { value, setValue } = useControlValue({
    baseValue: baseValue,
    baseOnChange: baseOnChange,
    transformBaseValue: (val) =>
      val ? { ...val, _id: val._id ?? generateId() } : null,
    transformValue: (val) => val,
  })

  const inputRef = useRef<HTMLInputElement | null>(null)

  const processFiles = (files: File[]) => {
    files = files.filter((i) => {
      if (i.size > MAX_SIZE[0]) {
        toasts.error({
          content: `Файл "${i.name}" слишком большой. Максимальный размер - ${MAX_SIZE[1]}`,
        })
        return false
      }
      const format = i.name.split('.').pop()
      if (!format || !FORMATS.includes(format)) {
        return false
      }
      return true
    })

    if (!files.length) return

    const reader = new FileReader()
    reader.onload = () => {
      setValue({
        name: files[0].name,
        size: files[0].size,
        _id: generateId(),
        data: reader.result as string,
      })
    }
    reader.readAsDataURL(files[0])
  }

  const errorMsg = useFormError(error)

  return (
    <div
      className={classNames(className, styles.container, {
        [styles.error]: !!error,
      })}
    >
      <div className={styles.main}>
        <input
          ref={inputRef}
          type="file"
          accept={FORMATS.map((i) => `.${i}`).join(',')}
          onChange={(e) => processFiles(Array.from(e.target.files || []))}
          hidden
        />
        <Image
          className={styles.image}
          src={value?.data ?? userImg} // TODO
          width={200}
          height={200}
        />
        <BaseButton
          className={styles.control}
          onClick={() => inputRef.current?.click()}
          hoverable
        >
          <Icon icon="pen" />
        </BaseButton>
      </div>
      {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
    </div>
  )
}
