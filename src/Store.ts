import { isFunction } from 'lodash'
import { Subject } from 'rxjs'

import { IProviderToStoreMap } from './Injectable'

export const notifier: unique symbol = Symbol('notifier')

export class Store<P = {}, S extends Object = {}> {
  public props: Readonly<P>
  public state: S;

  public [notifier]: Subject<S> = new Subject()

  constructor(props: P) {
    this.props = props
    this.state = ({} as any) as S
  }

  public static updateProviders?(
    store: Store<any, any>,
    providers: IProviderToStoreMap
  ): void

  public setState(state: S | ((prevState: S) => S)): void {
    const prevState = this.state

    if (isFunction(state)) {
      this.state = state(this.state)
    } else if (state) {
      this.state = {
        ...(this.state as object),
        ...(state as object)
      } as S
    } else {
      return
    }

    this[notifier].next(prevState)
  }

  public storeDidMount?(): void
  public storeWillUnmount?(): void
}
