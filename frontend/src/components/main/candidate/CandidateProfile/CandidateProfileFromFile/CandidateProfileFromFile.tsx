import { ChangeEventHandler, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { useCurCandidateAnalyzeCV } from '@/api/candidates'
import { useToasts } from '@/lib/use-toasts'
import { getDefaultData } from '../utils'
import Button from '@/components/ui/Button'
import CandidateRecognitionModal from '@/components/base/candidates/CandidateRecognitionModal'
import styles from './CandidateProfileFromFile.module.scss'

export default function CandidateProfileFromFile() {
  const FORMATS = ['jpg', 'jpeg', 'png', 'doc', 'docx', 'pdf']

  const toasts = useToasts()
  const { reset } = useFormContext()

  const inputRef = useRef<HTMLInputElement | null>(null)

  const { mutate, status } = useCurCandidateAnalyzeCV()

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    e.target.value = ''

    const format = file.name.split('.').pop()
    if (!format || !FORMATS.includes(format)) return

    mutate(
      { file },
      {
        onSuccess: (data) => {
          reset(getDefaultData(data))
          toasts.info({ content: 'Проверьте и сохрание данные' })
        },
      }
    )
  }

  return (
    <>
      <div className={styles.container}>
        <input
          type="file"
          ref={inputRef}
          accept={FORMATS.map((i) => `.${i}`).join(',')}
          onChange={onInputChange}
          hidden
        />
        <div className={styles.main}>
          <h3>Заполните профиль автоматически</h3>
          <p className={styles.hint}>
            Загрузите резюме в текстовом формате и мы автоматически
            <br />
            заполним профиль информацией{' '}
          </p>
        </div>
        <Button type="secondary" onClick={() => inputRef.current?.click()}>
          Загрузить резюме
        </Button>
      </div>

      <CandidateRecognitionModal
        isShowed={status === 'pending'}
        setIsShowed={() => {}}
      />
    </>
  )
}
