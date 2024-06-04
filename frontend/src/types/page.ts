import { NextPage } from 'next'

export type Page = NextPage & {
  permission?: 'auth'
}
