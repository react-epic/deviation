import React from 'react'
import { mount } from 'enzyme'

import { Inject, Deviation, Store } from '../src'

@Inject({
  bTalk: () => BTalk
})
export class ATalk extends Store {
  state = {
    received: false
  }

  storeDidMount() {
    this.send()
  }

  receive() {
    this.setState({ received: true })
  }

  send() {
    this.props.bTalk.receive()
  }
}

@Inject({
  aTalk: () => ATalk
})
export class BTalk extends Store {
  state = {
    received: false
  }

  storeDidMount() {
    this.send()
  }

  receive() {
    this.setState({ received: true })
  }

  send() {
    this.props.aTalk.receive()
  }
}

@Inject({
  aTalk: ATalk,
  bTalk: BTalk
})
export class CommunicateApp extends React.Component {
  render() {
    const { aTalk, bTalk } = this.props
    return (
      <div>
        <p id="a">{JSON.stringify(aTalk.state.received)}</p>
        <p id="b">{JSON.stringify(bTalk.state.received)}</p>
      </div>
    )
  }
}

export function createMountPoint() {
  return mount(
    <Deviation providers={[ATalk, BTalk]}>
      <CommunicateApp />
    </Deviation>
  )
}
