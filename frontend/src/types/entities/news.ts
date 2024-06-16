import { BaseEntity } from '@/types/entities/base-entity'

export interface News extends BaseEntity {
  title: string
  image: string
  text: string
  publication_date: string
}

export interface GetNewsParams {
  page?: number
  limit?: number
}

export interface GetRecruiterNewsParams {
  page?: number
  limit?: number
}

export interface UpdateNewsData {
  title: string
  text: string
  image: string
  publication_date: string
}
