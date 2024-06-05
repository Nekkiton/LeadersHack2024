import { FC, PropsWithChildren } from 'react'
import { NextPage } from 'next'

export type Page = NextPage & {
  permission?: 'auth'
  layout?: FC<PropsWithChildren>
}
