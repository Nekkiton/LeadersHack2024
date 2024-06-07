import { Vacancy } from '@/types/entities/vacancy'

export const getVacancySalary = (vacancy: Vacancy) => {
  if (vacancy.salary_from && vacancy.salary_to) {
    return `З/п от ${vacancy.salary_from} до ${vacancy.salary_to} ₽`
  } else if (vacancy.salary_from) {
    return `З/п от ${vacancy.salary_from} ₽`
  } else if (vacancy.salary_to) {
    return `З/п до ${vacancy.salary_to} ₽`
  } else {
    return 'З/п не указана'
  }
}
