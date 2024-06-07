import { useEffect, useState } from 'react'
import { AppProps } from 'next/app'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Page } from '@/types/page'
import { Site } from '@/config/site'
import moment from 'moment'
import Head from 'next/head'
import Toasts, { ToastsProvider } from '@/components/special/Toasts'
import PermissionManager from '@/components/special/PermissionManager'
import Header from '@/components/layout/Header'
import 'moment/locale/ru'
import '@/assets/css/index.scss'

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
