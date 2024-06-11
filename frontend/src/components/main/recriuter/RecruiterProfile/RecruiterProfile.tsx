import { useEffect } from 'react'
import { useCurUser } from '@/api/users'
import { useForm, FormProvider } from 'react-hook-form'
import { useCurRecruiterUpdateProfile } from '@/api/recruiters'
import { FormData, getDefaultData, transformData } from './utils'
import Button from '@/components/ui/Button'
import RecruiterProfileBaseInfo from './RecruiterProfileBaseInfo'
import RecruiterProfileCalendar from './RecruiterProfileCalendar'
import RecruiterProfilePassword from './RecruiterProfilePassword'
import RecruiterProfileNotifications from './RecruiterProfileNotifications'
import styles from './RecruiterProfile.module.scss'

export default function RecruiterProfile() {
  const formMethods = useForm<FormData>()
  const { handleSubmit, setError, reset } = formMethods

  const { mutate: updateProfile, status } = useCurRecruiterUpdateProfile({
    setError,
  })

  const user = useCurUser()

  useEffect(() => {
    if (user.status === 'success' && user.value) {
      reset(getDefaultData(user.value as any)) // TODO
    }
  }, [user.status])

  const submit = handleSubmit((data) => {
    updateProfile(transformData(data))
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
