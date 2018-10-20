import React from 'react'
import { Subject } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { combineProviders } from './combineProviders'
import { Injectable, StoreMap, loadInjectables } from './Injectable'

interface IConnectorProps {
  providers?: StoreMap
  injectables?: Record<string, Injectable>
  children?: React.ReactChildren & ((props) => React.Component)
}

export class Connector extends React.Component<
  IConnectorProps,
  any
> {
  state = {
    childProps: loadInjectables(
      this.props.injectables,
      this.props.providers
    )
  }

  injectableProviders = new Subject()
  subscription = null

  componentDidMount() {
    this.subscription = this.injectableProviders
      .pipe(switchMap(combineProviders))
      .subscribe(this.onStateChange)

    this.injectableProviders.next(this.state.childProps)
  }

  onStateChange = storeWrapper => {
    this.setState(state => ({
      childProps: {
        ...state.childProps,
        ...storeWrapper
      }
    }))
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
      const injectableProviders = loadInjectables(
        injectables,
        providers
      )

      /**
       * Allows re-injecting the providers. The providers need to be
       * re-instantiated to be re-injected.
       */
      this.injectableProviders.next(injectableProviders)
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
