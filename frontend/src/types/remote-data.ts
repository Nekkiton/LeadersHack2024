export type RemoteData<V, E> =
  | { status: 'pending' }
  | { status: 'success'; value: V }
  | { status: 'error'; error: E }
