import { useEffect, useState } from 'react'
import { AppProps } from 'next/app'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { Page } from '@/types/page'
import { Site } from '@/config/site'
import moment from 'moment'
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
        <meta
          http-equiv="Content-Security-Policy-Report-Only"
          content="default-src https: 'unsafe-inline' 'unsafe-eval';"
        />
      </Head>

      <QueryClientProvider client={queryClient}>
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
