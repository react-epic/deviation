import React from 'react'

export class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    console.log(error, info)
  }

  render() {
    return this.props.children
  }
}
