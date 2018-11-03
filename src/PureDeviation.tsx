import { isFunction } from 'lodash'
import * as React from 'react'
import { noop } from 'rxjs'

import { AnyConstructorType } from './ConstructorType'
import { Deviation } from './Deviation'
import { IProviderToStoreMap } from './Injectable'
import { Store } from './Store'
import { StoreInjector } from './StoreInjector'

import { isVariantOf } from './isVariantOf'

export interface IPureDeviationProps {
  providers?: AnyConstructorType<Store<any, any>>[]
  defaultProviders: IProviderToStoreMap
  children?: JSX.Element
  handleError?(e: Error): void
}

export interface IPureDeviationState {
  providers: IProviderToStoreMap
  handleError(e: Error): void
}

export interface IStoreProps {
  providers: Map<
    AnyConstructorType<Store<any, any>>,
    Store<any, any>
  >
}

export const DeviationContext = React.createContext({
  providers: new Map(),
  handleError: noop
})

export const Provider: React.Provider<IPureDeviationState> =
  DeviationContext.Provider
export const Consumer: React.Consumer<IPureDeviationState> =
  DeviationContext.Consumer

export class PureDeviation extends React.Component<
  IPureDeviationProps,
  IPureDeviationState
> {
  public static defaultProps: IPureDeviationProps = {
    defaultProviders: new Map(),
    providers: [],
    handleError: noop
  }

  public state: IPureDeviationState = {
    providers: new Map(this.props.defaultProviders),
    handleError: this.props.handleError
  }

  constructor(props: IPureDeviationProps) {
    super(props)

    for (const provider of Array.from(this.props.providers)) {
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

    for (const [provider, store] of Array.from(providers)) {
      if (isFunction(store.storeDidMount)) {
        store.storeDidMount()
      }
    }
  }

  public render(): React.ReactNode {
    return (
      <Provider value={this.state}>
        {this.props.children}
      </Provider>
    )
  }

  public updateProviders(providers: IProviderToStoreMap): void {
    /**
     * `setState` only notifies changes to components. This method
     * notifies changes to the stores.
     */
    for (const [provider, store] of Array.from(providers)) {
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
    prevProps: IPureDeviationProps,
    prevState: IPureDeviationState
  ): void {
    for (const [provider, store] of Array.from(
      prevState.providers
    )) {
      if (!this.state.providers.has(provider)) {
        store.storeWillUnmount()
      }
    }

    for (const [provider, store] of Array.from(
      this.state.providers
    )) {
      if (!prevState.providers.has(provider)) {
        store.storeDidMount()
      }
    }

    this.updateProviders(this.state.providers)
  }

  public componentWillUnmount(): void {
    for (const [provider, store] of Array.from(
      this.state.providers
    )) {
      if (isFunction(store.storeWillUnmount)) {
        store.storeWillUnmount()
      }
    }
  }
}
