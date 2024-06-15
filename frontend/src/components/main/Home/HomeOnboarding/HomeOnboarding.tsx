import { ChangeEventHandler, useRef, useState } from 'react'
import { useToasts } from '@/lib/use-toasts'
import { useFindVacanciesViaCV } from '@/api/vacancies'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'
import Image from '@/components/ui/Image'
import Icon from '@/components/ui/Icon'
import Spinner from '@/components/ui/Spinner'
import onboardingImg from '@/assets/images/onboarding.png'
import styles from './HomeOnboarding.module.scss'
import { Vacancy } from '@/types/entities/vacancy'
import VacancyCard from '@/components/base/vacancies/VacancyCard'
import Link from 'next/link'
import { Routes } from '@/config/routes'

export default function HomeOnboarding() {
  const FORMATS = ['docx', 'pdf']

  const toasts = useToasts()

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [shouldCreateAccount, setShouldCreateAccount] = useState(false)
  const [vacancies, setVacancies] = useState<Vacancy[]>([])

  const inputRef = useRef<HTMLInputElement | null>(null)

  const { mutate, status } = useFindVacanciesViaCV()

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

    setIsSubmitted(true)
    mutate(
      { file },
      {
        onError: () => {
          setIsSubmitted(false)
        },
        onSuccess: (val) => {
          setVacancies(val)
        },
      }
    )
  }

  if (!isSubmitted) {
    return (
      <div className={styles.outerContainer}>
        <div className={styles.container}>
          <div className={styles.main}>
            <div className={styles.mainText}>
              <h2>Подберите вакансию в 2 клика</h2>
              <p className={styles.mainTextHint}>
                Загрузите резюме в текстовом формате и мы подберем
                вам подходящие вакансии меньше чем за минуту
              </p>
            </div>
            <div className={styles.mainControls}>
              <input
                type="file"
                ref={inputRef}
                accept={FORMATS.map((i) => `.${i}`).join(',')}
                onChange={onInputChange}
                hidden
              />
              <Button type="primary" onClick={() => inputRef.current?.click()}>
                Загрузить резюме
              </Button>
              <Checkbox
                value={shouldCreateAccount}
                onChange={setShouldCreateAccount}
              >
                <span>Создать аккаунт при загрузке резюме</span>
                <div title="Создайте аккаунт, чтобы получать приглашения на вакансии и получать уведомления о новых вакансиях. Выбирая чекбокс, вы даете свое согласие на обработку персональных данных">
                  <Icon icon="question" />
                </div>
              </Checkbox>
            </div>
          </div>
          <Image className={styles.img} src={onboardingImg} />
        </div>
      </div>
    )
  }

  if (status === 'pending') {
    return (
      <div className={styles.outerContainer}>
        <div className={styles.loader}>
          <Spinner className={styles.loaderIcon} />
          <div className={styles.loaderText}>
            <h2>Изучаем резюме и ищем подходящие вакансии</h2>
            <p className={styles.loaderHint}>
              Это может занять около минуты. Не закрывайте страницу
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className={styles.outerContainer}>
        <div className={styles.result}>
          <h2>Подходящие вакансии</h2>
          <div className={styles.resultMain}>
            {vacancies.length ? (
              <div className={styles.resultVacancies}>
                {vacancies.map((vacancy) => (
                  <Link key={vacancy._id} href={Routes.vacancy(vacancy._id)}>
                    <VacancyCard
                      className={styles.resultVacancy}
                      vacancy={vacancy}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.resultNothing}>
                <Icon
                  className={styles.resultNothingIcon}
                  icon="documentLoupe"
                />
                <p>Сейчас для вас нет подходящих вакансий</p>
              </div>
            )}
            {/* TODO: creating account */}
            {shouldCreateAccount && (
              <div className={styles.resultSidebar}>
                <h3>Не смогли создать аккаунт :(</h3>
                <p>
                  Чтобы быть в курсе новых вакансий, зарегистрируйтесь на нашем
                  сайте
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}
