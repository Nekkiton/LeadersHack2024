import { User, Role } from '@/types/entities/user'
import { UpdateWorkHistory, WorkHistory } from '@/types/entities/work-history'
import { UpdateAttachment } from '@/types/entities/attachment'
import { City } from '@/types/entities/city'
import { Education } from '@/types/entities/education'
import { WorkSchedule } from '@/types/entities/work-schedule'
import { WorkType } from '@/types/entities/work-type'
import { WorkExperience } from '@/types/entities/work-experience'
import { Skill } from '@/types/entities/skill'

export interface Candidate extends User {
  role: Role.Candidate
  city: City
  birthday: string
  desired_position: string
  education: Education
  work_schedule: WorkSchedule
  work_type: WorkType
  work_experience: WorkExperience
  skills: Skill[]
  work_history: WorkHistory[]
  salary_expectation: number
  match?: number
}

export interface GetCandidatesParams {
  page?: number
  limit?: number
  fio?: string
  experience?: string[]
  skills?: string[]
}

export interface GetVacancyCadidatesParams {
  page?: number
  limit?: number
  vacancy_id: string
}

export interface UpdateCandidateData {
  image: string | null
  name: string
  surname: string
  patronymic: string | null
  birthday: string
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
  work_history: UpdateWorkHistory[]
  preferences: {
    email_notify: boolean
    site_notify: boolean
    timezone: string
  }
}

export interface InviteCandidateData {
  candidate_id: string
  vacancy_id: string
  message: string
}
