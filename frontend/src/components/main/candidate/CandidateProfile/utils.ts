import { Moment } from 'moment'

export interface FormData {
  photo: any // TODO
  name: string
  surname: string
  patronymic: string | null
  birthday: Moment
  city: string
  education_id: string
  phone: string
  telegram: string | null
  email: string
  skills: string[]
  job_title: string
  work_schedule_id: string
  work_type_id: string
  work_experience_id: string
  _salary: number // TODO
  _siteNotifications: boolean // TODO
  _tgNotifications: boolean // TODO
  work_history: {
    company: string
    job_title: string
    responsibilities: string
    start_date: string
    end_date: string | null
  }[]
}
