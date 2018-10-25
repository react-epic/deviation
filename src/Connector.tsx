import * as React from 'react'
import { Subscription, noop } from 'rxjs'

import {
  IProviderToStoreMap,
  IStoreRecord,
  InjectableRecord,
  loadInjectables
} from './Injectable'
import { Store, notifier } from './Store'

interface IConnectorProps {
  providers?: IProviderToStoreMap
  injectables?: InjectableRecord
  children?: ((props: any) => React.ReactNode)
  handleError(e: Error): void
}

interface IConnectorState {
  stores: IStoreRecord
}

export class Connector extends React.Component<
  IConnectorProps,
  IConnectorState
> {
  public static defaultProps: Partial<IConnectorProps> = {
    providers: new Map(),
    injectables: {},
    handleError: noop
  }

  public state: IConnectorState = {
    stores: loadInjectables(
      this.props.injectables,
      this.props.providers
    )
  }

  public subscription: Subscription = new Subscription()

  public componentDidMount(): void {
    for (const [provider, store] of this.props.providers) {
      const subscription = store[notifier].subscribe(() => {
        this.setState(({ stores }) => ({
          stores: { ...stores }
        }))
      })

      this.subscription.add(subscription)
    }
  }

  public render(): React.ReactNode {
    const { children } = this.props

    return children(this.state.stores)
  }

  public onReInject(stores: IStoreRecord): void {
    this.setState({ stores })
  }

  public componentDidUpdate(prevProps: IConnectorProps): void {
    const { providers, injectables } = this.props

    if (
      providers !== prevProps.providers ||
      injectables !== prevProps.injectables
    ) {
      /**
       * Perform a side-effect. Replace previous registered store with
       * the current store.
       */
      this.onReInject(loadInjectables(injectables, providers))
    }
  }

  public componentWillUnmount(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
