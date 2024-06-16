import { ChangeEventHandler, useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { useCurCandidateAnalyzeCV } from '@/api/candidates'
import { useToasts } from '@/lib/use-toasts'
import { getDefaultData } from '../utils'
import { useRouter } from 'next/router'
import Button from '@/components/ui/Button'
import CandidateRecognitionModal from '@/components/base/candidates/CandidateRecognitionModal'
import styles from './CandidateProfileFromFile.module.scss'

export default function CandidateProfileFromFile() {
  const FORMATS = ['docx', 'pdf']

  const toasts = useToasts()

  const router = useRouter()
  useEffect(() => {
    if (router.query.action === 'upload-cv') {
      inputRef.current?.click()
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          action: undefined,
        },
      })
    }
  }, [router.query])

  const { reset } = useFormContext()

  const inputRef = useRef<HTMLInputElement | null>(null)

  const { mutate, status } = useCurCandidateAnalyzeCV()

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    e.target.value = ''

    const format = file.name.split('.').pop()
    if (!format || !FORMATS.includes(format)) {
      toasts.error({
        content: `Формат файла не поддерживается. Используйте файлы ${FORMATS.map(
          (i) => '.' + i
        ).join(', ')}`,
      })
      return
    }

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
