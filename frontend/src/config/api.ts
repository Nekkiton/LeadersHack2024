import { Axios } from '@/config/axios'
import {
  ForgotPasswordData,
  LoginData,
  RegisterData,
  ResetPasswordData,
} from '@/types/entities/auth'
import { Education } from '@/types/entities/education'
import { Paginated } from '@/types/entities/paginated'
import { Recruiter } from '@/types/entities/recruiter'
import { Skill } from '@/types/entities/skill'
import { Role, User } from '@/types/entities/user'
import {
  GetVacanciesParams,
  Vacancy,
  VacancyStatus,
} from '@/types/entities/vacancy'
import { WorkExperience } from '@/types/entities/work-experience'
import { WorkSchedule } from '@/types/entities/work-schedule'
import { WorkScope } from '@/types/entities/work-scope'
import { WorkType } from '@/types/entities/work-type'

export const Api = {
  auth: {
    login: (data: LoginData) => Axios.post('/auth/login/', data),
    register: (data: RegisterData) => Axios.post('/auth/register/', data),
    forgotPassword: (data: ForgotPasswordData) =>
      Axios.post('/auth/forgot/', data),
    resetPassword: (data: ResetPasswordData) =>
      Axios.post('/auth/reset-password/', data),
  },

  users: {
    me: () =>
      Axios.get<User>('/users/me/')
        .then((res) => res.data)
        .catch(
          () =>
            ({
              id: 'f',
              name: 'Alexey',
              surname: 'Levedev',
              patronymic: 'Sergeevich',
              email: 'email@ya.ru',
              phone: '+7 (999) 999-99-99',
              telegram: null,
              birthday: '01.01.2000',
              photo: null,
              avatar:
                'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp',
              role: Role.Recruiter,
              notifications: [],
            } as User)
        ),
    // .catch(() => null),
  },

  recruiters: {
    all: () =>
      Axios.get<Recruiter[]>('/recruiters/')
        .then((res) => res.data)
        .catch(() => [
          {
            id: '1',
            name: 'Alexey',
            surname: 'Levedev',
            patronymic: 'Sergeevich',
            email: 'email@ya.ru',
            phone: '+7 (999) 999-99-99',
            telegram: null,
            birthday: '01.01.2000',
            photo: null,
            role: Role.Recruiter,
            notifications: [],
            interview_per_day: 1,
            interview_slots: [],
          } as Recruiter,
        ]),
    me: {
      updateProfile: (data: any) => Axios.patch('/recruiters/me/', data), // TODO: data type
    },
  },

  vacancies: {
    all: (params?: GetVacanciesParams) =>
      Axios.get<Paginated<Vacancy[]>>('/vacancies/', { params })
        .then((res) => res.data)
        .catch(
          () =>
            ({
              data: [
                {
                  id: '1',
                  responces: [],
                  status: VacancyStatus.Active,
                  scope_id: 'Разработка',
                  recruiter: {
                    id: '1',
                    name: 'Alexey',
                    surname: 'Levedev',
                    patronymic: 'Sergeevich',
                    email: 'email@ya.ru',
                    phone: '+7 (999) 999-99-99',
                    telegram: null,
                    birthday: '01.01.2000',
                    photo: null,
                    role: Role.Recruiter,
                    notifications: [],
                    interview_per_day: 1,
                    interview_slots: [],
                  },
                  title: 'Vacancy title',
                  description: 'some description',
                  responsibilities: 'responsibilites',
                  conditions: 'conditions',
                  additions: 'additions',
                  salary_from: 100000,
                  work_experience_id: '1',
                  salary_to: null,
                  candidate_expectation: 'expectations',
                  work_type_id: '1',
                  work_schedule_id: '1',
                  skills: ['1'],
                  recruiter_id: '1',
                  stages: [],
                  creation_date: '12.05.2012',
                },
              ],
              current_page: 1,
              last_page: 5,
            } as Paginated<Vacancy[]>)
        ),
    create: (data: any) => Axios.post('/vacancies/', data), // TODO: data type
  },

  workScopes: {
    all: () =>
      Axios.get<WorkScope[]>('/work-scopes/')
        .then((res) => res.data)
        .catch(() => [{ id: '1', scope: 'Аналитика' }] as WorkScope[]),
  },

  workTypes: {
    all: () =>
      Axios.get<WorkType[]>('/work-types/')
        .then((res) => res.data)
        .catch(() => [{ id: '1', type: 'Type 1' }] as WorkType[]),
  },

  workSchedules: {
    all: () =>
      Axios.get<WorkSchedule[]>('/work-schedules/')
        .then((res) => res.data)
        .catch(() => [{ id: '1', schedule: 'Schedule 1' }] as WorkSchedule[]),
  },

  workExperiences: {
    all: () =>
      Axios.get<WorkExperience[]>('/work-experiences/')
        .then((res) => res.data)
        .catch(
          () => [{ id: '1', experience: 'Experience 1' }] as WorkExperience[]
        ),
  },

  skills: {
    all: () =>
      Axios.get<Skill[]>('/skills/')
        .then((res) => res.data)
        .catch(() => [{ id: '1', skill: 'Skill 1' }] as Skill[]),
  },

  educations: {
    all: () =>
      Axios.get<Education[]>('/educations/')
        .then((res) => res.data)
        .catch(() => [{ id: '1', education: 'Education 1' }] as Education[]),
  },
}
