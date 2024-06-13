import { ChangeEventHandler, useRef, useState } from 'react'
import { useCurCandidateUpdateProfileFromFile } from '@/api/candidates'
import Button from '@/components/ui/Button'
import CandidateRecognitionModal from '@/components/base/candidates/CandidateRecognitionModal'
import styles from './CandidateProfileFromFile.module.scss'

export default function CandidateProfileFromFile() {
  const FORMATS = ['doc', 'docx', 'pdf']

  const inputRef = useRef<HTMLInputElement | null>(null)

  const { mutate: updateProfile, status } =
    useCurCandidateUpdateProfileFromFile()

  const [isModalShowed, setIsModalShowed] = useState(false)

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    e.target.value = ''

    const format = file.name.split('.').pop()
    if (!format || !FORMATS.includes(format)) return

    const reader = new FileReader()
    reader.onload = () => {
      setIsModalShowed(true)
      // updateProfile(
      //   {
      //     file: reader.result as string,
      //   },
      //   {
      //     onSettled: () => {
      //       setIsModalShowed(false)
      //     },
      //   }
      // )
    }
    reader.readAsDataURL(file)
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
        isShowed={isModalShowed}
        setIsShowed={setIsModalShowed}
      />
    </>
  )
}
