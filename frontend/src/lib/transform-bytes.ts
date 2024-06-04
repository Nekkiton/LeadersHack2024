export const transformBytes = (bytes: number) => {
  const SIZES = ['б', 'Кб', 'Мб', 'Гб', 'Тб', 'Пб']

  if (bytes == 0) return '0 Б'

  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const resp =
    parseFloat((bytes / Math.pow(1024, i)).toFixed(0)) + ' ' + SIZES[i]

  return resp
}
