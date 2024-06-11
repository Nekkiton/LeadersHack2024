import { useToasts } from '@/lib/use-toasts'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'
import Image from '@/components/ui/Image'
import Icon from '@/components/ui/Icon'
import onboardingImg from '@/assets/images/onboarding.png'
import styles from './HomeOnboarding.module.scss'

export default function HomeOnboarding() {
  const toasts = useToasts()

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.mainText}>
            <h2>Подберите вакансию в 2 клика</h2>
            <p className={styles.mainTextHint}>
              Загрузите резюме в текстовом формате и мы подберем вам подходящие
              вакансии меньше чем за минуту
            </p>
          </div>
          <div className={styles.mainControls}>
            <Button
              type="primary"
              onClick={() =>
                toasts.info({ content: 'Функционал в разработке' })
              }
            >
              Загрузить резюме
            </Button>
            <Checkbox>
              <span>Создать аккаунт при загрузке резюме</span>
              <div
                title="Создайте аккаунт, чтобы получать приглашения на вакансии и получать уведомления о новых вакансиях.
Выбирая чекбокс, вы даете свое согласие на обработку персональных данных"
              >
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
