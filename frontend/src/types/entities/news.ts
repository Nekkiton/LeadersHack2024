import { BaseEntity } from '@/types/entities/base-entity'

export interface News extends BaseEntity {
  title: string
  image: any
  text: string
  source: string
  is_parsed: boolean
}

export interface GetNewsParams {
  page?: number
}
