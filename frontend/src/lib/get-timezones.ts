import { tz } from 'moment-timezone'

export const getTimezones = () => {
  return tz
    .names()
    .map((i) => ({
      key: i,
      value: `(GMT ${tz(i).format('Z')}). ${i}`,
    }))
    .sort((a, b) => tz(a.key).format('Z').localeCompare(tz(b.key).format('Z')))
}
