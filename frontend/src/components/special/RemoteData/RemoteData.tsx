import { ReactNode } from 'react'
import { RemoteData as IRemoteData } from '@/types/remote-data'
import Spinner from '@/components/ui/Spinner'
import styles from './RemoteData.module.scss'

interface Props<V, E> {
  data: IRemoteData<V, E>
  renderSuccess: (val: V) => ReactNode
}

export default function RemoteData<V, E>({ data, renderSuccess }: Props<V, E>) {
  if (data.status === 'success') {
    return renderSuccess(data.value)
  }

  if (data.status === 'error') {
    return <p className={styles.error}>Ошибка при загрузке данных</p>
  }

  return (
    <div className={styles.loader}>
      <Spinner />
    </div>
  )
}
