import { NextRouter, useRouter } from 'next/router'
import {
  InvalidateQueryFilters,
  QueryClient,
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useToasts } from '@/lib/use-toasts'
import { AxiosError } from 'axios'
import { UseFormSetError } from 'react-hook-form'

export const createUseMutation = <Args, Data>(
  func: (args: Args) => Promise<Data>,
  options?: Omit<
    UseMutationOptions<Data, AxiosError, Args>,
    'mutationFn' | 'onError' | 'onSuccess'
  > & {
    invalidateQueriesFn?: (args: Args) => InvalidateQueryFilters[]
    onError?: (
      [error, variables, context]: [AxiosError, Args, unknown],
      utils: {
        toasts: ReturnType<typeof useToasts>
        router: NextRouter
        queryClient: QueryClient
        setError?: UseFormSetError<any>
      }
    ) => boolean | void
    onSuccess?: (
      [data, variables, context]: [Data, Args, unknown],
      utils: {
        toasts: ReturnType<typeof useToasts>
        router: NextRouter
        queryClient: QueryClient
      }
    ) => void
  }
) => {
  return (extraOptions?: {
    setError?: UseFormSetError<any>
    handleError?: boolean
  }) => {
    const queryClient = useQueryClient()
    const toasts = useToasts()
    const router = useRouter()

    const { mutate, status } = useMutation<Data, AxiosError, Args>({
      mutationFn: func,
      ...options,
      onSuccess: (data, variables, context) => {
        if (options?.invalidateQueriesFn) {
          options
            .invalidateQueriesFn(variables)
            .forEach((i) => queryClient.invalidateQueries(i))
        }
        options?.onSuccess?.([data, variables, context], {
          toasts,
          router,
          queryClient,
        })
      },
      onError: (...args_) => {
        if (
          !options?.onError?.(args_, {
            toasts,
            router,
            queryClient,
            setError: extraOptions?.setError,
          }) &&
          (extraOptions?.handleError ?? true)
        ) {
          const detail = (args_[0].response?.data as any)?.detail
          if (typeof detail === 'string') {
            toasts.error({
              content: (args_[0].response?.data as any)?.detail,
            })
          } else {
            toasts.error({
              content: 'Что-то пошло не так',
            })
          }
        }
      },
    })

    return { mutate, status }
  }
}
