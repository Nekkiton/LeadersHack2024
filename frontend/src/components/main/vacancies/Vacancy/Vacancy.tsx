import { Role } from '@/types/entities/user'
import { useVacancy } from '@/api/vacancies'
import RemoteData from '@/components/special/RemoteData'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import VacancyInfo from './VacancyInfo'
import styles from './Vacancy.module.scss'

interface Props {
  id: string
  backLink?: {
    url: string
    text: string
  }
  role?: Role
}

export default function Vacancy({ id, backLink, role }: Props) {
  const vacancy = useVacancy(id)

  return (
    <div className={styles.container}>
      {backLink && (
        <Button type="text" href={backLink.url}>
          <Icon icon="chevronLeft" />
          <span>{backLink.text}</span>
        </Button>
      )}
      <RemoteData
        data={vacancy}
        renderSuccess={(vacancy) => (
          <div className={styles.main}>
            <VacancyInfo vacancy={vacancy} role={role} />
            <div>*responses*</div>
          </div>
        )}
      />
    </div>
  )
}
