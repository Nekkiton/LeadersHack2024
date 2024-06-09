import { Axios } from '@/config/axios'
import {
  ForgotPasswordData,
  LoginData,
  RegisterData,
  ResetPasswordData,
} from '@/types/entities/auth'
import { Candidate, GetCandidatesParams } from '@/types/entities/candidate'
import { Education } from '@/types/entities/education'
import { Paginated } from '@/types/entities/paginated'
import { Recruiter } from '@/types/entities/recruiter'
import {
  ResponseStage,
  ResponseStageStatus,
} from '@/types/entities/response-stage'
import { Skill } from '@/types/entities/skill'
import { Stage } from '@/types/entities/stage'
import { Role, User } from '@/types/entities/user'
import {
  GetVacanciesParams,
  Vacancy,
  VacancyStatus,
} from '@/types/entities/vacancy'
import { WorkExperience } from '@/types/entities/work-experience'
import { WorkHistory } from '@/types/entities/work-history'
import { WorkSchedule } from '@/types/entities/work-schedule'
import { WorkScope } from '@/types/entities/work-scope'
import { WorkType } from '@/types/entities/work-type'

const workHistory1: WorkHistory = {
  id: '1',
  job_title: 'FullStack разработчик',
  company: 'СБЕР',
  start_date: '01.01.2022',
  end_date: null,
  responsibilities:
    'Участие в проектировании архитектуры систем\nСерверная разработка приложений на Python3',
}

const workHistory2: WorkHistory = {
  id: '2',
  job_title: 'FullStack разработчик',
  company: 'СБЕР2',
  start_date: '02.02.2022',
  end_date: '02.02.2023',
  responsibilities:
    'Участие в проектировании архитектуры систем\nСерверная разработка приложений на Python3',
}

const recruiter: Recruiter = {
  id: 'f',
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
}

const candidate: Candidate = {
  id: '2',
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
  work_experience_id: '1',
  education_id: '1',
  work_history: [workHistory1, workHistory2],
  work_schedule_id: '1',
  work_type_id: '1',
  notifications: [],
  responses: [],
  salary_expectation: 100000,
  vacancy_match: 33,
}

const stage1: Stage = {
  id: '1',
  title: 'Неразобранные отклики',
  auto_interview: false,
  approve_template: 'pprove',
  reject_template: 'reject',
  position: 0,
}

const stage2: Stage = {
  id: '2',
  title: 'Первичное интервью',
  auto_interview: false,
  approve_template: '2pprove',
  reject_template: '2reject',
  position: 1,
}

const stage3: Stage = {
  id: '3',
  title: 'Тезхническое интервью',
  auto_interview: false,
  approve_template: '3pprove',
  reject_template: '3reject',
  position: 2,
}

const responseStage1: ResponseStage = {
  id: '1',
  candidate_id: candidate.id,
  candidate: candidate,
  vacancy_id: '1',
  stage_id: '1',
  stage: stage1,
  // status: ResponseStageStatus.WaitingForRecruiter,
  // status: ResponseStageStatus.WaitingForCandidate,
  // status: ResponseStageStatus.ApprovedByRecruiter,
  // status: ResponseStageStatus.RejectedByRecruiter,
  status: ResponseStageStatus.RejectedByCandidate,
  // status: ResponseStageStatus.ApprovedByCandidate,
  meet_link: '',
  recruiter_message: 'Recruiter',
  recruiter_message_timestamp: '2022-01-01T10:00Z',
  meed_date: '',
  candidate_message: 'Candidate',
  candidate_timestamp: '2022-01-01T10:00Z',
}

const responseStage2: ResponseStage = {
  id: '2',
  candidate_id: candidate.id,
  candidate: candidate,
  vacancy_id: '1',
  stage_id: '1',
  stage: stage2,
  status: ResponseStageStatus.WaitingForRecruiter,
  // status: ResponseStageStatus.ApprovedByRecruiter,
  // status: ResponseStageStatus.RejectedByRecruiter,
  // status: ResponseStageStatus.RejectedByCandidate,
  // status: ResponseStageStatus.ApprovedByCandidate,
  meet_link: '',
  recruiter_message: 'Hello world recruiter',
  recruiter_message_timestamp: '2022-01-01T10:00Z',
  meed_date: '',
  candidate_message: 'Hello world candidate',
  candidate_timestamp: '2022-01-01T10:00Z',
}

const responseStage3: ResponseStage = {
  id: '3',
  candidate_id: candidate.id,
  candidate: candidate,
  vacancy_id: '1',
  stage_id: '1',
  stage: stage3,
  status: ResponseStageStatus.WaitingForRecruiter,
  meet_link: '',
  recruiter_message: 'Hello world',
  recruiter_message_timestamp: '2022-01-01T10:00Z',
  meed_date: '',
  candidate_message: 'Hello world',
  candidate_timestamp: '2022-01-01T10:00Z',
}

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
        .catch(() => recruiter as User),
    // .catch(() => candidate as User),
    // .catch(() => null),
  },

  recruiters: {
    all: () =>
      Axios.get<Recruiter[]>('/recruiters/')
        .then((res) => res.data)
        .catch(() => [recruiter]),
    me: {
      updateProfile: (data: any) => Axios.patch('/recruiters/me/', data), // TODO: data type
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
      updateProfile: (data: any) => Axios.patch('/candidates/me/', data), // TODO: data type
      updateProfileFromFile: (data: any) => Axios.post('/candidates/me/', data), // TODO: data type
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
                  responses: [],
                  status: VacancyStatus.Active,
                  scope_id: 'Разработка',
                  recruiter: recruiter,
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
    one: (pk: string) =>
      Axios.get<Vacancy>(`/vacancies/${pk}`)
        .then((res) => res.data)
        .catch(
          () =>
            ({
              id: '1',
              responses: [responseStage1],
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
              conditions: 'conditions\nconditions\nconditions',
              additions: 'additions',
              salary_from: 100000,
              work_experience_id: '1',
              salary_to: null,
              candidate_expectation: 'expectations',
              work_type_id: '1',
              work_schedule_id: '1',
              skills: ['1'],
              recruiter_id: '1',
              stages: [stage1, stage2, stage3],
              creation_date: '12.05.2012',
            } as Vacancy)
        ),
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
    create: (data: any) => Axios.post('/vacancies/', data), // TODO: data type
    respond: ({ pk, ...data }: any) =>
      Axios.post(`/vacancies/${pk}/respond`, data), // TODO: data type
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
