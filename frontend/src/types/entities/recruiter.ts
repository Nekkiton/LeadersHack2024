import { User, Role } from '@/types/entities/user'
import { UpdateAttachment } from '@/types/entities/attachment'
import {
  InterviewSlot,
  UpdateInterviewSlot,
} from '@/types/entities/interview-slot'

export interface Recruiter extends User {
  role: Role.Recruiter
  interview_per_day: number
  // interview_slots: string[] // TODO
  interview_slots?: InterviewSlot[] // TODO
}

export interface UpdateRecruiterData {
  photo: UpdateAttachment | null
  name: string
  surname: string
  patronymic: string | null
  phone: string
  telegram: string
  email: string
  interview_per_day: number
  interview_slots: UpdateInterviewSlot[]
  site_notifications: boolean
  tg_notifications: boolean
}
