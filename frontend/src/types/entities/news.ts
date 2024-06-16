import { BaseEntity } from '@/types/entities/base-entity'

export interface News extends BaseEntity {
  title: string
  image: true
  text: string
  source: string
  // is_parsed: boolean
}

export interface GetNewsParams {
  page?: number
}

export interface UpdateNewsData {
  title: string
  text: string
  image: string
  publication_date: string
}
