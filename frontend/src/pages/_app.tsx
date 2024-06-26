import { useEffect, useState } from 'react'
import { AppProps } from 'next/app'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { Page } from '@/types/page'
import { Site } from '@/config/site'
import { useCurUser } from '@/api/users'
import moment from 'moment-timezone'
import Head from 'next/head'
import Toasts, { ToastsProvider } from '@/components/special/Toasts'
import PermissionManager from '@/components/special/PermissionManager'
import Header from '@/components/layout/Header'
import 'moment/locale/ru'
import '@/assets/css/index.scss'

import('date-fns/locale/ru').then((locale) => {
  registerLocale('ru', locale.ru)
  setDefaultLocale('ru')
})

const Settings = () => {
  const user = useCurUser()

  useEffect(() => {
    if (user.status === 'success' && user.value && user.value.name) {
      if (
        (moment as any).defaultZone?.name !== user.value.preferences?.timezone
      ) {
        moment.tz.setDefault(user.value.preferences?.timezone)
      }
    }
  }, [(user as any).value])

  return null
}

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())

  const Layout = (Component as Page).layout

  useEffect(() => {
    moment.locale('ru')
  }, [])

  return (
    <>
      <Head>
        <title>{Site.name}</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {process.env.NEXT_PUBLIC_API_URL?.startsWith('https') && (
          <meta
            http-equiv="Content-Security-Policy"
            content="upgrade-insecure-requests"
          ></meta>
        )}
      </Head>

      <QueryClientProvider client={queryClient}>
        <Settings />
        <div id="app-container">
          <ToastsProvider>
            <Header />
            <PermissionManager permission={(Component as Page).permission}>
              {Layout ? (
                <Layout>{<Component {...pageProps} />}</Layout>
              ) : (
                <Component {...pageProps} />
              )}
            </PermissionManager>
            <Toasts />
          </ToastsProvider>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  )
}
