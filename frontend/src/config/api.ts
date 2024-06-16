import { Axios } from '@/config/axios'
import {
  ChangePasswordData,
  ForgotPasswordData,
  LoginData,
  RegisterData,
  ResetPasswordData,
} from '@/types/entities/auth'
import {
  Candidate,
  GetCandidatesParams,
  GetVacancyCadidatesParams,
  InviteCandidateData,
  UpdateCandidateData,
} from '@/types/entities/candidate'
import { City } from '@/types/entities/city'
import { Education } from '@/types/entities/education'
import { GetNewsParams, News, UpdateNewsData } from '@/types/entities/news'
import { Paginated } from '@/types/entities/paginated'
import { UpdateRecruiterData } from '@/types/entities/recruiter'
import { Skill } from '@/types/entities/skill'
import { BaseUser, User } from '@/types/entities/user'
import {
  CreateVacancyData,
  GetCandidateVacanciesParams,
  GetRecruiterVacanciesParams,
  GetVacanciesParams,
  RespondToVacancyData,
  Vacancy,
  VacancyStatus,
} from '@/types/entities/vacancy'
import { WorkExperience } from '@/types/entities/work-experience'
import { WorkSchedule } from '@/types/entities/work-schedule'
import { WorkScope } from '@/types/entities/work-scope'
import { WorkType } from '@/types/entities/work-type'
import { TempNews } from './_news-temp'
import {
  CommentResponseData,
  CurCandidateAnswerToResponseData,
  CurRecruiterAnswerToResponseData,
  GetCandidateResponsesParams,
  GetRecruiterResponsesParams,
  GetResponseScheduleParams,
  Response,
} from '@/types/entities/response'
import { Notification } from '@/types/entities/notification'

