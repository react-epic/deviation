import React, { createContext } from 'react'

import { Subscribe, extractProviders } from './Subscribe'
import { isFunction } from './isFunction'

const { Provider: ContextProvider, Consumer } = createContext()

export class Provider extends React.Component {
  state = {
    providers: this.props.providers.map(
      Instance => new Instance()
    )
  }

  componentDidMount() {
    for (const provider of this.state.providers) {
      if (
        provider &&
        provider.providerDidMount &&
        isFunction(provider.providerDidMount)
      ) {
        provider.providerDidMount()
      }
    }
  }

  render() {
    const { children } = this.props
    return (
      <ContextProvider value={this.state.providers}>
        {children}
      </ContextProvider>
    )
  }
}

export function defaultMergeProps(injectableProviders, props) {
  return Object.assign({}, injectableProviders, props)
}

export function Deviate(injectables, mergeProps) {
  mergeProps = mergeProps || defaultMergeProps

  return function deviateComponent(WrappedComponent) {
    if (!(WrappedComponent instanceof Store)) {
      class DeviatedComponent extends React.Component {
        state = {}

        render() {
          return <Consumer>{this.renderContext}</Consumer>
        }

        renderContext = context => {
          return (
            <Subscribe
              providers={context}
              injectables={injectables}
            >
              {this.renderProps}
            </Subscribe>
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
      class DeviatedComponent extends WrappedComponent {
        constructor(providers) {
          const injectableProviders = extractProviders(
            providers,
            injectables
          )

          super(injectableProviders)
        }
      }

      return DeviatedComponent
    }
  }
}
