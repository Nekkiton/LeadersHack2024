import { UpdateAttachment } from '@/types/entities/attachment'
import { RegisterCandidateData } from '@/types/entities/candidate'
import { Moment } from 'moment'

export interface FormData {
  photo: UpdateAttachment | null
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
  salary_expectation: number
  work_history: {
    company: string
    job_title: string
    responsibilities: string
    start_date: Moment
    end_date: Moment | null
  }[]
  site_notifications: boolean
  tg_notifications: boolean
}

export const transformData = (data: FormData): RegisterCandidateData => {
  return {
    ...data,
    birthday: data.birthday.toISOString(),
    work_history: data.work_history.map((i) => ({
      ...i,
      start_date: i.start_date.toISOString(),
      end_date: i.end_date ? i.end_date.toISOString() : null,
    })),
  }
}
