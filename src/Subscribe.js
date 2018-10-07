import React from 'react'

import { combineSubscriptions } from './combineSubscriptions'

export class Registry {
  constructor({ notifier }) {
    this.notifier = notifier
    this.subscription = null
  }

  setProviders(injectableProviders) {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }

    this.subscription = combineSubscriptions(
      Object.keys(injectableProviders).map(key => {
        injectableProviders[key].setState.notifier.subscribe(
          providerState =>
            this.notifier({
              [key]: providerState
            })
        )
      })
    )
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}

export function extractProviders(providers, injectables) {
  return Object.keys(injectables)
    .map(key => ({
      [key]: providers.find(
        provider => provider.constructor === injectables[key]
      )
    }))
    .reduce((props, next) => Object.assign(props, next), {})
}

/**
 * Use `PureComponent` to avoid additional rendering when providers
 * and injectables don't change.
 */
export class Subscribe extends React.PureComponent {
  state = {
    childProps: extractProviders(
      this.props.providers,
      this.props.injectables
    )
  }

  componentDidMount() {
    this.registry = new Registry({
      notifier: this.updateChildProps
    })

    this.registry.setProviders(this.state.childProps)
  }

  updateChildProps = providerStateWrapper => {
    this.setState(state => {
      /**
       * Clone `childProps`.
       */
      const childProps = Object.assign({}, state.childProps)

      for (const key of Object.keys(providerStateWrapper)) {
        /**
         * Clone updated provider and provide it with a new state.
         */
        childProps[key] = Object.assign(
          {},
          /**
           * Assign the provider with its new state.
           */
          childProps[key],
          providerStateWrapper
        )
      }

      return {
        childProps
      }
    })
  }

  render() {
    const { children } = this.props
    return children(this.state.childProps)
  }

  componentDidUpdate(prevProps) {
    const { providers, injectables } = this.props

    if (
      providers !== prevProps.providers ||
      injectables !== prevProps.injectables
    ) {
      /**
       * Perform a side-effect. Replace previous registered store with
       * the current store.
       */
      const injectableProviders = extractProviders(
        providers,
        injectables
      )

      this.registry.setProviders(injectableProviders)

      this.setState({ childProps: injectableProviders })
    }
  }

  unsubscribe() {
    this.registry.unsubscribe()
  }
}
