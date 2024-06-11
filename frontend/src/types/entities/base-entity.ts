export const BaseEntityPk = '_id' as const

export type BaseEntityPkType = string

export interface BaseEntity {
  [BaseEntityPk]: BaseEntityPkType
  created_at: string
  updated_at: string
}
