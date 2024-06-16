import { getUserPhone } from '@/lib/get-user-phone'
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
  preferences: {
    email_notify: boolean
    site_notify: boolean
  }
}

export const transformData = (data: FormData): UpdateRecruiterData => {
  return {
    ...data,
    interview_slots: data.interview_slots.map((i) => ({
      ...i,
      start_time: i.start_time.toISOString(),
      end_time: i.end_time.toISOString(),
    })),
  }
}

export const getDefaultData = (
  user?: Recruiter | BaseUser
): Partial<FormData> => {
  return {
    ...(user ?? {}),
    phone: user?.name ? getUserPhone(user) : undefined,
    interview_slots: (user?.name
      ? user.interview_slots?.map((i) => ({
          ...i,
          start_time: moment(`${i.start_time}Z`),
          end_time: moment(`${i.end_time}Z`),
        }))
      : undefined) ?? [
      {
        start_time: moment().hours(10).minutes(0),
        end_time: moment().hours(18).minutes(0),
      },
    ],
    preferences: (user?.name ? user.preferences : null) ?? {
      email_notify: false,
      site_notify: false,
    },
  }
}
