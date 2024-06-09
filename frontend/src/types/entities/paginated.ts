export interface Paginated<T> {
  data: T
  current_page: number
  last_page: number
}
