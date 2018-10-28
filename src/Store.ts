import { isFunction } from 'lodash'
import { Subject } from 'rxjs'

import { IProviderToStoreMap } from './Injectable'

export const notifier: unique symbol = Symbol('notifier')

export class Store<P = {}, S extends Object = {}> {
  public props: Readonly<P>
  public state: S;

  public [notifier]: Subject<any> = new Subject()

  constructor(props: P) {
    this.props = props
    this.state = ({} as any) as S
  }

  public static updateProviders?(
    store: Store<any, any>,
    providers: IProviderToStoreMap
  ): void

  public setState(state: S | ((prevState: S) => S)): void {
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

    this[notifier].next()
  }

  public storeDidMount?(): void
  public storeDidUpdate?(prevState: S): void
  public storeWillUnmount?(): void
}
