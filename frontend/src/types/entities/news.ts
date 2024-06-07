import { BaseEntity } from '@/types/entities/base-entity'

export interface News extends BaseEntity {
  title: string
  image: any
  text: string
  publication_date: string
  source: string
  is_parsed: boolean
}
