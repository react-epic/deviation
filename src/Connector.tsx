import * as React from 'react'
import { Subject, Subscription } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import {
  IProviderToStoreMap,
  IStoreRecord,
  InjectableRecord,
  loadInjectables
} from './Injectable'
import { Store } from './Store'

interface IConnectorProps {
  providers?: IProviderToStoreMap
  injectables?: InjectableRecord
  children?: React.ReactChildren &
    ((props: any) => React.Component)
}

interface IConnectorState {
  childProps: IStoreRecord
}

export class Connector extends React.Component<
  IConnectorProps,
  IConnectorState
> {
  public state: IConnectorState = {
    childProps: loadInjectables(
      this.props.injectables,
      this.props.providers
    )
  }

  public injectableProviders = new Subject<
    Record<string, Store<any, any>>
  >()
  public subscription: Subscription = null

  public componentDidMount() {
    this.subscription = this.injectableProviders
      .pipe(switchMap(mergeNotifiers))
      .subscribe(this.onStateChange)

    this.injectableProviders.next(this.state.childProps)
  }

  public onStateChange = storeWrapper => {
    this.setState(state => ({
      childProps: {
        ...state.childProps,
        ...storeWrapper
      }
    }))
  }

  public render() {
    const { children } = this.props
    return children(this.state.childProps)
  }

  public componentDidUpdate(prevProps) {
    const { providers, injectables } = this.props

    if (
      providers !== prevProps.providers ||
      injectables !== prevProps.injectables
    ) {
      /**
       * Perform a side-effect. Replace previous registered store with
       * the current store.
       */
      const injectableProviders = loadInjectables(
        injectables,
        providers
      )
    }
  }

  public componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
