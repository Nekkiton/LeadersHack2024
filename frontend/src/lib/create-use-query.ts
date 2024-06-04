import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { RemoteData } from '@/types/remote-data'

interface ExtraOptions extends Pick<UseQueryOptions, 'enabled'> {}

export const createUseQuery = <Args extends unknown[], Data>(
  key: string,
  func: (...args: Args) => Promise<Data>,
  options?: Omit<
    UseQueryOptions<Promise<Data>, AxiosError, Data>,
    'queryKey' | 'queryFn'
  >
) => {
  return (
    ...args: [...Args, extraOptions?: ExtraOptions]
  ): RemoteData<Data, AxiosError> => {
    let extraOptions: ExtraOptions = {}
    if (args.length > func.length) {
      extraOptions = args.splice(args.length - 1, 1)[0] as ExtraOptions
    }

    const { data, status, error } = useQuery<Promise<Data>, AxiosError, Data>({
      queryKey: [key, args],
      queryFn: () => func(...(args as any as Args)), // TODO: is that cool
      ...options,
      ...extraOptions,
    })

    if (status === 'error') {
      return { status: 'error', error }
    } else if (status === 'success') {
      return { status: 'success', value: data }
    } else {
      return { status: 'pending' }
    }
  }
}
