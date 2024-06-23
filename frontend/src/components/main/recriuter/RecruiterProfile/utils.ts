import { getUserPhone } from '@/lib/get-user-phone'
import { UpdateAttachment } from '@/types/entities/attachment'
import { Recruiter, UpdateRecruiterData } from '@/types/entities/recruiter'
import { BaseUser } from '@/types/entities/user'
import moment, { Moment } from 'moment-timezone'

export interface FormData {
  image: UpdateAttachment | null
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
    timezone: string
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
    image: data.image?.data ?? null,
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
      timezone: moment.tz.guess(),
    },
    image:
      (user?.name && user.image
        ? {
            _id: 'attachment',
            created_at: '',
            name: 'Обложка',
            size: 1024 * 10,
            data: user.image,
          }
        : null) ?? null,
  }
}
