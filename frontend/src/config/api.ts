import { Axios } from '@/config/axios'
import {
  ForgotPasswordData,
  LoginData,
  RegisterData,
  ResetPasswordData,
} from '@/types/entities/auth'
import {
  Candidate,
  GetCandidatesParams,
  UpdateCandidateData,
} from '@/types/entities/candidate'
import { City } from '@/types/entities/city'
import { Education } from '@/types/entities/education'
import { GetNewsParams, News } from '@/types/entities/news'
import { Paginated } from '@/types/entities/paginated'
import { Recruiter, UpdateRecruiterData } from '@/types/entities/recruiter'
import {
  ResponseStage,
  ResponseStageStatus,
} from '@/types/entities/response-stage'
import { Skill } from '@/types/entities/skill'
import { Stage } from '@/types/entities/stage'
import { BaseUser, Role, User } from '@/types/entities/user'
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
import { WorkHistory } from '@/types/entities/work-history'
import { WorkSchedule } from '@/types/entities/work-schedule'
import { WorkScope } from '@/types/entities/work-scope'
import { WorkType } from '@/types/entities/work-type'
import { TempNews } from './_news-temp'

const workHistory1: WorkHistory = {
  job_title: 'FullStack разработчик',
  company: 'СБЕР',
  start_date: '01.01.2022',
  end_date: null,
  responsabilites:
    'Участие в проектировании архитектуры систем\nСерверная разработка приложений на Python3',
}

const workHistory2: WorkHistory = {
  job_title: 'FullStack разработчик',
  company: 'СБЕР2',
  start_date: '02.02.2022',
  end_date: '02.02.2023',
  responsabilites:
    'Участие в проектировании архитектуры систем\nСерверная разработка приложений на Python3',
}

const recruiter: Recruiter = {
  _id: 'f',
  name: 'Alexey',
  surname: 'Levedev',
  patronymic: 'Sergeevich',
  email: 'email@ya.ru',
  phone: '+7 (999) 999-99-99',
  telegram: 'telegram',
  photo: null,
  role: Role.Recruiter,
  notifications: [],
  interview_per_day: 1,
  interview_slots: [],
  created_at: '10.10.2022',
  updated_at: '10.10.2022',
}

const candidate: Candidate = {
  _id: '2',
  created_at: '10.10.2022',
  updated_at: '10.10.2022',
  role: Role.Candidate,
  name: 'Candidate',
  surname: 'Surname',
  patronymic: 'Patronymic',
  email: 'email@ya.ru',
  phone: '+7 (999) 999-99-99',
  telegram: 'fff',
  birthday: '01.01.2000',
  photo: null,
  city: 'Moscow',
  skills: ['skill 1', 'skill 2'],
  job_title: 'Jot title',
  work_experience: '1',
  education: '1',
  work_history: [workHistory1, workHistory2],
  work_schedule: '1',
  work_type: '1',
  notifications: [],
  responses: [],
  salary_expectation: 100000,
  vacancy_match: 33,
}

const stage1: Stage = {
  _id: '1',
  created_at: '10.10.2022',
  updated_at: '10.10.2022',
  title: 'Неразобранные отклики',
  auto_interview: false,
  approve_template: 'pprove',
  reject_template: 'reject',
  position: 0,
}

const stage2: Stage = {
  _id: '2',
  created_at: '10.10.2022',
  updated_at: '10.10.2022',
  title: 'Первичное интервью',
  auto_interview: false,
  approve_template: '2pprove',
  reject_template: '2reject',
  position: 1,
}

const stage3: Stage = {
  _id: '3',
  created_at: '10.10.2022',
  updated_at: '10.10.2022',
  title: 'Тезхническое интервью',
  auto_interview: false,
  approve_template: '3pprove',
  reject_template: '3reject',
  position: 2,
}

const vacancy: Vacancy = {
  created_at: '10.10.2022',
  updated_at: '10.10.2022',
  _id: '1',
  status: VacancyStatus.Active,
  scope: 'Разработка',
  recruiter: {
    _id: '1',
    created_at: '10.10.2022',
    updated_at: '10.10.2022',
    name: 'Alexey',
    surname: 'Levedev',
    patronymic: 'Sergeevich',
    email: 'email@ya.ru',
    phone: '+7 (999) 999-99-99',
    telegram: 't',
    photo: null,
    role: Role.Recruiter,
    notifications: [],
    interview_per_day: 1,
    interview_slots: [],
  },
  title: 'Vacancy title',
  description: 'some description',
  responsabilities: 'responsibilites',
  conditions: 'conditions\nconditions\nconditions',
  additions: 'additions',
  salary_from: 100000,
  work_experience: '1',
  salary_to: null,
  stages: [stage1, stage2, stage3],
  candidate_expectation: 'expectations',
  work_type: '1',
  work_schedule: '1',
  skills: ['1'],
  recruiter_id: '1',
}

