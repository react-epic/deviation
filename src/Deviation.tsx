import * as React from 'react'

import { isFunction } from 'lodash'
import { noop } from 'rxjs'

import { AnyConstructorType } from './ConstructorType'
import { IProviderToStoreMap } from './Injectable'
import { Store } from './Store'
import { StoreInjector } from './StoreInjector'

import { isVariantOf } from './isVariantOf'

export interface IDeviationProps {
  providers?: AnyConstructorType<Store<any, any>>[]
  children?: JSX.Element
  handleError?(e: Error): void
}

export interface IDeviationState {
  providers: IProviderToStoreMap
  handleError(e: Error): void
}

export interface IStoreProps {
  providers: Map<
    AnyConstructorType<Store<any, any>>,
    Store<any, any>
  >
}

const context = React.createContext({
  providers: new Map(),
  handleError: noop
})

export const Provider: React.Provider<IDeviationState> =
  context.Provider
export const Consumer: React.Consumer<IDeviationState> =
  context.Consumer

export class Deviation extends React.Component<
  IDeviationProps,
  any
> {
  public static defaultProps: Partial<IDeviationProps> = {
    providers: [],
    handleError: noop
  }

  public state: IDeviationState = {
    providers: new Map(),
    handleError: this.props.handleError
  }

  constructor(props: IDeviationProps) {
    super(props)

    for (const provider of this.props.providers) {
      const store = this.instantiate(
        provider,
        this.state.providers
      )
      this.state.providers.set(provider, store)
    }
  }

  public instantiate(
    provider: AnyConstructorType<Store<any, any>>,
    providers: IProviderToStoreMap
  ): Store<Deviation | IStoreProps, any> {
    if (isVariantOf(provider, StoreInjector)) {
      return new provider(this)
    }

    return new provider({ providers })
  }

  public componentDidMount(): void {
    const providers = this.state.providers

    this.updateProviders(providers)

    for (const [provider, store] of providers) {
      if (isFunction(store.storeDidMount)) {
        store.storeDidMount()
      }
    }
  }

  public render(): React.ReactNode {
    const { children } = this.props

    return <Provider value={this.state}>{children}</Provider>
  }

  public updateProviders(providers: IProviderToStoreMap): void {
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

  public componentDidUpdate(
    prevProps: IDeviationProps,
    prevState: IDeviationState
  ): void {
    for (const [provider, store] of prevState.providers) {
      if (!this.state.providers.has(provider)) {
        store.storeWillUnmount()
      }
    }

    for (const [provider, store] of this.state.providers) {
      if (!prevState.providers.has(provider)) {
        store.storeDidMount()
      }
    }

    this.updateProviders(this.state.providers)
  }

  public componentWillUnmount(): void {
    for (const [provider, store] of this.state.providers) {
      if (isFunction(store.storeWillUnmount)) {
        store.storeWillUnmount()
      }
    }
  }
}
