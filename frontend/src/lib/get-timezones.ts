import { tz } from 'moment-timezone'

export const getTimezones = () => {
  return tz.names().map((i) => ({
    key: i,
    value: `(GMT ${tz(i).format('Z')}). ${i}`,
  }))
}
