import { DependencyList, useEffect, useRef } from 'react'

export const useEffectExceptMount = (
  callback: () => void,
  deps: DependencyList,
) => {
  const isMounted = useRef(false)

  useEffect(() => {
    if (isMounted.current) {
      callback()
    } else {
      isMounted.current = true
    }
  }, deps)
}
