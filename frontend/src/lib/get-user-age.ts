import moment from 'moment'

export const getUserAge = (birthday: string) => {
  return moment
    .duration(moment().diff(moment(birthday), 'year'), 'year')
    .humanize()
}
