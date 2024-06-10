import { NextRouter, useRouter } from 'next/router'
import {
  InvalidateQueryFilters,
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useToasts } from '@/lib/use-toasts'
import { AxiosError } from 'axios'

export const createUseMutation = <Args, Data>(
  func: (args: Args) => Promise<Data>,
  options?: Omit<
    UseMutationOptions<Data, AxiosError, Args>,
    'mutationFn' | 'onError' | 'onSuccess'
  > & {
    invalidateQueriesFn?: (args: Args) => InvalidateQueryFilters[]
    onError?: (
      [error, variables, context]: [AxiosError, Args, unknown],
      utils: { toasts: ReturnType<typeof useToasts>; router: NextRouter }
    ) => boolean | void
    onSuccess?: (
      [data, variables, context]: [Data, Args, unknown],
      utils: { toasts: ReturnType<typeof useToasts>; router: NextRouter }
    ) => void
  }
) => {
  return () => {
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
        options?.onSuccess?.([data, variables, context], { toasts, router })
      },
      onError: (...args_) => {
        if (!options?.onError?.(args_, { toasts, router })) {
          toasts.error({
            content: 'Что-то пошло не так',
          })
        }
      },
    })

    return { mutate, status }
  }
}
