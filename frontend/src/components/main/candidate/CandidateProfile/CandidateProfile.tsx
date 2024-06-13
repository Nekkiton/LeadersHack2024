import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useCurCandidateUpdateProfile } from '@/api/candidates'
import { FormData, getDefaultData, transformData } from './utils'
import { useCurUser } from '@/api/users'
import Button from '@/components/ui/Button'
import CandidateProfileWorks from './CandidateProfileWorks'
import CandidateProfileBaseInfo from './CandidateProfileBaseInfo'
import CandidateProfilePassword from './CandidteProfilePassword'
import CandidateProfileFromFile from './CandidateProfileFromFile'
import CandidateProfileNotifications from './CandidateProfileNotifications'
import styles from './CandidateProfile.module.scss'

export default function CandidateProfile() {
  const formMethods = useForm<FormData>({
    defaultValues: getDefaultData(),
  })
  const { handleSubmit, reset, setError, formState } = formMethods

  const { mutate: updateProfile, status } = useCurCandidateUpdateProfile({
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
        <CandidateProfileFromFile />
        <CandidateProfileBaseInfo />
        <CandidateProfileWorks />
        <CandidateProfileNotifications />
        {user.status === 'success' && user.value && (
          <CandidateProfilePassword user={user.value} />
        )}
        <Button type="primary" htmlType="submit" loading={status === 'pending'}>
          Сохранить изменения
        </Button>
      </form>
    </FormProvider>
  )
}