const responseStage1: ResponseStage = {
  _id: '1',
  created_at: '10.10.2022',
  updated_at: '10.10.2022',
  candidate_id: candidate._id,
  candidate: candidate,
  vacancy_id: '1',
  vacancy: vacancy,
  stage_id: '1',
  stage: stage1,
  // status: ResponseStageStatus.WaitingForRecruiter,
  // status: ResponseStageStatus.WaitingForCandidate,
  // status: ResponseStageStatus.ApprovedByRecruiter,
  // status: ResponseStageStatus.RejectedByRecruiter,
  // status: ResponseStageStatus.RejectedByCandidate,
  status: ResponseStageStatus.ApprovedByCandidate,
  meet_link: '',
  recruiter_message: 'Recruiter',
  recruiter_message_timestamp: '2022-01-01T10:00Z',
  meed_date: '',
  candidate_message: 'Candidate',
  candidate_timestamp: '2022-01-01T10:00Z',
}

const responseStage2: ResponseStage = {
  _id: '2',
  created_at: '10.10.2022',
  updated_at: '10.10.2022',
  candidate_id: candidate._id,
  candidate: candidate,
  vacancy_id: '1',
  vacancy: vacancy,
  stage_id: '1',
  stage: stage2,
  // status: ResponseStageStatus.WaitingForRecruiter,
  // status: ResponseStageStatus.ApprovedByRecruiter,
  // status: ResponseStageStatus.RejectedByRecruiter,
  status: ResponseStageStatus.RejectedByCandidate,
  // status: ResponseStageStatus.ApprovedByCandidate,
  meet_link: '',
  recruiter_message: 'Hello world recruiter',
  recruiter_message_timestamp: '2022-01-01T10:00Z',
  meed_date: '',
  candidate_message: 'Hello world candidate',
  candidate_timestamp: '2022-01-01T10:00Z',
}

const responseStage3: ResponseStage = {
  _id: '3',
  created_at: '10.10.2022',
  updated_at: '10.10.2022',
  candidate_id: candidate._id,
  candidate: candidate,
  vacancy_id: '1',
  vacancy: vacancy,
  stage_id: '1',
  stage: stage3,
  status: ResponseStageStatus.WaitingForRecruiter,
  // status: ResponseStageStatus.ApprovedByRecruiter,
  meet_link: '',
  recruiter_message: 'Hello world',
  recruiter_message_timestamp: '2022-01-01T10:00Z',
  meed_date: '',
  candidate_message: 'Hello world',
  candidate_timestamp: '2022-01-01T10:00Z',
}

