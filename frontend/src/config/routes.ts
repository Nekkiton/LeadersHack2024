export const Routes = {
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  privacy: '/privacy',

  recruiterVacancies: '/recruiter/vacancies',
  recruiterVacancy: (pk: string) => `/recruiter/vacancies/${pk}`,
  recruiterCandidates: '/recruiter/candidates',
  recruiterCandidate: (pk: string) => `/recruiter/candidates/${pk}`,
  recruiterNews: '/recruiter/news',
  recruiterProfile: '/recruiter/profile',
  recruiterNewVacancy: '/recruiter/new-vacancy',

  candidateVacancies: '/candidate/vacancies',
  candidateVacancy: (pk: string) => `/candidate/vacancies/${pk}`,
  candidateProfile: '/candidate/profile',
  candidateResponses: '/candidate/responses',
}
