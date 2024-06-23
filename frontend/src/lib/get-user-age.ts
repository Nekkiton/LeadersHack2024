import moment from 'moment-timezone'

export const getUserAge = (birthday: string) => {
  return moment
    .duration(moment().diff(moment(`${birthday}Z`), 'year'), 'year')
    .humanize()
}
