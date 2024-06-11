export interface Paginated<T> {
  items: T
  page: number
  total_pages: number
}
