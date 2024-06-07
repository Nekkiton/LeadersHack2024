import { useForm, FormProvider } from 'react-hook-form'
import { useCurRecruiterUpdateProfile } from '@/api/recruiters'
import Button from '@/components/ui/Button'
import RecruiterProfileBaseInfo from './RecruiterProfileBaseInfo'
import RecruiterProfileCalendar from './RecruiterProfileCalendar'
import RecruiterProfilePassword from './RecruiterProfilePassword'
import RecruiterProfileNotifications from './RecruiterProfileNotifications'
import styles from './RecruiterProfile.module.scss'

export default function RecruiterProfile() {
  const formMethods = useForm() // TODO: initialValues
  const { handleSubmit } = formMethods

  const { mutate: updateProfile, status } = useCurRecruiterUpdateProfile()

  const submit = handleSubmit((data) => {
    updateProfile(data)
  })

  return (
    <FormProvider {...formMethods}>
      <form className={styles.container} onSubmit={submit}>
        <RecruiterProfileBaseInfo />
        <RecruiterProfileNotifications />
        <RecruiterProfileCalendar />
        <RecruiterProfilePassword />
        <Button type="primary" htmlType="submit" loading={status === 'pending'}>
          Сохранить изменения
        </Button>
      </form>
    </FormProvider>
  )
}
