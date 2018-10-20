import { isFunction } from 'lodash-es'
import { Subject } from 'rxjs'

import { StoreMap } from './Injectable'

export const notifier = Symbol('notifier')

export interface IStoreSetState<S> {
  notifier: Subject<S>
  (a: S | ((S) => S)): void
}

export class Store<P = {}, S = {}> {
  static updateProviders?(
    store: Store<any, any>,
    providers: StoreMap
  ): void

  readonly props: Readonly<P>
  state: S;

  [notifier]: Subject<this> = new Subject()

  constructor(props: P) {
    this.props = props
    this.state = ({} as any) as S
  }

  setStatesetState(func: S | ((S) => S)) {
    if (!this) {
      return
    }

    let newState: S

    if (isFunction(func)) {
      if (this && this.state) {
        newState = func(this && this.state)
      }
    } else {
      newState = func
    }

    if (newState && this.state) {
      const prevState = this.state
      this.state = newState

      if (this.storeDidUpdate) {
        this[notifier].next(
          Object.assign(
            Object.create(this.constructor.prototype),
            this
          )
        )

        this.storeDidUpdate(prevState)
      }
    }
  }

  storeDidMount?(): void
  storeDidUpdate?(prevState: S): void
  storeWillUnmount?(): void
}
