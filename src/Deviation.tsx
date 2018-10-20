import * as React from 'react'

import { isFunction } from 'lodash-es'

import { AnyConstructorType } from './ConstructorType'
import { StoreMap, loadInjectables } from './Injectable'
import { Store } from './Store'
import { StoreInjector } from './StoreInjector'

import { isVariantOf } from './isVariantOf'

export const { Provider, Consumer } = React.createContext(
  new Map()
)

export interface IDeviationProps {
  providers: Array<AnyConstructorType<Store<any, any>>>
  children: JSX.Element
}

export interface IStoreProps {
  providers: Map<
    AnyConstructorType<Store<any, any>>,
    Store<any, any>
  >
}

export class Deviation extends React.Component<
  IDeviationProps,
  any
> {
  constructor(props: IDeviationProps) {
    super(props)

    this.state = {
      providers: new Map()
    }

    for (const provider of this.props.providers) {
      const store = this.instantiate(
        provider,
        this.state.providers
      )
      this.state.providers.set(provider, store)
    }
  }

  instantiate(
    provider: AnyConstructorType<Store<any, any>>,
    providers: StoreMap
  ): Store<Deviation | IStoreProps, any> {
    if (isVariantOf(provider, StoreInjector)) {
      return new provider(this)
    }
    return new provider({ providers })
  }

  componentDidMount() {
    const providers = this.state.providers

    this.updateProviders(providers)

    for (const [provider, store] of providers) {
      if (isFunction(store.storeDidMount)) {
        store.storeDidMount()
      }
    }
  }

  render() {
    const { children } = this.props
    return (
      <Provider value={this.state.providers}>
        {children}
      </Provider>
    )
  }

  updateProviders(providers: StoreMap) {
    /**
     * `setState` only notifies changes to components. This method
     * notifies changes to the stores.
     */
    for (const [provider, store] of providers) {
      if (
        store &&
        store.constructor &&
        (store.constructor as typeof Store).updateProviders
      ) {
        ;(store.constructor as typeof Store).updateProviders(
          store,
          this.state.providers
        )
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    for (const [provider] of prevState) {
      if (!this.state.providers.has(provider)) {
        provider.storeWillUnmount()
      }
    }

    for (const [provider] of this.state.providers) {
      if (!prevState.providers.has(provider)) {
        provider.storeDidMount()
      }
    }

    this.updateProviders(this.state.providers)
  }

  componentWillUnmount() {
    for (const [provider, store] of this.state.providers) {
      if (isFunction(store.storeWillUnmount)) {
        store.storeWillUnmount()
      }
    }
  }
}
