import React, { createContext } from 'react'

import { Store } from './Store'
import { Connector } from './Connector'
import { extractProviders } from './extractProviders'
import { StoreInjector } from './StoreInjector'
import { isSubClass } from './isSubClass'
import { isFunction } from './isFunction'

const { Provider, Consumer } = createContext()

export class Deviation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      providers: new Map()
    }

    for (const Instance of this.props.providers) {
      const store = this.instantiate(
        Instance,
        this.state.providers
      )
      this.state.providers.set(Instance, store)
    }
  }

  instantiate(Instance, providers) {
    if (isSubClass(Instance, StoreInjector)) {
      return new Instance(this)
    }
    return new Instance({ providers })
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

  updateProviders(providers) {
    /**
     * `setState` only notifies changes to components. This method
     * notifies changes to the stores.
     */
    for (const [provider, store] of providers) {
      if (
        store &&
        store.constructor &&
        store.constructor.updateProviders
      ) {
        store.constructor.updateProviders(
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
    for (const [provider, store] of providers) {
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
    if (!isSubClass(WrappedComponent, Store)) {
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
    } else {
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
    }
  }
}
