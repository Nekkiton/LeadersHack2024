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
  recruiterNews: '/recruiter/news',
  recruiterProfile: '/recruiter/profile',
  recruiterNewVacancy: '/recruiter/new-vacancy',

  candidateVacancies: '/candidate/vacancies',
  candidateProfile: '/candidate/profile',
  candidateResponses: '/candidate/responses',
}
