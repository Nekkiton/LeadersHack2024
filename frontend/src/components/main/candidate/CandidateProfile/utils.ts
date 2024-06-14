import { getUserPhone } from '@/lib/get-user-phone'
import { UpdateAttachment } from '@/types/entities/attachment'
import { Candidate, UpdateCandidateData } from '@/types/entities/candidate'
import { Education } from '@/types/entities/education'
import { Skill } from '@/types/entities/skill'
import { BaseUser } from '@/types/entities/user'
import { WorkExperience } from '@/types/entities/work-experience'
import { WorkSchedule } from '@/types/entities/work-schedule'
import { WorkType } from '@/types/entities/work-type'
import moment, { Moment } from 'moment'

export interface FormData {
  photo: UpdateAttachment | null
  name: string
  surname: string
  patronymic: string | null
  birthday: Moment
  city: string
  education: Education
  phone: string
  telegram: string
  email: string
  skills: Skill[]
  desired_position: string
  work_schedule: WorkSchedule
  work_type: WorkType
  work_experience: WorkExperience
  salary_expectation: number
  work_history: {
    company: string
    position: string
    responsibilities: string
    start_date: Moment
    end_date: Moment | null
  }[]
  site_notifications: boolean // TODO
  tg_notifications: boolean // TODO
}

export const transformData = (data: FormData): UpdateCandidateData => {
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

export const getDefaultData = (
  user?: Partial<Candidate | BaseUser>
): Partial<FormData> => {
  return {
    ...(user ?? {}),
    birthday:
      user?.name && user.birthday ? moment(`${user.birthday}Z`) : undefined,
    patronymic: (user?.name ? user.patronymic : null) ?? null,
    phone:
      user?.name && user.phone ? getUserPhone(user as Candidate) : undefined,
    work_history:
      (user?.name
        ? user?.work_history?.map((i) => ({
            ...i,
            start_date: i.start_date
              ? moment(`${i.start_date}Z`)
              : (undefined as any),
            end_date: i.end_date ? moment(`${i.end_date}Z`) : null,
          }))
        : undefined) ?? [],
  }
}
