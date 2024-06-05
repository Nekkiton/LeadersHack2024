import { useState } from 'react'
import type { AppProps } from 'next/app'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Page } from '@/types/page'
import Toasts, { ToastsProvider } from '@/components/special/Toasts'
import PermissionManager from '@/components/special/PermissionManager'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import '@/assets/css/index.scss'

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())

  const Layout = (Component as Page).layout

  return (
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
          <Footer />
          <Toasts />
        </ToastsProvider>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
