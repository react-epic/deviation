import { Subject } from 'rxjs'

import { isFunction } from './isFunction'
import { StoreMap } from './Deviation'

export interface StoreSetState<S> {
  notifier: Subject<S>
  (a: S | ((S) => S)): void
}

export function createSetState<S>(): StoreSetState<S> {
  function setState(func: S | ((S) => S)) {
    const self = <Store<S, any>>this

    if (!self) {
      return
    }

    let newState: S

    if (isFunction(func)) {
      if (self && self.state)
        newState = func(self && self.state)
    } else {
      newState = func
    }

    if (newState && self.state) {
      const prevState = self.state
      self.state = newState

      if (
        self.setState &&
        self.setState.notifier &&
        self.setState.notifier.next &&
        isFunction(self.setState.notifier.next) &&
        self.constructor &&
        self.constructor.prototype &&
        self.storeDidUpdate
      ) {
        self.setState.notifier.next(
          Object.assign(
            Object.create(self.constructor.prototype),
            this
          )
        )

        self.storeDidUpdate(prevState)
      }
    }
  }

  setState.notifier = new Subject<S>()
  return setState
}

export class Store<P, S> {
  readonly props: Readonly<P>
  state: S

  constructor(props: P) {
    this.props = props
    this.state = <S>{}
  }

  public setState = createSetState<S>()

  storeDidMount() {}

  storeWillUnmount() {}

  storeDidUpdate(prevState: S) {}

  static updateProviders(
    store: Store<any, any>,
    providers: StoreMap
  ): void {}
}

export interface StoreLike extends Store<any, any> {}
