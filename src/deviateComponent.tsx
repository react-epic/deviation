import * as React from 'react'

import { Connector } from './Connector'
import { Consumer } from './Deviation'

export function deviateComponent(
  WrappedComponent,
  injectables,
  mergeProps
) {
  class WrapperComponent extends React.Component {
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
        <WrappedComponent {...mergeProps(props, this.props)} />
      )
    }
  }

  return WrapperComponent
}
