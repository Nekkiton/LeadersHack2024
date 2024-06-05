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
  options?: Omit<UseMutationOptions<Data, AxiosError, Args>, 'mutationFn'> & {
    invalidateQueriesFn?: (args: Args) => InvalidateQueryFilters[]
  }
) => {
  return () => {
    const queryClient = useQueryClient()
    const toasts = useToasts()

    const { mutate, status } = useMutation<Data, AxiosError, Args>({
      mutationFn: func,
      ...options,
      onSuccess: (data, variables, context) => {
        if (options?.invalidateQueriesFn) {
          options
            .invalidateQueriesFn(variables)
            .forEach((i) => queryClient.invalidateQueries(i))
        }
        options?.onSuccess?.(data, variables, context)
      },
      onError: (...args_) => {
        if (!options?.onError?.(...args_)) {
          toasts.error({
            content: 'Что-то пошло не так',
          })
        }
      },
    })

    return { mutate, status }
  }
}
