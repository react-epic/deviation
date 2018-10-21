import * as React from 'react'

import { Connector } from './Connector'
import { AnyConstructorType } from './ConstructorType'
import { Consumer, IDeviationState } from './Deviation'
import { IStoreRecord, InjectableRecord } from './Injectable'

type GetProps<T> = T extends { propTypes: infer P } ? P : never

export function deviateComponent<P, S>(
  WrappedComponent: AnyConstructorType<React.Component<P, S>>,
  injectables: InjectableRecord,
  mergeProps: (
    injectableProviders: IStoreRecord,
    props: any
  ) => any
): typeof WrappedComponent {
  class WrapperComponent extends React.Component<P, S> {
    public render(): React.ReactNode {
      return <Consumer>{this.renderContext}</Consumer>
    }

    public renderContext = (context: IDeviationState) => {
      return (
        <Connector
          providers={context.providers}
          injectables={injectables}
          handleError={context.handleError}
        >
          {this.renderProps}
        </Connector>
      )
    }

    public renderProps = (
      props: IStoreRecord
    ): React.ReactNode => {
      return (
        <WrappedComponent {...mergeProps(props, this.props)} />
      )
    }
  }

  return WrapperComponent
}
