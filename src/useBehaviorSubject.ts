import { useEffect, useState, useMemo } from 'react'
import { BehaviorSubject } from 'rxjs'

export const useBehaviorSubject = <T>(
  maybeObservable: BehaviorSubject<T> | (() => BehaviorSubject<T>),
  observableDependencies: any[] = []
): [T, (newValue: T) => any] => {
  const observable = useMemo(
    typeof maybeObservable === 'function' ? maybeObservable : () => maybeObservable,
    [maybeObservable].concat(observableDependencies)
  )
  const [value, setValue] = useState<T>(observable.value)
  useEffect(() => {
    const subscription = observable.subscribe(setValue)
    return () => subscription.unsubscribe()
  }, [observable])
  return [value, (newValue: T) => observable.next(newValue)]
}

export default useBehaviorSubject
