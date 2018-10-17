import React, { createContext } from 'react'

import { Store, StoreLike } from './Store'
import { Connector } from './Connector'
import { extractProviders } from './extractProviders'
import { StoreInjector } from './StoreInjector'
import { isVariantOf } from './isVariantOf'
import { isFunction } from './isFunction'
import { AnyConstructorType } from './ConstructorType'

export const { Provider, Consumer } = createContext(new Map())

export interface DeviationProps {
  providers: AnyConstructorType<Store<any, any>>[]
  children: JSX.Element
}

export interface StoreProps {
  providers: Map<
    AnyConstructorType<Store<any, any>>,
    Store<any, any>
  >
}

export type StoreMap = Map<
  AnyConstructorType<StoreLike>,
  Store<any, any>
>

export class Deviation extends React.Component<
  DeviationProps,
  any
> {
  constructor(props: DeviationProps) {
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
  ): Store<Deviation | StoreProps, any> {
    if (
      isVariantOf<StoreInjector<any>>(provider, StoreInjector)
    ) {
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
    for (let [provider] of prevState) {
      if (!this.state.providers.has(provider)) {
        provider.storeWillUnmount()
      }
    }

    for (let [provider] of this.state.providers) {
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

export function defaultMergeProps(injectableProviders, props) {
  return Object.assign({}, injectableProviders, props)
}

export function Inject(injectables, mergeProps) {
  mergeProps = mergeProps || defaultMergeProps

  return function deviateComponent(WrappedComponent) {
    if (isVariantOf(WrappedComponent, React.Component)) {
      class DeviatedComponent extends React.Component {
        state = {}

        render() {
          return <Consumer>{this.renderContext}</Consumer>
        }

        renderContext = context => {
          return (
            <Connector
              providers={context}
              injectables={injectables}
            >
              {this.renderProps}
            </Connector>
          )
        }

        renderProps = props => {
          return (
            <WrappedComponent
              {...mergeProps(props, this.props)}
            />
          )
        }
      }

      return DeviatedComponent
    } else if (isVariantOf(WrappedComponent, Store)) {
      class DeviatedStore extends WrappedComponent {
        constructor(props) {
          const { providers } = props

          const injectableProviders = extractProviders(
            providers,
            injectables
          )

          super(mergeProps(injectableProviders, props))
        }

        static updateProviders(store, providers) {
          store.props = Object.assign(
            store.props,
            mergeProps(
              extractProviders(providers, injectables),
              { providers }
            )
          )
        }
      }

      return DeviatedStore
    } else {
      return WrappedComponent
    }
  }
}
