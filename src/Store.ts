import { Subject } from 'rxjs'

import { IProviderToStoreMap } from './Injectable'

export const notifier: unique symbol = Symbol('notifier')

export class Store<P = {}, S = {}> {
  public props: Readonly<P>
  public state: S;

  public [notifier]: Subject<
    S | ((prevState: S) => S)
  > = new Subject()

  constructor(props: P) {
    this.props = props
    this.state = ({} as any) as S
  }

  public static updateProviders?(
    store: Store<any, any>,
    providers: IProviderToStoreMap
  ): void

  public setState(state: S | ((prevState: S) => S)): void {
    this[notifier].next(state)
  }

  public storeDidMount?(): void
  public storeDidUpdate?(prevState: S): void
  public storeWillUnmount?(): void
}
