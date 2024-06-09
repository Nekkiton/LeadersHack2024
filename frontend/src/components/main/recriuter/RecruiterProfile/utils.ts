import { Moment } from 'moment'

export interface FormData {
  photo: any // TODO
  name: string
  surname: string
  patronymic: string | null
  phone: string
  telegram: string | null
  email: string
  _siteNotifications: boolean // TODO
  _tgNotifications: boolean // TODO
  interview_per_day: number
  interview_slots: {
    start_time: Moment
    end_time: Moment
  }[]
}
