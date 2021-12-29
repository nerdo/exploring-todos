import { createElement, ComponentType, useState, useEffect, ReactElement } from 'react'
import { Observable } from 'rxjs'

export interface Options<P> {
  props?: Partial<P>
}

export const subscribed =
  <T extends Partial<P>, P extends {}>(
    observable$: Observable<T>,
    initialValue: T,
    options: Options<P> = {}
  ) =>
  (Component: ComponentType<P>) =>
  (props: {}): ReactElement => {
    const [state, setState] = useState<T>(initialValue)
    useEffect(() => {
      const subscription = observable$.subscribe((newState) => setState({ ...newState }))
      return () => {
        subscription.unsubscribe()
      }
    }, [])
    return createElement(Component, { ...(props as P), ...state, ...(options.props || {}) })
  }
