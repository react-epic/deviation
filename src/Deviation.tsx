import * as React from 'react'
import { noop } from 'rxjs'

import { AnyConstructorType } from './ConstructorType'
import {
  Consumer,
  IPureDeviationState,
  PureDeviation
} from './PureDeviation'
import { Store } from './Store'

export interface IDeviationProps {
  providers?: AnyConstructorType<Store<any, any>>[]
  children?: JSX.Element
  handleError?(e: Error): void
}

export class Deviation extends React.Component<
  IDeviationProps
> {
  public static defaultProps: IDeviationProps = {
    providers: [],
    handleError: noop
  }

  public render(): React.ReactNode {
    return <Consumer>{this.renderContext}</Consumer>
  }

  public renderContext = (
    context: IPureDeviationState
  ): React.ReactNode => {
    return (
      <PureDeviation
        providers={this.props.providers}
        defaultProviders={context.providers}
        handleError={this.props.handleError}
      >
        {this.props.children}
      </PureDeviation>
    )
  }
}
