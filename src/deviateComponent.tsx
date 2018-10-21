import * as React from 'react'

import { Connector } from './Connector'
import { AnyConstructorType } from './ConstructorType'
import { Consumer, IDeviationState } from './Deviation'
import { IStoreRecord, InjectableRecord } from './Injectable'

export interface IComponentWrapperProps {}

export function deviateComponent(
  WrappedComponent: AnyConstructorType<React.Component>,
  injectables: InjectableRecord,
  mergeProps: (
    injectableProviders: IStoreRecord,
    props: IComponentWrapperProps
  ) => IComponentWrapperProps
) {
  class WrapperComponent extends React.Component<
    IComponentWrapperProps
  > {
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
