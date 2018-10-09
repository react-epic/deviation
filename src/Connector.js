import React from 'react'
import { Subject } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { extractProviders } from './extractProviders'
import { combineProviders } from './combineProviders'

/**
 * Use `PureComponent` to avoid additional rendering when providers
 * and injectables don't change.
 */
export class Connector extends React.Component {
  state = {
    childProps: extractProviders(
      this.props.providers,
      this.props.injectables
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
      childProps: Object.assign(
        {},
        state.childProps,
        storeWrapper
      )
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
      const injectableProviders = extractProviders(
        providers,
        injectables
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