export const Api = {
  auth: {
    login: (data: LoginData) =>
      Axios.post<User | BaseUser>('/login', data).then((res) => res.data),

    register: (data: RegisterData) => Axios.post('/registration', data),

    logout: () => Axios.post('/logout'),

    changePassword: (data: ChangePasswordData) =>
      Axios.put('/self/password', data),

    forgotPassword: (data: ForgotPasswordData) =>
      Axios.post('/auth/forgot-password/', data),
    resetPassword: (data: ResetPasswordData) =>
      Axios.post('/auth/reset-password/', data),
  },

  users: {
    me: () =>
      Axios.get<User | BaseUser>('/self')
        .then((res) => res.data)
        .catch(() => null),
  },

  responses: {
    schedule: ({ pk, ...params }: GetResponseScheduleParams & { pk: string }) =>
      Axios.get<[{ day: string; slots: string[] }]>(
        `/candidate/responses/${pk}/schedule`,
        { params }
      ).then((res) => res.data),
  },

  recruiters: {
    me: {
      updateProfile: (data: UpdateRecruiterData) =>
        Axios.put('/self/recruiter', data),

      vacancies: (params?: GetRecruiterVacanciesParams) =>
        Axios.get<Paginated<Vacancy[]>>('/recruiter/vacancies', {
          params,
        }).then((res) => res.data),

      responses: (params: GetRecruiterResponsesParams) =>
        Axios.get<
          Paginated<Response[]> & {
            match: Record<'all' | 'gte50' | 'gte70' | 'gte90', number>
          }
        >(`/recruiter/responses`, {
          params,
        }).then((res) => res.data),

      inviteCandidate: (data: InviteCandidateData) =>
        Axios.post('/recruiter/responses', {}, { params: data }),

      answerToResponse: ({
        pk,
        ...data
      }: CurRecruiterAnswerToResponseData & { pk: string }) =>
        Axios.post(`/recruiter/responses/${pk}`, data),

      commentResponse: ({
        pk,
        ...data
      }: CommentResponseData & { pk: string }) =>
        Axios.post(
          `/recruiter/responses/${pk}/commentary`,
          {},
          { params: data }
        ),
    },
  },

  candidates: {
    all: (params?: GetCandidatesParams) =>
      Axios.get<Paginated<Candidate[]>>('/recruiter/candidates', {
        params,
      }).then((res) => res.data),

    one: (pk: string) =>
      Axios.get<Candidate>(`/recruiter/candidates/${pk}`).then(
        (res) => res.data
      ),

    responses: (pk: string) =>
      Axios.get<Response[]>(`/recruiter/candidates/${pk}/history`).then(
        (res) => res.data
      ),

    me: {
      updateProfile: (data: UpdateCandidateData) =>
        Axios.put('/self/candidate', data),

      analyzeCV: (data: any) =>
        Axios.post('/self/candidate/via-file', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then((res) => res.data), // TODO data type

      responses: (params?: GetCandidateResponsesParams) =>
        Axios.get<Paginated<Response[]>>(`/candidate/responses`, {
          params,
        }).then((res) => res.data),

      vacancies: (params?: GetCandidateVacanciesParams) =>
        Axios.get<Paginated<Vacancy[]>>('/candidate/vacancies', {
          params,
        }).then((res) => res.data),

      vacancy: (pk: string) =>
        Axios.get<Vacancy>(`/candidate/vacancies/${pk}`).then(
          (res) => res.data
        ),

      vacancyResponse: (pk: string) =>
        Axios.get<Response | null>(`/candidate/responses/by-vacancy`, {
          params: {
            vacancy_id: pk,
          },
        }).then((res) => res.data),

      answerToResponse: ({
        pk,
        ...data
      }: CurCandidateAnswerToResponseData & { pk: string }) =>
        Axios.post(`/candidate/responses/${pk}`, data),
    },
  },

  vacancies: {
    all: (params?: GetVacanciesParams) =>
      Axios.get<Paginated<Vacancy[]>>('/public/vacancies', { params }).then(
        (res) => res.data
      ),

    findViaCV: (data: any) =>
      Axios.post<Vacancy[]>('/public/vacancies/via-cv', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => res.data, data), // TODO: data type

    one: (pk: string) =>
      Axios.get<Vacancy>(`/public/vacancies/${pk}`).then((res) => res.data),

    create: (data: CreateVacancyData) =>
      Axios.post('/recruiter/vacancies', data),

    update: ({ pk, ...data }: CreateVacancyData & { pk: string }) =>
      Axios.put(`/recruiter/vacancies/${pk}`, data),

    close: (pk: string) =>
      Axios.patch(
        `/recruiter/vacancies/${pk}/status?status=${VacancyStatus.Closed}`
      ),

    respond: (data: RespondToVacancyData) =>
      Axios.post(`/candidate/responses`, {}, { params: data }),

    candidates: (params: GetVacancyCadidatesParams) =>
      Axios.get<
        Paginated<Candidate[]> & {
          match: Record<'all' | 'gte50' | 'gte70' | 'gte90', number>
        }
      >('/recruiter/candidates/by-vacancy', {
        params,
      }).then((res) => res.data),
  },

  notifications: {
    all: () =>
      Axios.get<Notification[]>('/self/notifications').then((res) => res.data),
    read: () => Axios.post('/self/notifications/read'),
  },

  news: {
    all: (params?: GetNewsParams) =>
      Axios.get<Paginated<News[]>>('/news/all', { params })
        .then((res) => res.data)
        .catch(
          (): Paginated<News[]> => ({
            page: 1,
            total_pages: 1,
            items: TempNews,
          })
        ),
    daily: () =>
      Axios.get<News[]>('/news/daily')
        .then((res) => res.data)
        .catch((): News[] => TempNews),

    create: (data: UpdateNewsData) => Axios.post('/recruiter/news', data),
  },

  workScopes: {
    all: () =>
      Axios.get<WorkScope[]>('/public/work-scopes').then((res) => res.data),
  },

  workTypes: {
    all: () =>
      Axios.get<WorkType[]>('/public/work-types').then((res) => res.data),
  },

  workSchedules: {
    all: () =>
      Axios.get<WorkSchedule[]>('/public/work-schedules').then(
        (res) => res.data
      ),
  },

  workExperiences: {
    all: () =>
      Axios.get<WorkExperience[]>('/public/work-experiences').then(
        (res) => res.data
      ),
  },

  skills: {
    all: () => Axios.get<Skill[]>('/public/skills').then((res) => res.data),
  },

  educations: {
    all: () =>
      Axios.get<Education[]>('/public/educations').then((res) => res.data),
  },

  cities: {
    all: () => Axios.get<City[]>('/public/cities').then((res) => res.data),
  },
}