export const Api = {
  auth: {
    // done
    login: (data: LoginData) =>
      Axios.post<User | BaseUser>('/login', data).then((res) => res.data),
    refresh: () => Axios.post('/refresh'),
    register: (data: RegisterData) => Axios.post('/registration', data),
    logout: () => Axios.post('/logout'),
    // TODO
    forgotPassword: (data: ForgotPasswordData) =>
      Axios.post('/auth/forgot-password/', data),
    resetPassword: (data: ResetPasswordData) =>
      Axios.post('/auth/reset-password/', data),
  },

  // done
  users: {
    me: () =>
      Axios.get<User | BaseUser>('/user')
        .then((res) => res.data)
        // .catch(() => candidate as User),
        // .catch(() => recruiter as User),
        .catch(() => null),
  },

  // TODO
  recruiters: {
    me: {
      updateProfile: (data: UpdateRecruiterData) =>
        Axios.patch('/recruiters/me/', data),
      vacancies: (params?: GetRecruiterVacanciesParams) =>
        Axios.get<Paginated<Vacancy[]>>('/recruiter/me/vacancies', {
          params,
        }).then((res) => res.data),
    },
  },

  candidates: {
    all: (params?: GetCandidatesParams) =>
      Axios.get<Paginated<Candidate[]>>('/candidates/', { params })
        .then((res) => res.data)
        .catch(
          () =>
            ({ data: [candidate], current_page: 1, last_page: 2 } as Paginated<
              Candidate[]
            >)
        ),
    one: (pk: string) =>
      Axios.get<Candidate>(`/candidates/${pk}`)
        .then((res) => res.data)
        .catch(() => candidate),
    me: {
      updateProfile: (data: UpdateCandidateData) =>
        Axios.put('/user/candidate', data),
      updateProfileFromFile: (data: any) => Axios.post('/candidates/me/', data), // TODO: data type
      responses: () =>
        Axios.get<{
          responses: ResponseStage[][]
          invites: ResponseStage[][]
        }>(`/candidates/me/responses`)
          .then((res) => res.data)
          .catch(() => ({
            responses: [[responseStage1], [responseStage1, responseStage2]],
            invites: [[responseStage1], [responseStage1, responseStage2]],
          })),
      vacancies: (params?: GetCandidateVacanciesParams) =>
        Axios.get<Paginated<Vacancy[]>>('/candidate/me/vacancies', {
          params,
        })
          .then((res) => res.data)
          .catch(() => ({
            current_page: 1,
            last_page: 1,
            data: [vacancy],
          })),
      vacancyResponse: (pk: string) =>
        Axios.get<ResponseStage[]>(`/candidate/me/vacancies/${pk}/response`)
          .then((res) => res.data)
          .catch(() => []),
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
                  _id: '1',
                  created_at: '10.10.2022',
                  updated_at: '10.10.2022',
                  responses: [],
                  status: VacancyStatus.Active,
                  scope: 'Разработка',
                  recruiter: recruiter,
                  title: 'Vacancy title',
                  description: 'some description',
                  responsabilities: 'responsibilites',
                  conditions: 'conditions',
                  additions: 'additions',
                  salary_from: 100000,
                  work_experience: '1',
                  salary_to: null,
                  candidate_expectation: 'expectations',
                  work_type: '1',
                  work_schedule: '1',
                  skills: ['1'],
                  recruiter_id: '1',
                  stages: [],
                },
              ],
              current_page: 1,
              last_page: 5,
            } as Paginated<Vacancy[]>)
        ),
    one: (pk: string) =>
      Axios.get<Vacancy>(`/vacancies/${pk}`)
        .then((res) => res.data)
        .catch(() => vacancy),
    // .catch(
    //   () =>
    //     ({
    //       _id: '1',
    //       created_at: '10.10.2022',
    //       updated_at: '10.10.2022',
    //       responses: [responseStage1],
    //       status: VacancyStatus.Active,
    //       scope_id: 'Разработка',
    //       recruiter: {
    //         id: '1',
    //         name: 'Alexey',
    //         surname: 'Levedev',
    //         patronymic: 'Sergeevich',
    //         telegram: 'f',
    //         email: 'email@ya.ru',
    //         phone: '+7 (999) 999-99-99',
    //         birthday: '01.01.2000',
    //         photo: null,
    //         role: Role.Recruiter,
    //         notifications: [],
    //         interview_per_day: 1,
    //         interview_slots: [],
    //       },
    //       title: 'Vacancy title',
    //       description: 'some description',
    //       responsabilities: 'responsibilites',
    //       conditions: 'conditions\nconditions\nconditions',
    //       additions: 'additions',
    //       salary_from: 100000,
    //       work_experience_id: '1',
    //       salary_to: null,
    //       candidate_expectation: 'expectations',
    //       work_type: '1',
    //       work_schedule: '1',
    //       skills: ['1'],
    //       recruiter: '1',
    //       stages: [stage1, stage2, stage3],
    //       creation_date: '12.05.2012',
    //     } as Vacancy)
    // ),
    responses: (pk: string) =>
      Axios.get<{
        statistics: any
        responses: ResponseStage[][] // [[responses of 1st candidate], [responses of 2nd candidate], ...]
      }>(`/vacancies/${pk}/responses/`)
        .then((res) => res.data)
        .catch(() => ({
          statistics: {},
          responses: [
            [responseStage1],
            [responseStage1, responseStage2],
            [responseStage1, responseStage2, responseStage3],
          ],
        })),
    create: (data: CreateVacancyData) => Axios.post('/vacancies', data),
    update: ({ pk, ...data }: CreateVacancyData & { pk: string }) =>
      Axios.post(`/vacancies/${pk}`, data),
    close: (pk: string) => Axios.post(`/vacancies/${pk}/close`),
    respond: ({ pk, ...data }: RespondToVacancyData & { pk: string }) =>
      Axios.post(`/vacancies/${pk}/respond`, data),
  },

  news: {
    all: (params?: GetNewsParams) =>
      Axios.get<Paginated<News[]>>('/news/all', { params })
        .then((res) => res.data)
        .catch(
          (): Paginated<News[]> => ({
            current_page: 1,
            last_page: 1,
            data: TempNews,
          })
        ),
    daily: () =>
      Axios.get<News[]>('/news/daily')
        .then((res) => res.data)
        .catch((): News[] => TempNews),
  },

  workScopes: {
    all: () =>
      Axios.get<WorkScope[]>('/common/work-scopes').then((res) => res.data),
  },

  workTypes: {
    all: () =>
      Axios.get<WorkType[]>('/common/work-types').then((res) => res.data),
  },

  workSchedules: {
    all: () =>
      Axios.get<WorkSchedule[]>('/common/work-schedules').then(
        (res) => res.data
      ),
  },

  workExperiences: {
    all: () =>
      Axios.get<WorkExperience[]>('/common/work-experiences').then(
        (res) => res.data
      ),
  },

  skills: {
    all: () => Axios.get<Skill[]>('/common/skills').then((res) => res.data),
  },

  educations: {
    all: () =>
      Axios.get<Education[]>('/common/educations').then((res) => res.data),
  },

  cities: {
    all: () => Axios.get<City[]>('/common/cities').then((res) => res.data),
  },
}
