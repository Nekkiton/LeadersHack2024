import { useForm, FormProvider } from 'react-hook-form'
import RecruiterProfileBaseInfo from './RecruiterProfileBaseInfo'
import RecruiterProfileCalendar from './RecruiterProfileCalendar'
import RecruiterProfilePassword from './RecruiterProfilePassword'
import RecruiterProfileNotifications from './RecruiterProfileNotifications'
import styles from './RecruiterProfile.module.scss'

// TODO: logic, api, interfaces
export default function RecruiterProfile() {
  const formMethods = useForm()
  const { handleSubmit } = formMethods

  const submit = handleSubmit((data) => {
    console.log(data)
  })

  return (
    <FormProvider {...formMethods}>
      <form className={styles.container} onSubmit={submit}>
        <RecruiterProfileBaseInfo />
        <RecruiterProfileNotifications />
        <RecruiterProfileCalendar />
        <RecruiterProfilePassword />
      </form>
    </FormProvider>
  )
}
