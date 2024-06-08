import { useForm, FormProvider } from 'react-hook-form'
import { useCurCandidateUpdateProfile } from '@/api/candidates'
import Button from '@/components/ui/Button'
import CandidateProfileBaseInfo from './CandidateProfileBaseInfo'
import CandidateProfilePassword from './CandidteProfilePassword'
import CandidateProfileNotifications from './CandidateProfileNotifications'
import styles from './CandidateProfile.module.scss'

export default function CandidateProfile() {
  const formMethods = useForm() // TODO: initialValues
  const { handleSubmit } = formMethods

  const { mutate: updateProfile, status } = useCurCandidateUpdateProfile()

  const submit = handleSubmit((data) => {
    updateProfile(data)
  })

  return (
    <FormProvider {...formMethods}>
      <form className={styles.container} onSubmit={submit}>
        <CandidateProfileBaseInfo />
        <CandidateProfileNotifications />
        <CandidateProfilePassword />
        <Button type="primary" htmlType="submit" loading={status === 'pending'}>
          Сохранить изменения
        </Button>
      </form>
    </FormProvider>
  )
}
