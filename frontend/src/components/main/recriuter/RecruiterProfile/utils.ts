import { Recruiter, UpdateRecruiterData } from '@/types/entities/recruiter'
import { BaseUser } from '@/types/entities/user'
import moment, { Moment } from 'moment'

export interface FormData {
  photo: any // TODO
  name: string
  surname: string
  patronymic: string | null
  phone: string
  telegram: string
  email: string
  interview_per_day: number
  interview_slots: {
    start_time: Moment
    end_time: Moment
  }[]
  site_notifications: boolean // TODO
  tg_notifications: boolean // TODO
}

export const transformData = (data: FormData): UpdateRecruiterData => {
  return {
    ...data,
    interview_slots: data.interview_slots.map((i) => ({
      ...i,
      start_time: i.start_time.format('HH:mm'),
      end_time: i.end_time.format('HH:mm'),
    })),
  }
}

export const getDefaultData = (
  user?: Recruiter | BaseUser
): Partial<FormData> => {
  return {
    ...(user ?? {}),
    interview_slots: user?.name
      ? user.interview_slots?.map((i) => ({
          ...i,
          start_time: moment(i.start_time),
          end_time: moment(i.end_time),
        }))
      : [],
  }
}
