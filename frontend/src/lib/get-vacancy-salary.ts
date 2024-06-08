import { Vacancy } from '@/types/entities/vacancy'

export const getVacancySalary = (vacancy: Vacancy, noPrefix = false) => {
  let result = 'З/п не указана'

  if (vacancy.salary_from && vacancy.salary_to) {
    result = `З/п от ${vacancy.salary_from} до ${vacancy.salary_to} ₽`
  } else if (vacancy.salary_from) {
    result = `З/п от ${vacancy.salary_from} ₽`
  } else if (vacancy.salary_to) {
    result = `З/п до ${vacancy.salary_to} ₽`
  }

  if (noPrefix) {
    return result.slice(3)
  } else {
    return result
  }
}
