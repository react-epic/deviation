import * as React from 'react'

export class ErrorBoundary extends React.Component {
  public componentDidCatch(
    error: Error,
    info: React.ErrorInfo
  ): void {
    // tslint:disable-next-line:no-console
    console.log(error, info)
  }

  public render(): React.ReactNode {
    return this.props.children
  }
}
