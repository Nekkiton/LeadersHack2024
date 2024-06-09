import { FC, PropsWithChildren } from 'react'
import { NextPage } from 'next'
import { Role } from '@/types/entities/user'

export type Page = NextPage & {
  permission?: 'auth' | Role
  layout?: FC<PropsWithChildren>
}
